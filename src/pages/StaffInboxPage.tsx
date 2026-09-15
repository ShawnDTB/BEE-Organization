import { StudioDesignSummary } from "../components/StudioDesignSummary";
import { useEffect, useRef, useState } from "react";
import {
  triageLabels,
  type InboxRow,
  type InboxDetail,
  type TriageStatus,
} from "../../shared/staff";
import { sizePlanLines, sizePlanTotal } from "../../shared/sizePlan";
import { projectBrief } from "../data/projectBrief";
import { downloadText } from "../data/download";

type Page = { requests: InboxRow[]; nextBefore: string | null };
export function StaffInboxPage() {
  const [email, setEmail] = useState("");
  const [locked, setLocked] = useState(false);
  const [rows, setRows] = useState<InboxRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [next, setNext] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<InboxDetail | null>(null);
  const [status, setStatus] = useState<TriageStatus>("new");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const pending = useRef<{ signature: string; eventId: string } | null>(null);
  const listGeneration = useRef(0);
  const sessionEpoch = useRef(0);
  const dirty = !!detail && (!!note.trim() || status !== detail.status);
  function mayLeaveReview() {
    return (
      !dirty ||
      window.confirm("Discard the unsaved review changes on this screen?")
    );
  }
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function lock() {
    sessionEpoch.current++;
    listGeneration.current++;
    setLocked(true);
    setEmail("");
    setRows([]);
    setDetail(null);
    setSelected(null);
    setNote("");
    pending.current = null;
  }
  async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const epoch = sessionEpoch.current;
    const response = await fetch(path, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      signal: init.signal || AbortSignal.timeout(20000),
    });
    if (epoch !== sessionEpoch.current) throw new Error("Workspace locked.");
    if (
      response.status === 401 ||
      response.status === 403 ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      lock();
      throw new Error(
        "Staff sign-in is required. Reload this workspace after signing in.",
      );
    }
    const value = await response.json();
    if (epoch !== sessionEpoch.current) throw new Error("Workspace locked.");
    if (!response.ok)
      throw new Error(value.error || "The operation could not be confirmed.");
    return value as T;
  }
  async function list(cursor?: string) {
    const generation = ++listGeneration.current;
    setLoading(true);
    setError("");
    if (!cursor) {
      setRows([]);
      setNext(null);
    }
    try {
      const session = await api<{ email: string }>("/api/staff/session");
      const page = await api<Page>(
        `/api/staff/inbox?status=${encodeURIComponent(filter)}${cursor ? `&before=${encodeURIComponent(cursor)}` : ""}`,
      );
      if (generation !== listGeneration.current) return;
      setEmail(session.email);
      setLocked(false);
      setRows((previous) =>
        cursor
          ? [
              ...previous,
              ...page.requests.filter(
                (row) => !previous.some((p) => p.id === row.id),
              ),
            ]
          : page.requests,
      );
      setNext(page.nextBefore);
    } catch (e) {
      if (generation === listGeneration.current) setError((e as Error).message);
    } finally {
      if (generation === listGeneration.current) setLoading(false);
    }
  }
  useEffect(() => {
    void list();
    return () => {
      listGeneration.current++;
    };
  }, [filter]);
  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    setDetail(null);
    setError("");
    setMessage("");
    setNote("");
    pending.current = null;
    api<InboxDetail>(`/api/staff/inbox/${selected}`, {
      signal: controller.signal,
    })
      .then((value) => {
        if (!controller.signal.aborted) {
          setDetail(value);
          setStatus(value.status);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [selected]);
  async function refreshDetail() {
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    try {
      const value = await api<InboxDetail>(`/api/staff/inbox/${selected}`);
      setDetail(value);
      setStatus(value.status);
      pending.current = null;
      setMessage("Latest version loaded. Your unsaved note is still here.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!detail || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    const signature = JSON.stringify({
      id: detail.id,
      version: detail.version,
      status,
      note,
    });
    if (pending.current?.signature !== signature)
      pending.current = { signature, eventId: crypto.randomUUID() };
    try {
      const value = await api<{ saved: true; request: InboxDetail }>(
        `/api/staff/inbox/${detail.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-BEE-Staff": "1" },
          body: JSON.stringify({
            eventId: pending.current.eventId,
            expectedVersion: detail.version,
            status,
            note,
          }),
        },
      );
      setDetail(value.request);
      setStatus(value.request.status);
      setNote("");
      pending.current = null;
      setRows((previous) =>
        previous
          .map((row) =>
            row.id === value.request.id
              ? {
                  ...row,
                  status: value.request.status,
                  version: value.request.version,
                  updatedAt: value.request.updatedAt,
                }
              : row,
          )
          .filter((row) => filter === "all" || row.status === filter),
      );
      setMessage("Review update saved. No customer message was sent.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const visible = rows.filter((row) =>
    [row.reference, row.name, row.organization, row.garment]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  if (locked)
    return (
      <section className="bee-page supporting-page">
        <span className="eyebrow">BEE staff workspace</span>
        <h1>Staff access is required.</h1>
        <p>
          This workspace opens after authorized business sign-in. If access has
          not been configured yet, customer requests remain protected.
        </p>
        {error && <p role="alert">{error}</p>}
        <button className="button" onClick={() => window.location.reload()}>
          Reload workspace
        </button>
        <p>
          <a href="/">Return to Works by BEE →</a>
        </p>
      </section>
    );
  return (
    <section className="bee-page staff-inbox">
      <header className="staff-title">
        <div>
          <span className="eyebrow">BEE operations</span>
          <h1>Make the next step clear.</h1>
          <p>
            Review requests, capture what is missing, and prepare the work for
            quoting.
          </p>
        </div>
        {email && (
          <div>
            <small>Signed in as {email}</small>
            <button
              onClick={() => {
                if (mayLeaveReview()) lock();
              }}
            >
              Hide customer details
            </button>
            <a href="/cdn-cgi/access/logout">Sign out</a>
          </div>
        )}
      </header>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="availability-note" role="status">
          {message}
        </p>
      )}
      <div className="staff-layout">
        <aside className="staff-list">
          <h2>Request inbox</h2>
          <label>
            Review status
            <select
              disabled={busy || loading}
              value={filter}
              onChange={(e) => {
                if (!mayLeaveReview()) return;
                setFilter(e.target.value);
                setSelected(null);
                setDetail(null);
              }}
            >
              <option value="all">All requests</option>
              {Object.entries(triageLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Search loaded requests
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, organization, garment or reference"
            />
          </label>
          <button disabled={loading || busy} onClick={() => void list()}>
            Refresh inbox
          </button>
          <p className="workspace-small">
            {rows.length} loaded · newest requests first
          </p>
          {loading && <p role="status">Loading requests…</p>}
          {!loading && visible.length === 0 && (
            <p>No matching requests in this view.</p>
          )}
          {visible.map((row) => (
            <button
              key={row.id}
              className="staff-request"
              disabled={busy}
              aria-pressed={selected === row.id}
              onClick={() => {
                if (selected !== row.id && mayLeaveReview())
                  setSelected(row.id);
              }}
            >
              <small>
                {triageLabels[row.status]} ·{" "}
                {new Date(row.receivedAt).toLocaleDateString()}
              </small>
              <strong>{row.organization || row.name}</strong>
              <span>
                {row.garment || "Garment to discuss"} ·{" "}
                {row.quantity || "Quantity to discuss"}
              </span>
            </button>
          ))}
          {next && (
            <button disabled={loading || busy} onClick={() => void list(next)}>
              Load older requests
            </button>
          )}
        </aside>
        <div className="staff-detail">
          {!detail ? (
            <div className="workspace-empty">
              <h2>
                {selected ? "Opening the request…" : "Start with one request."}
              </h2>
              <p>
                Choose an inquiry to see the original brief and its internal
                review history.
              </p>
            </div>
          ) : (
            <>
              <header>
                <span className="eyebrow">{triageLabels[detail.status]}</span>
                <h2>{detail.organization || detail.name}</h2>
                <code>{detail.reference}</code>
                <p>
                  Received {new Date(detail.receivedAt).toLocaleString()} ·
                  review version {detail.version}
                </p>
              </header>
              <div className="bee-actions">
                <button disabled={busy} onClick={() => void refreshDetail()}>
                  Refresh this request
                </button>
                <button
                  onClick={() =>
                    downloadText(
                      `BEE-${detail.id}-brief.txt`,
                      projectBrief(
                        detail.snapshot.intake,
                        detail.snapshot.items,
                        {
                          reference: detail.reference,
                          receivedAt: detail.receivedAt,
                        },
                      ),
                    )
                  }
                >
                  Download original brief
                </button>
              </div>
              <section className="request-review">
                <h3>Original customer request</h3>
                <p>
                  This record is preserved as submitted. Review notes below do
                  not change it.
                </p>
                <dl>
                  {Object.entries({
                    Name: detail.snapshot.intake.name,
                    Email: detail.snapshot.intake.email,
                    Phone: detail.snapshot.intake.phone,
                    Garments: detail.snapshot.intake.garment,
                    Quantity: detail.snapshot.intake.quantity,
                    Artwork: detail.snapshot.intake.artwork,
                    "Need-by date": detail.snapshot.intake.deadline,
                    Fulfillment: detail.snapshot.intake.fulfillment,
                    Personalization: detail.snapshot.intake.personalization,
                    Notes: detail.snapshot.intake.notes,
                  }).map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value || "To be discussed"}</dd>
                    </div>
                  ))}
                </dl>
                {detail.snapshot.intake.sizePlan && (
                  <div>
                    <h4>Group size plan</h4>
                    <p>
                      {detail.snapshot.intake.sizePlan.garment} ·{" "}
                      {detail.snapshot.intake.sizePlan.color}
                    </p>
                    <p>
                      {sizePlanLines(detail.snapshot.intake.sizePlan)} —{" "}
                      {sizePlanTotal(detail.snapshot.intake.sizePlan)} total
                    </p>
                  </div>
                )}
                {detail.snapshot.items.map((item) => (
                  <article className="staff-design" key={item.id}>
                    <h4>{item.design?.name || item.productSlug}</h4>
                    <p>
                      {item.quantity} × {item.size} · {item.color} ·{" "}
                      {item.decoration}
                    </p>
                    {item.design && !item.design.document && (
                      <p>
                        {item.design.view} / {item.design.placement} ·{" "}
                        {item.design.text}
                      </p>
                    )}
                    {item.design?.document && (
                      <StudioDesignSummary document={item.design.document} />
                    )}
                    {item.design?.artworkData && (
                      <img
                        src={item.design.artworkData}
                        alt="Customer's submitted artwork preview"
                      />
                    )}
                  </article>
                ))}
              </section>
              <form
                className="staff-review-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void save();
                }}
              >
                <fieldset disabled={busy}>
                  <legend>Record an internal review</legend>
                  <label>
                    Next review status
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as TriageStatus)
                      }
                    >
                      {Object.entries(triageLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Internal note
                    <textarea
                      rows={4}
                      maxLength={2000}
                      required={
                        status === "archived" || status === "needs-details"
                      }
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What did you review? What does the customer need to clarify?"
                    />
                  </label>
                  <p>
                    Internal only. Changing status does not send email, issue a
                    quote, approve artwork, or start production.
                  </p>
                  <button
                    className="button"
                    disabled={
                      busy || (status === detail.status && !note.trim())
                    }
                  >
                    {busy ? "Saving review…" : "Save review update"}
                  </button>
                </fieldset>
              </form>
              <section className="staff-history">
                <h3>Review history</h3>
                <p>
                  Latest 50 updates. The full history is retained in the request
                  record.
                </p>
                {detail.events.length === 0 && <p>No review updates yet.</p>}
                {detail.events.map((event) => (
                  <article key={event.id}>
                    <strong>{triageLabels[event.status]}</strong>
                    <small>
                      {event.actorEmail} ·{" "}
                      {new Date(event.createdAt).toLocaleString()} · v
                      {event.version}
                    </small>
                    {event.note && <p>{event.note}</p>}
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
