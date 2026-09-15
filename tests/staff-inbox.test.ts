import { beforeAll, beforeEach, afterEach, expect, it } from "vitest";
import {
  generateKeyPair,
  exportJWK,
  createLocalJWKSet,
  SignJWT,
  type JWTVerifyGetKey,
} from "jose";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { authenticateStaff } from "../server/staffAuth";
import { handleStaffInbox } from "../server/staffInbox";
import type { Env, Statement } from "../server/intake";
import { emptyProjectIntake } from "../src/data/projectStore";
let key: CryptoKey,
  otherKey: CryptoKey,
  keys: JWTVerifyGetKey,
  sqlite: DatabaseSync,
  env: Env,
  token: string,
  id: string;
const origin = "https://worksbybee.com",
  issuer = "https://bee-test.cloudflareaccess.com";
beforeAll(async () => {
  const pair = await generateKeyPair("RS256", { extractable: true });
  key = pair.privateKey;
  otherKey = (await generateKeyPair("RS256")).privateKey;
  keys = createLocalJWKSet({
    keys: [{ ...(await exportJWK(pair.publicKey)), kid: "test", alg: "RS256" }],
  });
});
async function sign(patch: Record<string, unknown> = {}, signingKey = key) {
  return new SignJWT({
    email: "brian@example.com",
    sub: "person-brian",
    iss: issuer,
    aud: "staff-app",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300,
    ...patch,
  })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .sign(signingKey);
}
function prepare(sql: string): Statement {
  let values: unknown[] = [];
  return {
    bind(...params) {
      values = params;
      return this;
    },
    async first<T>() {
      return (sqlite.prepare(sql).get(...(values as never[])) as T) || null;
    },
    async run() {
      return sqlite.prepare(sql).run(...(values as never[]));
    },
    async all<T>() {
      return {
        results: sqlite.prepare(sql).all(...(values as never[])) as T[],
      };
    },
  };
}
function seed() {
  const requestId = crypto.randomUUID();
  sqlite
    .prepare("INSERT INTO quote_requests VALUES (?, ?, ?, ?, ?)")
    .run(
      requestId,
      `BEE-${requestId}`,
      "fingerprint",
      "2026-09-15T00:00:00Z",
      JSON.stringify({
        intake: {
          ...emptyProjectIntake,
          name: "Example organizer",
          email: "customer@example.com",
          garment: "Polos",
          quantity: "20",
        },
        items: [],
        consent: true,
      }),
    );
  return requestId;
}
beforeEach(async () => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys=ON");
  sqlite.exec(readFileSync("migrations/0001_quote_requests.sql", "utf8"));
  sqlite.exec(readFileSync("migrations/0002_staff_triage.sql", "utf8"));
  env = {
    APP_ORIGIN: origin,
    ACCESS_TEAM_DOMAIN: issuer,
    ACCESS_AUD: "staff-app",
    STAFF_EMAILS: "brian@example.com, shawn@example.com",
    DB: { prepare },
  };
  token = await sign();
  id = seed();
});
afterEach(() => sqlite.close());
function req(
  path = "/api/staff/inbox",
  body?: unknown,
  overrides: Record<string, string> = {},
) {
  return new Request(origin + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Cf-Access-Jwt-Assertion": token,
      Origin: origin,
      "Content-Type": "application/json",
      "X-BEE-Staff": "1",
      ...overrides,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const update = (patch: Record<string, unknown> = {}) => ({
  eventId: crypto.randomUUID(),
  expectedVersion: 0,
  status: "reviewing",
  note: "Artwork needs a closer look",
  ...patch,
});
it("verifies signature, issuer, audience, expiry and allowed person", async () => {
  expect(await authenticateStaff(req(), env, keys)).toEqual({
    subject: "person-brian",
    email: "brian@example.com",
  });
  for (const patch of [
    { iss: "https://other.cloudflareaccess.com" },
    { aud: "customer-app" },
    { exp: 1 },
    { email: "stranger@example.com" },
    { sub: "" },
    { exp: undefined },
    { iat: Math.floor(Date.now() / 1000) + 1000 },
  ]) {
    token = await sign(patch);
    expect(await authenticateStaff(req(), env, keys)).toBeNull();
  }
  token = await sign({}, otherKey);
  expect(await authenticateStaff(req(), env, keys)).toBeNull();
});
it("rejects absent configuration, raw identity headers and operator bearer tokens", async () => {
  expect(
    (await handleStaffInbox(req(), { ...env, ACCESS_AUD: "" }, keys)).status,
  ).toBe(403);
  token = "";
  const response = await handleStaffInbox(
    req(undefined, undefined, {
      Authorization: `Bearer ${"a".repeat(48)}`,
      "Cf-Access-Authenticated-User-Email": "brian@example.com",
    }),
    env,
    keys,
  );
  expect(response.status).toBe(403);
  expect(await response.text()).not.toContain("customer@example.com");
  expect(response.headers.get("cache-control")).toContain("no-store");
});
it("returns a session identity and minimal inbox summaries without artwork or customer email", async () => {
  expect(
    await (await handleStaffInbox(req("/api/staff/session"), env, keys)).json(),
  ).toEqual({ email: "brian@example.com" });
  const response = await handleStaffInbox(req(), env, keys);
  const value = (await response.json()) as any;
  expect(value.requests[0]).toMatchObject({ id, status: "new", version: 0 });
  expect(JSON.stringify(value)).not.toContain("customer@example.com");
  expect(value.requests[0].snapshot).toBeUndefined();
});
it("preserves the original and appends an attributed review event", async () => {
  const before = sqlite
    .prepare("SELECT snapshot_json FROM quote_requests")
    .get();
  const response = await handleStaffInbox(
    req(`/api/staff/inbox/${id}`, update({ actorEmail: "forged@example.com" })),
    env,
    keys,
  );
  expect(response.status).toBe(201);
  const value = (await response.json()) as any;
  expect(value.request).toMatchObject({ status: "reviewing", version: 1 });
  expect(value.request.events[0].actorEmail).toBe("brian@example.com");
  expect(
    sqlite.prepare("SELECT snapshot_json FROM quote_requests").get(),
  ).toEqual(before);
  expect(() => sqlite.exec("UPDATE request_events SET note='changed'")).toThrow(
    "Review events cannot be edited",
  );
});
it("recovers a lost-response retry without duplicate events and rejects changed reuse", async () => {
  const body = update();
  await handleStaffInbox(req(`/api/staff/inbox/${id}`, body), env, keys);
  expect(
    (await handleStaffInbox(req(`/api/staff/inbox/${id}`, body), env, keys))
      .status,
  ).toBe(200);
  expect(
    (
      await handleStaffInbox(
        req(`/api/staff/inbox/${id}`, { ...body, note: "Different" }),
        env,
        keys,
      )
    ).status,
  ).toBe(409);
  expect(
    sqlite.prepare("SELECT COUNT(*) AS count FROM request_events").get()?.count,
  ).toBe(1);
});
it("prevents stale or concurrent reviewers from overwriting each other", async () => {
  const results = await Promise.all([
    handleStaffInbox(req(`/api/staff/inbox/${id}`, update()), env, keys),
    handleStaffInbox(
      req(
        `/api/staff/inbox/${id}`,
        update({ status: "needs-details", note: "Confirm logo" }),
      ),
      env,
      keys,
    ),
  ]);
  expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
  expect(
    (await handleStaffInbox(req(`/api/staff/inbox/${id}`, update()), env, keys))
      .status,
  ).toBe(409);
});
it("checks origin, content type, size and review fields before writing", async () => {
  expect(
    (
      await handleStaffInbox(
        req(`/api/staff/inbox/${id}`, update(), {
          Origin: "https://elsewhere.example",
        }),
        env,
        keys,
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await handleStaffInbox(
        req(`/api/staff/inbox/${id}`, update(), {
          "Content-Type": "text/plain",
        }),
        env,
        keys,
      )
    ).status,
  ).toBe(415);
  for (const body of [
    update({ status: "paid" }),
    update({ status: "archived", note: "" }),
    update({ note: "x".repeat(17000) }),
    update({ expectedVersion: 1.5 }),
    update({ eventId: "bad" }),
  ])
    expect(
      (await handleStaffInbox(req(`/api/staff/inbox/${id}`, body), env, keys))
        .status,
    ).toBe(400);
  expect(
    sqlite.prepare("SELECT COUNT(*) AS count FROM request_events").get()?.count,
  ).toBe(0);
});
it("filters review state on the server and paginates tied timestamps without skips", async () => {
  for (let n = 0; n < 27; n++) seed();
  const first = (await (
    await handleStaffInbox(req(), env, keys)
  ).json()) as any;
  const second = (await (
    await handleStaffInbox(
      req(`/api/staff/inbox?before=${encodeURIComponent(first.nextBefore)}`),
      env,
      keys,
    )
  ).json()) as any;
  expect(first.requests).toHaveLength(25);
  expect(second.requests).toHaveLength(3);
  expect(
    new Set([...first.requests, ...second.requests].map((r) => r.id)).size,
  ).toBe(28);
  await handleStaffInbox(
    req(
      `/api/staff/inbox/${id}`,
      update({ status: "archived", note: "Customer postponed" }),
    ),
    env,
    keys,
  );
  const archived = (await (
    await handleStaffInbox(req("/api/staff/inbox?status=archived"), env, keys)
  ).json()) as any;
  expect(archived.requests).toHaveLength(1);
  expect(archived.requests[0].id).toBe(id);
});
it("returns bounded private errors for missing database, invalid cursors and missing requests", async () => {
  expect(
    (await handleStaffInbox(req(), { ...env, DB: undefined }, keys)).status,
  ).toBe(503);
  expect(
    (await handleStaffInbox(req("/api/staff/inbox?before=bad"), env, keys))
      .status,
  ).toBe(400);
  expect(
    (
      await handleStaffInbox(
        req(`/api/staff/inbox/${crypto.randomUUID()}`),
        env,
        keys,
      )
    ).status,
  ).toBe(404);
  expect(
    (
      await handleStaffInbox(
        new Request("https://alternate.example/api/staff/inbox", {
          headers: { "Cf-Access-Jwt-Assertion": token },
        }),
        env,
        keys,
      )
    ).status,
  ).toBe(403);
});
