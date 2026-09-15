import {
  MAX_REQUEST_BYTES,
  validateRequest,
  ValidationError,
} from "../shared/request";
import type { StaffAuthEnv } from "./staffAuth";
import { handleStaffInbox } from "./staffInbox";
export interface Statement {
  bind(...values: unknown[]): Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
  all<T>(): Promise<{ results: T[] }>;
}
export interface Database {
  prepare(sql: string): Statement;
}
export type Env = StaffAuthEnv & {
  DB?: Database;
  APP_ORIGIN?: string;
  INTAKE_ENABLED?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  STAFF_API_TOKEN?: string;
  CONTACT_EMAIL?: string;
  CONTACT_EMAIL_VERIFIED?: string;
};
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers });
export function enabled(env: Env) {
  return (
    env.INTAKE_ENABLED === "true" &&
    env.CONTACT_EMAIL_VERIFIED === "true" &&
    !!(
      env.DB &&
      env.APP_ORIGIN?.startsWith("https://") &&
      env.TURNSTILE_SITE_KEY &&
      env.TURNSTILE_SECRET_KEY &&
      env.STAFF_API_TOKEN &&
      env.STAFF_API_TOKEN.length >= 32 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.CONTACT_EMAIL || "")
    )
  );
}
async function readBody(request: Request) {
  if (Number(request.headers.get("Content-Length")) > MAX_REQUEST_BYTES)
    throw new ValidationError("Reduce the artwork previews before submitting.");
  const reader = request.body?.getReader();
  if (!reader) throw new ValidationError("Request details are required.");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new ValidationError(
        "Reduce the artwork previews before submitting.",
      );
    }
    chunks.push(value);
  }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    throw new ValidationError("Check the request format.");
  }
}
async function hash(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (n) => n.toString(16).padStart(2, "0"),
  ).join("");
}
async function staffAllowed(request: Request, env: Env) {
  if (!env.STAFF_API_TOKEN || env.STAFF_API_TOKEN.length < 32) return false;
  const token =
    request.headers.get("Authorization")?.replace(/^Bearer /, "") || "";
  if (token.length > 256) return false;
  return (await hash(token)) === (await hash(env.STAFF_API_TOKEN));
}
export async function handleIntake(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  if (
    url.pathname.startsWith("/api/staff/") &&
    url.pathname !== "/api/staff/requests"
  )
    return handleStaffInbox(request, env);
  try {
    if (url.pathname === "/api/intake/status" && request.method === "GET")
      return json({
        enabled: enabled(env),
        siteKey: enabled(env) ? env.TURNSTILE_SITE_KEY : null,
      });
    if (url.pathname === "/api/staff/requests" && request.method === "GET") {
      if (!env.DB || !(await staffAllowed(request, env)))
        return json({ error: "Access denied." }, 403);
      const cursor = url.searchParams.get("before");
      let after = "9999",
        afterId = "~";
      if (cursor) {
        try {
          const parts = atob(cursor).split("|");
          if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error();
          [after, afterId] = parts as [string, string];
        } catch {
          return json({ error: "Invalid pagination cursor." }, 400);
        }
      }
      const rows = await env.DB.prepare(
        "SELECT request_id, reference, received_at, snapshot_json FROM quote_requests WHERE received_at < ? OR (received_at = ? AND request_id < ?) ORDER BY received_at DESC, request_id DESC LIMIT 50",
      )
        .bind(after, after, afterId)
        .all<{
          request_id: string;
          reference: string;
          received_at: string;
          snapshot_json: string;
        }>();
      return json({
        requests: rows.results.map((row) => ({
          reference: row.reference,
          receivedAt: row.received_at,
          snapshot: JSON.parse(row.snapshot_json),
        })),
        nextBefore:
          rows.results.length === 50
            ? btoa(
                `${rows.results[49]!.received_at}|${rows.results[49]!.request_id}`,
              )
            : null,
      });
    }
    if (url.pathname !== "/api/requests")
      return json({ error: "Not found." }, 404);
    if (request.method !== "POST") return json({ error: "Use POST." }, 405);
    if (!enabled(env))
      return json(
        {
          error:
            "Online requests are not available yet. Your draft has not been sent.",
        },
        503,
      );
    if (
      url.origin !== env.APP_ORIGIN ||
      request.headers.get("Origin") !== env.APP_ORIGIN ||
      request.headers.get("Sec-Fetch-Site") === "cross-site" ||
      request.headers.get("X-BEE-Request") !== "1"
    )
      return json({ error: "Refresh this page and try again." }, 403);
    if (
      request.headers.get("Content-Type")?.split(";")[0] !== "application/json"
    )
      return json({ error: "Send JSON." }, 415);
    const raw = await readBody(request);
    const data = validateRequest(raw);
    if (data.website)
      return json({ error: "This request could not be accepted." }, 400);
    const snapshot = JSON.stringify({
      intake: data.intake,
      items: data.items,
      consent: true,
    });
    const fingerprint = await hash(snapshot);
    // The random request identity allows a lost-response retry to recover its receipt.
    // Only a matching payload can recover it; no customer record is returned here.
    const existing = await env
      .DB!.prepare(
        "SELECT reference, received_at, fingerprint FROM quote_requests WHERE request_id = ?",
      )
      .bind(data.requestId)
      .first<{ reference: string; received_at: string; fingerprint: string }>();
    if (existing)
      return existing.fingerprint === fingerprint
        ? json({
            reference: existing.reference,
            receivedAt: existing.received_at,
          })
        : json(
            {
              error:
                "This request changed after submission. Save it as a new request.",
            },
            409,
          );
    const token = raw.turnstileToken;
    if (typeof token !== "string" || token.length < 1 || token.length > 2048)
      return json({ error: "Complete the security check." }, 400);
    const verification = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP") || undefined,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    const verified = (await verification.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    if (
      !verification.ok ||
      !verified.success ||
      verified.hostname !== new URL(env.APP_ORIGIN!).hostname ||
      verified.action !== "quote"
    )
      return json({ error: "Complete the security check again." }, 400);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateKey = await hash(`${env.STAFF_API_TOKEN}:quote:${ip}`);
    const seconds = Math.floor(Date.now() / 1000);
    const limit = await env
      .DB!.prepare(
        "INSERT INTO intake_limits (key_hash, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(key_hash) DO UPDATE SET attempts=CASE WHEN expires_at <= ? THEN 1 ELSE attempts+1 END, expires_at=CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END RETURNING attempts",
      )
      .bind(rateKey, seconds + 3600, seconds, seconds)
      .first<{ attempts: number }>();
    if (!limit || limit.attempts > 20)
      return json(
        {
          error:
            "Too many requests. Your draft is safe; please try again in an hour.",
        },
        429,
      );
    const now = new Date().toISOString();
    const reference = `BEE-${crypto.randomUUID().toUpperCase()}`;
    await env
      .DB!.prepare(
        "INSERT INTO quote_requests (request_id, reference, fingerprint, received_at, snapshot_json) VALUES (?, ?, ?, ?, ?) ON CONFLICT(request_id) DO NOTHING",
      )
      .bind(data.requestId, reference, fingerprint, now, snapshot)
      .run();
    const saved = await env
      .DB!.prepare(
        "SELECT reference, received_at, fingerprint FROM quote_requests WHERE request_id = ?",
      )
      .bind(data.requestId)
      .first<{ reference: string; received_at: string; fingerprint: string }>();
    if (!saved || saved.fingerprint !== fingerprint)
      return json(
        { error: "This request changed during submission. Please review it." },
        409,
      );
    return json(
      { reference: saved.reference, receivedAt: saved.received_at },
      201,
    );
  } catch (error) {
    return json(
      {
        error:
          error instanceof ValidationError
            ? error.message
            : "The request could not be confirmed. Keep this page open and retry; your details remain available.",
      },
      error instanceof ValidationError ? 400 : 503,
    );
  }
}
