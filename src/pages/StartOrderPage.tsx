import { shopOptions } from "../content/storefront";
import { DesignBriefSummary } from "../components/DesignBriefSummary";
import { StudioDesignSummary } from "../components/StudioDesignSummary";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  createProject,
  readBag,
  readProjectDraft,
  saveProjectDraft,
  snapshotItems,
  readStorage,
  write,
  type ProjectIntake,
} from "../data/projectStore";
import { validateRequest, type QuoteRequest } from "../../shared/request";
import { downloadText } from "../data/download";
import { Turnstile } from "../components/Turnstile";
import { siteConfig } from "../content/siteContent";
import { projectBrief } from "../data/projectBrief";
import { sizePlanLines, sizePlanTotal } from "../../shared/sizePlan";

type Receipt = { reference: string; receivedAt: string };
const types = [
  ["bulk", "Group / business"],
  ["creator", "Creator merchandise"],
  ["custom", "Personal project"],
  ["unsure", "Help me choose"],
] as const;
const studioGarments = {
  tee: "T-shirts",
  hoodie: "Hoodies",
  polo: "Polos",
};
export function StartOrderPage() {
  const [items] = useState(readBag);
  const [snapshots] = useState(() => snapshotItems(items));
  const attachedGarments = [
    ...new Set(
      snapshots.flatMap((item) => (item.design ? [item.design.garment] : [])),
    ),
  ];
  const attachedQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const [shopChoice, setShopChoice] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const option = shopOptions.find((item) => item.id === params.get("item"));
    const saved = readProjectDraft();
    return option && saved.garment && saved.garment !== option.garment
      ? option
      : null;
  });
  const [data, setData] = useState<ProjectIntake>(() => {
    const saved = readProjectDraft();
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const option = shopOptions.find((item) => item.id === params.get("item"));
    const next =
      !saved.garment && types.some(([key]) => key === type)
        ? { ...saved, type: type as ProjectIntake["type"] }
        : saved;
    // A shop link preselects an item only for an empty draft. Never overwrite
    // an existing customer brief or its sizes/designs without their choice.
    const selected =
      option && !next.garment ? { ...next, garment: option.garment } : next;
    return {
      ...selected,
      garment:
        selected.garment ||
        selected.sizePlan?.garment ||
        (attachedGarments.length === 1 && snapshots.every((item) => item.design)
          ? studioGarments[attachedGarments[0]!]
          : ""),
      quantity:
        selected.quantity ||
        (selected.sizePlan
          ? String(sizePlanTotal(selected.sizePlan))
          : attachedQuantity
            ? String(attachedQuantity)
            : ""),
    };
  });
  const garmentMismatch =
    !!data.garment &&
    attachedGarments.some(
      (garment) =>
        !new RegExp(
          garment === "tee"
            ? "\\b(?:tee|tees|t-shirt|t-shirts)\\b"
            : garment === "hoodie"
              ? "\\bhoodies?\\b"
              : "\\bpolos?\\b",
          "i",
        ).test(data.garment),
    );
  const quantityMismatch =
    /^\d+$/.test(data.quantity) && Number(data.quantity) !== attachedQuantity;
  const [availability, setAvailability] = useState<{
    enabled: boolean;
    siteKey?: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [saved, setSaved] = useState(false);
  const [website, setWebsite] = useState("");
  const pending = useRef<{ signature: string; id: string } | null>(null);
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/intake/status", { signal: controller.signal })
      .then(async (response) => {
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("application/json")
        )
          throw new Error();
        return response.json();
      })
      .then((value) =>
        setAvailability({
          enabled: value.enabled === true && typeof value.siteKey === "string",
          siteKey: value.siteKey,
        }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setAvailability({ enabled: false });
      });
    const timeout = window.setTimeout(() => {
      controller.abort();
      setAvailability((current) => current ?? { enabled: false });
    }, 10000);
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  function update<K extends keyof ProjectIntake>(
    key: K,
    value: ProjectIntake[K],
  ) {
    const next = { ...data, [key]: value };
    setData(next);
    setSaved(false);
    try {
      saveProjectDraft(next);
    } catch {
      /* Global notice explains that download remains available. */
    }
  }
  function move(next: number) {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function resolveShopChoice(useSelected: boolean) {
    if (useSelected && shopChoice) update("garment", shopChoice.garment);
    setShopChoice(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("item");
    url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => heading.current?.focus());
  }
  const exportRequest = () =>
    downloadText(
      "BEE-project-request.json",
      JSON.stringify(
        {
          label: receipt
            ? "Request recorded by BEE"
            : "Draft — not sent to BEE",
          receipt,
          intake: data,
          items: snapshots,
        },
        null,
        2,
      ),
      "application/json",
    );
  const exportBrief = () =>
    downloadText(
      "BEE-project-brief.txt",
      projectBrief(data, snapshots, receipt),
    );
  function saveDraft() {
    try {
      createProject(data, items, undefined, snapshots);
      setSaved(true);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      submitting.current ||
      receipt ||
      step !== 3 ||
      shopChoice ||
      !availability?.enabled ||
      !consent ||
      !token
    )
      return;
    submitting.current = true;
    setError("");
    setBusy(true);
    try {
      const signature = JSON.stringify({ intake: data, items: snapshots });
      if (!pending.current) {
        try {
          pending.current = JSON.parse(
            readStorage("bee-pending-request") || "null",
          );
        } catch {
          pending.current = null;
        }
      }
      if (!pending.current || pending.current.signature !== signature)
        pending.current = { signature, id: crypto.randomUUID() };
      const request: QuoteRequest = validateRequest({
        requestId: pending.current.id,
        intake: data,
        items: snapshots,
        consent,
        website,
      });
      try {
        write("bee-pending-request", pending.current);
      } catch {
        /* In-memory retry identity is still retained. */
      }
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-BEE-Request": "1" },
        body: JSON.stringify({ ...request, turnstileToken: token }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error(
          "The request service did not respond. Your request has not been confirmed.",
        );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "We could not confirm the request.");
      if (
        typeof result.reference !== "string" ||
        typeof result.receivedAt !== "string"
      )
        throw new Error(
          "The request service returned an incomplete confirmation. Please retry.",
        );
      setReceipt(result);
      try {
        createProject(data, items, result, snapshots);
      } catch {
        setError(
          "BEE received your request, but this device could not save its copy. Download your confirmation below.",
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Please retry. Your draft is still available.",
      );
      setToken("");
      setAttempt((n) => n + 1);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <section className="bee-page request-complete">
        <span className="eyebrow">Request received</span>
        <h1>One step closer to made.</h1>
        <p>
          Your request has been recorded for BEE to review. It is not a
          confirmed production order or a payment receipt.
        </p>
        <dl>
          <div>
            <dt>Reference</dt>
            <dd>{receipt.reference}</dd>
          </div>
          <div>
            <dt>Contact email</dt>
            <dd>{data.email}</dd>
          </div>
        </dl>
        <p>
          No confirmation email has been sent by this site. Keep a copy of this
          reference.
        </p>
        {error && <p role="alert">{error}</p>}
        <div className="bee-actions">
          <button onClick={exportBrief}>Download readable brief</button>
          <button className="button" onClick={exportRequest}>
            Download confirmation
          </button>
          <a href="/account">My projects →</a>
        </div>
      </section>
    );
  return (
    <section className="bee-page quote-page">
      <div className="quote-topbar">
        <a className="sf-flow-back" href="/shop">
          ← Back to shop
        </a>
        <span>Custom order planner · Step {step} of 3</span>
      </div>
      <div className="quote-intro">
        <header>
          <span className="eyebrow">Custom by BEE</span>
          <h1>Plan your custom piece.</h1>
          <p>
            Choose your piece, add the details, and review your idea. No payment
            is taken here.
          </p>
        </header>
        {availability?.enabled === false && (
          <aside className="availability-note">
            <strong>Online submission is being prepared.</strong>
            <p>Save or download your brief. It won't be sent to BEE yet.</p>
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`}>
                Email {siteConfig.email} →
              </a>
            )}
          </aside>
        )}
      </div>
      {items.length > 0 && (
        <section
          className="request-review request-attached-context"
          aria-label="Attached custom pieces"
        >
          <h2>Your custom pieces are attached.</h2>
          <p>
            {snapshots
              .map(
                (item) =>
                  `${item.quantity} × ${item.design ? studioGarments[item.design.garment] : item.productSlug}`,
              )
              .join(" · ")}
          </p>
          {garmentMismatch || quantityMismatch ? (
            <p role="status">
              Your brief has different garment or quantity details. Review the
              attached designs and update the brief if needed; your saved
              details have been kept.
            </p>
          ) : (
            <p>
              Review the designs alongside your project details before sending.
            </p>
          )}
          <a href="/cart">Review attached designs →</a>
        </section>
      )}
      {shopChoice && (
        <section
          className="request-review quote-shop-choice"
          aria-labelledby="shop-choice-heading"
        >
          <h2 id="shop-choice-heading">You already have a brief started.</h2>
          <p>
            You chose {shopChoice.garment.toLowerCase()} in the shop. Your saved
            brief is for {data.garment}. Choose which item to use. Your notes,
            sizes, and attached designs will stay in this brief for you to
            review.
          </p>
          <div className="bee-actions">
            <button type="button" onClick={() => resolveShopChoice(true)}>
              Use {shopChoice.garment.toLowerCase()} for this brief
            </button>
            <button type="button" onClick={() => resolveShopChoice(false)}>
              Keep my saved item
            </button>
          </div>
        </section>
      )}
      <div className="quote-layout">
        <div>
          <nav className="quote-steps" aria-label="Request steps">
            {["Project", "Details", "Contact & review"].map((label, index) => (
              <button
                key={label}
                disabled={busy || !!shopChoice}
                aria-current={step === index + 1 ? "step" : undefined}
                onClick={() => move(index + 1)}
              >
                <span>0{index + 1}</span>
                {label}
              </button>
            ))}
          </nav>
          <form onSubmit={submit} className="quote-form">
            <fieldset disabled={busy || !!shopChoice}>
              <h2 ref={heading} tabIndex={-1}>
                {
                  [
                    "What are you making?",
                    "What should we know?",
                    "Review your request",
                  ][step - 1]
                }
              </h2>
              {step === 1 && (
                <>
                  {data.type === "bulk" && (
                    <a className="text-link" href="/group-planner">
                      Organizing sizes? Use the group planner →
                    </a>
                  )}
                  <div className="project-type-options">
                    {types.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={data.type === value}
                        onClick={() => update("type", value)}
                      >
                        {label}
                        <span className="project-type-check" aria-hidden="true">
                          {data.type === value ? "✓" : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="quote-fields quote-fields--primary">
                    <label>
                      Garments or items
                      <input
                        maxLength={200}
                        value={data.garment}
                        onChange={(e) => update("garment", e.target.value)}
                        placeholder="Polos for the team, hoodies for a merch drop…"
                      />
                    </label>
                    <label>
                      Estimated quantity
                      <input
                        maxLength={80}
                        value={data.quantity}
                        onChange={(e) => update("quantity", e.target.value)}
                        placeholder="About 30 pieces, or still deciding"
                      />
                    </label>
                  </div>
                  <button
                    className="button"
                    type="button"
                    onClick={() => move(2)}
                  >
                    Continue →
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="quote-fields">
                    <label>
                      Artwork status
                      <select
                        value={data.artwork}
                        onChange={(e) => update("artwork", e.target.value)}
                      >
                        <option value="">Help me choose</option>
                        <option>Production-ready artwork available</option>
                        <option>Artwork needs review</option>
                        <option>Concept only — design help needed</option>
                      </select>
                    </label>
                    <label>
                      Need-by date
                      <input
                        type="date"
                        value={data.deadline}
                        onChange={(e) => update("deadline", e.target.value)}
                      />
                    </label>
                    <label>
                      Fulfillment
                      <select
                        value={data.fulfillment}
                        onChange={(e) => update("fulfillment", e.target.value)}
                      >
                        <option value="">To be discussed</option>
                        <option>Pickup</option>
                        <option>Bulk delivery</option>
                        <option>Shipping</option>
                      </select>
                    </label>
                    <label>
                      Personalization or size breakdown
                      <input
                        maxLength={500}
                        value={data.personalization}
                        onChange={(e) =>
                          update("personalization", e.target.value)
                        }
                        placeholder="Names, numbers, 10 medium + 15 large…"
                      />
                    </label>
                  </div>
                  <label>
                    Project notes
                    <textarea
                      rows={5}
                      maxLength={4000}
                      value={data.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Who it’s for, the occasion, colors, or questions."
                    />
                  </label>
                  <div className="bee-actions">
                    <button type="button" onClick={() => move(1)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="button"
                      onClick={() => move(3)}
                    >
                      Contact & review →
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <section
                    className="request-review"
                    aria-label="Project details to review"
                  >
                    <h3>Check the details before sharing</h3>
                    <dl>
                      {(
                        [
                          ["Garments", data.garment],
                          ["Estimated quantity", data.quantity],
                          ["Artwork", data.artwork],
                          ["Need-by date", data.deadline],
                          ["Fulfillment", data.fulfillment],
                          ["Personalization", data.personalization],
                          ["Project notes", data.notes],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value || "To be discussed"}</dd>
                        </div>
                      ))}
                    </dl>
                    <button type="button" onClick={() => move(2)}>
                      Edit project details
                    </button>
                    <button type="button" onClick={() => move(1)}>
                      Edit garments or quantity
                    </button>
                  </section>
                  <p id="contact-help">
                    {availability?.enabled
                      ? "Your name and email are required to send a request. Other contact details are optional."
                      : "Contact details are optional while you plan. You can save or download this brief without them."}
                  </p>
                  <div className="quote-fields">
                    <label>
                      Your name
                      <input
                        required={availability?.enabled === true}
                        aria-describedby="contact-help"
                        maxLength={120}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => update("name", e.target.value)}
                      />
                    </label>
                    <label>
                      Organization or brand
                      <input
                        maxLength={160}
                        autoComplete="organization"
                        value={data.organization}
                        onChange={(e) => update("organization", e.target.value)}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        required={availability?.enabled === true}
                        aria-describedby="contact-help"
                        type="email"
                        maxLength={254}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                    </label>
                    <label>
                      Phone (optional)
                      <input
                        type="tel"
                        maxLength={40}
                        autoComplete="tel"
                        value={data.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="bee-honeypot" aria-hidden="true">
                    <label>
                      Website
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="quote-consent">
                    <input
                      type="checkbox"
                      disabled={!availability?.enabled}
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      BEE may review these details and contact me about this
                      project. I have permission to use any attached artwork.{" "}
                      <a href="/privacy">How your information is used</a>.
                    </span>
                  </label>
                  {availability?.enabled && availability.siteKey && (
                    <Turnstile
                      siteKey={availability.siteKey}
                      onToken={setToken}
                      attempt={attempt}
                    />
                  )}
                  <p className="quote-note">
                    This is a request for a quote, not a purchase. Review the
                    price and artwork with BEE before choosing to pay; approve
                    the final proof before production. Only PNG, JPEG and WebP
                    mockup previews are attached here; original production files
                    are arranged during review.
                  </p>
                  <button
                    className="button"
                    disabled={
                      !availability?.enabled ||
                      !consent ||
                      !token ||
                      busy ||
                      !!shopChoice
                    }
                    type="submit"
                  >
                    {busy
                      ? "Confirming your request…"
                      : availability === null
                        ? "Checking availability…"
                        : availability.enabled
                          ? "Send request to BEE"
                          : "Online submission unavailable"}
                  </button>
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
            </fieldset>
          </form>
          <div className="request-save-tools">
            <button disabled={busy} onClick={exportBrief}>
              Download readable brief
            </button>
            <button disabled={busy || saved} onClick={saveDraft}>
              {saved
                ? "Draft saved on this device"
                : "Save a local project draft"}
            </button>
            <details className="request-more-tools">
              <summary>More options</summary>
              <button onClick={exportRequest}>Download request</button>
            </details>
            <span role="status">
              {saved && "Draft saved on this device. "}
              Your contact details remain on this device until you submit.
              Downloads may contain personal information and artwork.
            </span>
          </div>
        </div>
        <aside className="quote-summary">
          <h2>{data.organization || "Your project"}</h2>
          <dl>
            <div>
              <dt>Project</dt>
              <dd>{types.find(([type]) => type === data.type)?.[1]}</dd>
            </div>
            <div>
              <dt>Garment</dt>
              <dd>{data.garment || "To be discussed"}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>
                {data.quantity ||
                  items.reduce((n, item) => n + item.quantity, 0) ||
                  "To be discussed"}
              </dd>
            </div>
            <div>
              <dt>Need-by date</dt>
              <dd>{data.deadline || "Flexible / not set"}</dd>
            </div>
          </dl>
          {data.sizePlan && (
            <section
              className="request-size-plan"
              aria-label="Attached group size plan"
            >
              <h3>Attached size plan</h3>
              <p>
                {data.sizePlan.garment} ·{" "}
                {data.sizePlan.color || "Color to be discussed"}
              </p>
              <p>{sizePlanLines(data.sizePlan)}</p>
              <strong>{sizePlanTotal(data.sizePlan)} planned pieces</strong>
              {(data.quantity !== String(sizePlanTotal(data.sizePlan)) ||
                data.garment !== data.sizePlan.garment) && (
                <p role="status">
                  Your project summary differs from this size plan. Review the
                  totals and garment before sending.
                </p>
              )}
              <p>
                Size-plan counts describe the group. They are not added to
                Studio design quantities.
              </p>
              <a href="/group-planner">Edit size plan →</a>
              <button
                disabled={busy}
                type="button"
                onClick={() => update("sizePlan", undefined)}
              >
                Remove size plan from request
              </button>
            </section>
          )}
          {snapshots.map((item) => (
            <div className="quote-design" key={item.id}>
              {item.design?.document && (
                <>
                  <StudioDesignSummary document={item.design.document} />
                  <DesignBriefSummary brief={item.design.brief} />
                </>
              )}
              {item.design?.artworkData && (
                <img src={item.design.artworkData} alt="Your artwork preview" />
              )}
              <strong>{item.design?.name || item.productSlug}</strong>
              <span>
                {item.quantity} × {item.size} · {item.color}
              </span>
              {item.design?.text && <small>{item.design.text}</small>}
            </div>
          ))}
          {items.length > 0 && <a href="/cart">Review attached designs →</a>}
          <div className="quote-next">
            <strong>What happens next?</strong>
            <p>
              Once received, BEE reviews the fit, clarifies the details, and
              prepares a quote. You review the price before choosing to pay and
              approve the final proof before production.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
