import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
export type StaffAuthEnv = {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  STAFF_EMAILS?: string;
  APP_ORIGIN?: string;
};
export type StaffIdentity = { subject: string; email: string };
let cached:
  { domain: string; keys: ReturnType<typeof createRemoteJWKSet> } | undefined;
export function staffConfigured(env: StaffAuthEnv) {
  return (
    /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(
      env.ACCESS_TEAM_DOMAIN || "",
    ) &&
    !!env.ACCESS_AUD &&
    !!env.STAFF_EMAILS?.trim() &&
    !!env.APP_ORIGIN
  );
}
export async function authenticateStaff(
  request: Request,
  env: StaffAuthEnv,
  keysOverride?: JWTVerifyGetKey,
): Promise<StaffIdentity | null> {
  if (!staffConfigured(env) || new URL(request.url).origin !== env.APP_ORIGIN)
    return null;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 16384) return null;
  try {
    const domain = env.ACCESS_TEAM_DOMAIN!;
    if (!keysOverride && cached?.domain !== domain)
      cached = {
        domain,
        keys: createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`), {
          timeoutDuration: 5000,
          cacheMaxAge: 600000,
        }),
      };
    const { payload } = await jwtVerify(token, keysOverride || cached!.keys, {
      issuer: domain,
      audience: env.ACCESS_AUD!,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "sub", "email"],
      clockTolerance: 5,
    });
    if (
      typeof payload.email !== "string" ||
      typeof payload.sub !== "string" ||
      !payload.sub ||
      payload.sub.length > 255
    )
      return null;
    if (typeof payload.iat !== "number" || payload.iat > Date.now() / 1000 + 5)
      return null;
    const email = payload.email.toLowerCase();
    const allowed = env
      .STAFF_EMAILS!.split(",")
      .map((value) => value.trim().toLowerCase());
    if (!allowed.includes(email)) return null;
    return { subject: payload.sub, email };
  } catch {
    return null;
  }
}
