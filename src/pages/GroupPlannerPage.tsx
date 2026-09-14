import { useState } from "react";
import {
  apparelSizes,
  sizePlanTotal,
  sizePlanLines,
  validateSizePlan,
  type SizePlan,
} from "../../shared/sizePlan";
import {
  readProjectDraft,
  readStorage,
  write,
  saveProjectDraft,
} from "../data/projectStore";
import { downloadText } from "../data/download";
const key = "bee-size-planner-v1";
function initial(): SizePlan {
  try {
    return validateSizePlan(JSON.parse(readStorage(key) || "null"));
  } catch {
    return (
      readProjectDraft().sizePlan || {
        garment: "T-shirts",
        color: "",
        counts: {},
      }
    );
  }
}
export function GroupPlannerPage() {
  const [plan, setPlan] = useState(initial);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const total = sizePlanTotal(plan);
  function update(next: SizePlan) {
    setPlan(next);
    setConfirm(false);
    setSaved(false);
    setError("");
    try {
      write(key, next);
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function transfer() {
    try {
      const validated = validateSizePlan(plan);
      const existing = readProjectDraft();
      if (
        !confirm &&
        (existing.garment || existing.quantity || existing.sizePlan)
      ) {
        setConfirm(true);
        return;
      }
      saveProjectDraft({
        type: "bulk",
        garment: validated.garment,
        quantity: String(sizePlanTotal(validated)),
        sizePlan: validated,
      });
      window.location.assign("/start-order?type=bulk");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <section className="bee-page supporting-page size-planner">
      <span className="eyebrow">For the person organizing it all</span>
      <h1>
        Count the sizes.
        <br />
        Keep the group moving.
      </h1>
      <p>
        Turn a headcount into a clear apparel plan. No participant names,
        accounts, or design files needed. This is a local planning tool—not a
        shared collection link.
      </p>
      <div className="planner-layout">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            transfer();
          }}
        >
          <div className="quote-fields">
            <label>
              Garment / item
              <input
                required
                maxLength={120}
                value={plan.garment}
                onChange={(e) => update({ ...plan, garment: e.target.value })}
              />
            </label>
            <label>
              Preferred color
              <input
                maxLength={80}
                value={plan.color}
                onChange={(e) => update({ ...plan, color: e.target.value })}
                placeholder="Navy, or help us choose"
              />
            </label>
          </div>
          <fieldset className="size-counts">
            <legend>Pieces by size</legend>
            {apparelSizes.map((size) => (
              <label key={size}>
                {size}
                <input
                  aria-label={`${size} pieces`}
                  type="number"
                  min={0}
                  max={10000}
                  step={1}
                  inputMode="numeric"
                  value={plan.counts[size] ?? ""}
                  onChange={(e) =>
                    update({
                      ...plan,
                      counts: {
                        ...plan.counts,
                        [size]:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
            ))}
          </fieldset>
          <p>
            Plan one garment/color combination here. These are requested size
            labels, not a manufacturer's size chart. Confirm the garment's
            measurements and available sizes before ordering.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {confirm && (
            <aside className="availability-note">
              <strong>Update the current request?</strong>
              <p>
                This replaces its garment, estimated quantity, and size plan.
                Your contact details, notes, personalization, and Studio designs
                stay unchanged.
              </p>
              <button type="button" onClick={() => setConfirm(false)}>
                Keep editing the plan
              </button>
            </aside>
          )}
          <button className="button" type="submit">
            {confirm
              ? "Confirm and continue to request →"
              : "Use this plan in my request →"}
          </button>
          <p role="status" className="workspace-small">
            {saved
              ? "Plan saved on this device. Nothing sent to BEE."
              : "Nothing is sent to BEE from this planner."}
          </p>
        </form>
        <aside className="planner-summary">
          <span className="eyebrow">The headcount, organized</span>
          <strong className="planner-total">
            {Number.isFinite(total) ? total : "—"}
          </strong>
          <p>planned pieces</p>
          <h2>{plan.garment || "Your garment"}</h2>
          <p>{sizePlanLines(plan) || "Add counts to see your breakdown."}</p>
          <button
            type="button"
            onClick={() => {
              try {
                const p = validateSizePlan(plan);
                downloadText(
                  "BEE-size-plan.txt",
                  `DRAFT — NOT SENT TO BEE\n${p.garment}\nColor: ${p.color || "To be discussed"}\n${sizePlanLines(p)}\nTotal: ${sizePlanTotal(p)} pieces\nSizes and availability require confirmation.\n`,
                );
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Download size plan
          </button>
          <p>
            Need multiple garments? Note additional combinations in your
            request. A rough total is also fine if sizes are not ready.
          </p>
          <a className="text-link" href="/start-order?type=bulk">
            Start with a rough headcount instead →
          </a>
        </aside>
      </div>
    </section>
  );
}
