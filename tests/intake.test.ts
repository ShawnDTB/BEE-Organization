import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { handleIntake, type Env, type Statement } from "../server/intake";
import { validateRequest, MAX_REQUEST_BYTES } from "../shared/request";
let sqlite: DatabaseSync;
let env: Env;
const origin = "https://worksbybee.com";
const payload = () => ({
  requestId: crypto.randomUUID(),
  consent: true,
  website: "",
  turnstileToken: "verified",
  items: [],
  intake: {
    type: "bulk",
    name: "Test Organizer",
    email: "test@example.com",
    phone: "",
    organization: "Test Team",
    garment: "Polos",
    quantity: "24",
    artwork: "Logo ready",
    deadline: "",
    fulfillment: "Pickup",
    personalization: "",
    notes: "Test data",
  },
});
const request = (data: unknown, headers: Record<string, string> = {}) =>
  new Request(`${origin}/api/requests`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "X-BEE-Request": "1",
      ...headers,
    },
    body: JSON.stringify(data),
  });
const bot: typeof fetch = async () =>
  new Response(
    JSON.stringify({
      success: true,
      hostname: "worksbybee.com",
      action: "quote",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
function prepare(sql: string): Statement {
  let params: unknown[] = [];
  return {
    bind(...values) {
      params = values;
      return this;
    },
    async first<T>() {
      return (sqlite.prepare(sql).get(...(params as never[])) as T) || null;
    },
    async run() {
      return sqlite.prepare(sql).run(...(params as never[]));
    },
    async all<T>() {
      return {
        results: sqlite.prepare(sql).all(...(params as never[])) as T[],
      };
    },
  };
}
beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync("migrations/0001_quote_requests.sql", "utf8"));
  env = {
    DB: { prepare },
    APP_ORIGIN: origin,
    INTAKE_ENABLED: "true",
    TURNSTILE_SITE_KEY: "test",
    TURNSTILE_SECRET_KEY: "test-secret",
    STAFF_API_TOKEN: "a".repeat(48),
    CONTACT_EMAIL: "projects@example.com",
    CONTACT_EMAIL_VERIFIED: "true",
  };
});
afterEach(() => sqlite.close());
describe("Quote intake", () => {
  it("stores validated group counts in the immutable request snapshot", async () => {
    const data = payload();
    const planned = {
      ...data,
      intake: {
        ...data.intake,
        sizePlan: { garment: "Polos", color: "Navy", counts: { M: 12, L: 12 } },
      },
    };
    expect((await handleIntake(request(planned), env, bot)).status).toBe(201);
    const row = sqlite
      .prepare("SELECT snapshot_json FROM quote_requests")
      .get() as { snapshot_json: string };
    expect(JSON.parse(row.snapshot_json).intake.sizePlan.counts).toEqual({
      M: 12,
      L: 12,
    });
    expect(
      (
        await handleIntake(
          request({
            ...planned,
            requestId: crypto.randomUUID(),
            intake: {
              ...planned.intake,
              sizePlan: { ...planned.intake.sizePlan, counts: { M: -1 } },
            },
          }),
          env,
          bot,
        )
      ).status,
    ).toBe(400);
  });
  it("fails closed without configured storage/contact/operations", async () => {
    for (const patch of [
      { DB: undefined },
      { CONTACT_EMAIL: "" },
      { CONTACT_EMAIL_VERIFIED: "false" },
      { STAFF_API_TOKEN: "" },
      { INTAKE_ENABLED: "false" },
    ]) {
      expect(
        (await handleIntake(request(payload()), { ...env, ...patch }, bot))
          .status,
      ).toBe(503);
    }
  });
  it("reports availability without exposing secrets", async () => {
    const body = await (
      await handleIntake(new Request(`${origin}/api/intake/status`), env)
    ).json();
    expect(body).toEqual({ enabled: true, siteKey: "test" });
  });
  it("stores normalized original details and returns a receipt", async () => {
    const data = payload();
    data.intake.email = "TEST@EXAMPLE.COM";
    const response = await handleIntake(request(data), env, bot);
    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const receipt = await response.json();
    expect(receipt.reference).toMatch(/^BEE-/);
    const row = sqlite
      .prepare("SELECT snapshot_json FROM quote_requests")
      .get() as { snapshot_json: string };
    expect(JSON.parse(row.snapshot_json).intake.email).toBe("test@example.com");
    expect(row.snapshot_json).not.toContain("turnstileToken");
  });
  it("recovers a lost-response retry without another record or bot token", async () => {
    const data = payload();
    const first = await (await handleIntake(request(data), env, bot)).json();
    data.turnstileToken = "";
    const retry = await handleIntake(request(data), env, bot);
    expect(retry.status).toBe(200);
    expect(await retry.json()).toEqual(first);
    expect(
      sqlite.prepare("SELECT count(*) AS n FROM quote_requests").get()?.n,
    ).toBe(1);
  });
  it("rejects a changed payload using an already-submitted identity", async () => {
    const data = payload();
    await handleIntake(request(data), env, bot);
    data.intake.quantity = "999";
    expect((await handleIntake(request(data), env, bot)).status).toBe(409);
  });
  it("deduplicates concurrent submissions", async () => {
    const data = payload();
    const results = await Promise.all([
      handleIntake(request(data), env, bot),
      handleIntake(request(data), env, bot),
    ]);
    const receipts = await Promise.all(results.map((r) => r.json()));
    expect(receipts[0]).toEqual(receipts[1]);
    expect(
      sqlite.prepare("SELECT count(*) AS n FROM quote_requests").get()?.n,
    ).toBe(1);
  });
  it("rejects cross-origin and non-JSON submissions", async () => {
    expect(
      (
        await handleIntake(
          request(payload(), { Origin: "https://other.example" }),
          env,
          bot,
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await handleIntake(
          request(payload(), { "Content-Type": "text/plain" }),
          env,
          bot,
        )
      ).status,
    ).toBe(415);
  });
  it("requires consent, valid contact and clean honeypot", async () => {
    for (const data of [
      { ...payload(), consent: false },
      { ...payload(), website: "spam" },
      { ...payload(), intake: { ...payload().intake, email: "invalid" } },
    ])
      expect((await handleIntake(request(data), env, bot)).status).toBe(400);
  });
  it("rejects invalid calendar dates and fractional item quantities", () => {
    const data = payload();
    data.intake.deadline = "2026-02-30";
    expect(() => validateRequest(data)).toThrow();
    const invalid = {
      ...payload(),
      items: [
        {
          id: "a",
          productSlug: "tee",
          color: "Black",
          size: "M",
          quantity: 1.5,
          decoration: "Graphic",
        },
      ],
    };
    expect(() => validateRequest(invalid)).toThrow();
  });
  it("requires matching bot hostname and action", async () => {
    for (const wrong of [
      { hostname: "other.example", action: "quote" },
      { hostname: "worksbybee.com", action: "login" },
    ]) {
      const invalid: typeof fetch = async () =>
        new Response(JSON.stringify({ success: true, ...wrong }));
      expect(
        (await handleIntake(request(payload()), env, invalid)).status,
      ).toBe(400);
    }
  });
  it("does not confirm a failed database write", async () => {
    const broken = {
      ...env,
      DB: {
        prepare: (sql: string) => {
          const statement = prepare(sql);
          if (sql.startsWith("INSERT INTO quote_requests"))
            statement.run = async () => {
              throw new Error("private DB failure");
            };
          return statement;
        },
      },
    };
    const response = await handleIntake(request(payload()), broken, bot);
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private DB failure");
  });
  it("does not expose the queue to a public visitor", async () => {
    await handleIntake(request(payload()), env, bot);
    const publicResponse = await handleIntake(
      new Request(`${origin}/api/staff/requests`),
      env,
    );
    expect(publicResponse.status).toBe(403);
    expect(await publicResponse.text()).not.toContain("test@example.com");
    const staff = await handleIntake(
      new Request(`${origin}/api/staff/requests`, {
        headers: { Authorization: `Bearer ${env.STAFF_API_TOKEN}` },
      }),
      env,
    );
    expect((await staff.json()).requests).toHaveLength(1);
  });
  it("prevents mutation of an issued snapshot at the database layer", async () => {
    await handleIntake(request(payload()), env, bot);
    expect(() =>
      sqlite.exec("UPDATE quote_requests SET snapshot_json='{}'"),
    ).toThrow("Original request snapshots cannot be edited");
  });
  it("limits new submissions without preventing receipt recovery", async () => {
    const first = payload();
    await handleIntake(request(first), env, bot);
    for (let i = 1; i < 20; i++)
      expect((await handleIntake(request(payload()), env, bot)).status).toBe(
        201,
      );
    expect((await handleIntake(request(payload()), env, bot)).status).toBe(429);
    expect((await handleIntake(request(first), env, bot)).status).toBe(200);
  });
  it("rejects oversized streamed bodies before parsing", async () => {
    const response = await handleIntake(
      request({ junk: "x".repeat(MAX_REQUEST_BYTES + 1) }),
      env,
      bot,
    );
    expect(response.status).toBe(400);
  });
});

it("paginates equal-timestamp requests without skipping records", async () => {
  for (let n = 0; n < 55; n++)
    sqlite
      .prepare("INSERT INTO quote_requests VALUES (?, ?, ?, ?, ?)")
      .run(
        `id-${String(n).padStart(2, "0")}`,
        `BEE-${n}`,
        "fingerprint",
        "2026-09-14T00:00:00Z",
        "{}",
      );
  const headers = { Authorization: `Bearer ${env.STAFF_API_TOKEN}` };
  const first = await (
    await handleIntake(
      new Request(`${origin}/api/staff/requests`, { headers }),
      env,
    )
  ).json();
  const second = await (
    await handleIntake(
      new Request(
        `${origin}/api/staff/requests?before=${encodeURIComponent(first.nextBefore)}`,
        { headers },
      ),
      env,
    )
  ).json();
  expect(first.requests).toHaveLength(50);
  expect(second.requests).toHaveLength(5);
  expect(
    new Set([...first.requests, ...second.requests].map((row) => row.reference))
      .size,
  ).toBe(55);
});
