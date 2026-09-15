import { authenticateStaff } from "./staffAuth";
import type { JWTVerifyGetKey } from "jose";
import type { Env } from "./intake";
import {
  triageLabels,
  type InboxRow,
  type TriageStatus,
} from "../shared/staff";
export const staffHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, private",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  Vary: "Cookie, Cf-Access-Jwt-Assertion",
  "Referrer-Policy": "no-referrer",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: staffHeaders });
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const select = `SELECT q.request_id AS id, q.reference, q.received_at AS receivedAt, json_extract(q.snapshot_json, '$.intake.name') AS name, json_extract(q.snapshot_json, '$.intake.organization') AS organization, json_extract(q.snapshot_json, '$.intake.garment') AS garment, json_extract(q.snapshot_json, '$.intake.quantity') AS quantity, json_extract(q.snapshot_json, '$.intake.deadline') AS deadline, COALESCE(e.status, 'new') AS status, COALESCE(e.version, 0) AS version, COALESCE(e.created_at, q.received_at) AS updatedAt FROM quote_requests q LEFT JOIN request_events e ON e.request_id=q.request_id AND e.version=(SELECT MAX(version) FROM request_events WHERE request_id=q.request_id)`;
async function detail(env: Env, id: string) {
  const row = await env
    .DB!.prepare(`${select} WHERE q.request_id=?`)
    .bind(id)
    .first<InboxRow>();
  if (!row) return null;
  const original = await env
    .DB!.prepare("SELECT snapshot_json FROM quote_requests WHERE request_id=?")
    .bind(id)
    .first<{ snapshot_json: string }>();
  const events = await env
    .DB!.prepare(
      "SELECT event_id AS id, version, status, note, actor_email AS actorEmail, created_at AS createdAt FROM request_events WHERE request_id=? ORDER BY version DESC LIMIT 50",
    )
    .bind(id)
    .all();
  return {
    ...row,
    snapshot: JSON.parse(original!.snapshot_json),
    events: events.results,
  };
}
async function smallBody(request: Request) {
  if (Number(request.headers.get("Content-Length")) > 16000) throw new Error();
  const reader = request.body?.getReader();
  if (!reader) throw new Error();
  const decoder = new TextDecoder();
  let result = "",
    length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 16000) {
      await reader.cancel();
      throw new Error();
    }
    result += decoder.decode(value, { stream: true });
  }
  result += decoder.decode();
  return JSON.parse(result);
}
export async function handleStaffInbox(
  request: Request,
  env: Env,
  keysOverride?: JWTVerifyGetKey,
) {
  const identity = await authenticateStaff(request, env, keysOverride);
  if (!identity)
    return json(
      {
        error:
          "Staff access is unavailable or your session is not authorized. Open the staff workspace after signing in through the configured business access service.",
      },
      403,
    );
  const url = new URL(request.url);
  if (url.pathname === "/api/staff/session" && request.method === "GET")
    return json({ email: identity.email });
  if (!env.DB)
    return json({ error: "The request database is not connected." }, 503);
  try {
    if (url.pathname === "/api/staff/inbox" && request.method === "GET") {
      const status = url.searchParams.get("status") || "all";
      if (status !== "all" && !Object.hasOwn(triageLabels, status))
        return json({ error: "Choose a valid review status." }, 400);
      let before = "9999",
        beforeId = "~";
      const cursor = url.searchParams.get("before");
      if (cursor) {
        try {
          if (cursor.length > 200) throw new Error();
          const parts = atob(cursor).split("|");
          if (
            parts.length !== 2 ||
            !uuid.test(parts[1]!) ||
            !/^\d{4}-\d{2}-\d{2}T/.test(parts[0]!)
          )
            throw new Error();
          [before, beforeId] = parts as [string, string];
        } catch {
          return json({ error: "Invalid page cursor." }, 400);
        }
      }
      const rows = await env.DB.prepare(
        `${select} WHERE (q.received_at < ? OR (q.received_at = ? AND q.request_id < ?)) AND (?='all' OR COALESCE(e.status,'new')=?) ORDER BY q.received_at DESC, q.request_id DESC LIMIT 26`,
      )
        .bind(before, before, beforeId, status, status)
        .all<InboxRow>();
      const requests = rows.results.slice(0, 25),
        last = requests.at(-1);
      return json({
        requests,
        nextBefore:
          rows.results.length > 25 && last
            ? btoa(`${last.receivedAt}|${last.id}`)
            : null,
      });
    }
    const match = /^\/api\/staff\/inbox\/([^/]+)$/.exec(url.pathname);
    if (!match || !uuid.test(match[1]!))
      return json({ error: "Request not found." }, 404);
    const id = match[1]!;
    if (request.method === "GET") {
      const row = await detail(env, id);
      return row ? json(row) : json({ error: "Request not found." }, 404);
    }
    if (request.method !== "POST")
      return json({ error: "Method not allowed." }, 405);
    if (
      request.headers.get("Origin") !== env.APP_ORIGIN ||
      request.headers.get("Sec-Fetch-Site") === "cross-site" ||
      request.headers.get("X-BEE-Staff") !== "1"
    )
      return json({ error: "Refresh the workspace before saving." }, 403);
    if (
      request.headers.get("Content-Type")?.split(";")[0] !== "application/json"
    )
      return json({ error: "Send JSON." }, 415);
    let body;
    try {
      body = await smallBody(request);
    } catch {
      return json({ error: "Check the update format and size." }, 400);
    }
    if (
      !body ||
      !uuid.test(body.eventId || "") ||
      !Number.isInteger(body.expectedVersion) ||
      body.expectedVersion < 0 ||
      body.expectedVersion > 1000000 ||
      typeof body.status !== "string" ||
      !Object.hasOwn(triageLabels, body.status) ||
      typeof body.note !== "string" ||
      body.note.length > 2000 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(body.note)
    )
      return json(
        { error: "Choose a status and keep notes within 2,000 characters." },
        400,
      );
    const note = body.note.trim(),
      status = body.status as TriageStatus;
    if (["needs-details", "archived"].includes(status) && !note)
      return json(
        {
          error:
            "Add a note explaining what is needed or why this is archived.",
        },
        400,
      );
    const previous = await env.DB.prepare(
      "SELECT request_id, version, status, note, actor_subject FROM request_events WHERE event_id=?",
    )
      .bind(body.eventId)
      .first<{
        request_id: string;
        version: number;
        status: string;
        note: string;
        actor_subject: string;
      }>();
    if (previous)
      return previous.request_id === id &&
        previous.version === body.expectedVersion + 1 &&
        previous.status === status &&
        previous.note === note &&
        previous.actor_subject === identity.subject
        ? json({ saved: true, request: await detail(env, id) })
        : json(
            {
              error:
                "This update identity was already used for different details.",
            },
            409,
          );
    const current = await env.DB.prepare(`${select} WHERE q.request_id=?`)
      .bind(id)
      .first<InboxRow>();
    if (!current) return json({ error: "Request not found." }, 404);
    if (current.version !== body.expectedVersion)
      return json(
        {
          error:
            "Another update was saved. Refresh this request and review it before trying again.",
        },
        409,
      );
    if (current.status === status && !note)
      return json({ error: "Change the status or add a review note." }, 400);
    try {
      await env.DB.prepare(
        "INSERT INTO request_events (event_id, request_id, version, status, note, actor_subject, actor_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
        .bind(
          body.eventId,
          id,
          body.expectedVersion + 1,
          status,
          note,
          identity.subject,
          identity.email,
          new Date().toISOString(),
        )
        .run();
    } catch {
      // A competing review can win the unique (request_id, version) constraint.
      return json(
        {
          error:
            "The update was not confirmed. Refresh the request to check for a concurrent change, or retry the same update.",
        },
        409,
      );
    }
    return json({ saved: true, request: await detail(env, id) }, 201);
  } catch {
    return json(
      {
        error:
          "The staff inbox could not complete this operation. Your update has not been confirmed; retry without changing it if the connection was lost.",
      },
      503,
    );
  }
}
