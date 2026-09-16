import { ArtworkReview } from "./ArtworkReview";
import { briefFields, emptyBrief } from "../../shared/designBrief";
import { DesignBriefSummary } from "../components/DesignBriefSummary";
import { useEffect, useRef, useState } from "react";
import type { StudioDocument, StudioLayer, Surface } from "../../shared/studio";
import { surfacePreview } from "../../shared/studio";
import type { StudioDraft } from "../data/projectStore";
import { GarmentSvg } from "../pages/StudioPageV3";
import { GUIDE_NAME, templates, type GuideCommand } from "./guide";

type Props = {
  draft: StudioDraft;
  doc: StudioDocument;
  surface: Surface;
  setSurface: (s: Surface) => void;
  update: (p: Partial<StudioDraft>) => void;
  patch: (id: string, p: Partial<StudioLayer>) => void;
  command: (c: GuideCommand | string) => void;
  applyTemplate: (
    id: string,
    title: string,
    detail: string,
    color: string,
  ) => void;
  upload: () => void;
  advanced: () => void;
  save: (bag?: boolean) => boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  busy: boolean;
  hasWork: boolean;
  initialStep: "choose" | "edit";
};
export function GuidedStudio(p: Props) {
  const [step, setStep] = useState<"choose" | "edit" | "review">(p.initialStep);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [request, setRequest] = useState("");
  const [template, setTemplate] = useState("event");
  const [ink, setInk] = useState("#ffffff");
  const [showTemplates, setShowTemplates] = useState(false);
  const [helpCreate, setHelpCreate] = useState(false);
  const [briefStep, setBriefStep] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current)
      panel.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus();
    mounted.current = true;
  }, [step, helpCreate, briefStep, showTemplates]);
  const brief = p.draft.brief || emptyBrief();
  const texts = p.doc.surfaces[p.surface].filter(
    (l) => l.kind === "text" && !l.hidden,
  );
  const hasArtwork = Object.values(p.doc.surfaces).some((ls) =>
    ls.some((l) => !l.hidden),
  );
  function handoff() {
    if (p.save(true)) window.location.assign("/start-order");
  }
  return (
    <div className="bee-guided" ref={panel}>
      <nav className="bee-journey" aria-label="Design progress">
        {(["choose", "edit", "review"] as const).map((s, i) => (
          <button
            key={s}
            aria-current={step === s ? "step" : undefined}
            onClick={() => setStep(s)}
          >
            {i + 1}.{" "}
            {s === "choose"
              ? "Start your design"
              : s === "edit"
                ? "Make it yours"
                : "Review & continue"}
          </button>
        ))}
      </nav>
      {step === "choose" ? (
        <div className="bee-start-panel">
          <h2
            tabIndex={-1}
            data-step-heading={!helpCreate && !showTemplates ? true : undefined}
          >
            What would you like to make?
          </h2>
          <p>
            Choose a starting garment. BEE will help confirm the right product
            and decoration for your project.
          </p>
          <div className="bee-start-products">
            {(["tee", "hoodie", "polo"] as const).map((garment) => (
              <button
                key={garment}
                aria-pressed={p.draft.garment === garment}
                onClick={() =>
                  p.update({
                    garment,
                    decoration: garment === "polo" ? "embroidery" : "graphic",
                  })
                }
              >
                <GarmentSvg
                  garment={garment}
                  color={p.draft.color}
                  view="front"
                />
                {garment === "tee"
                  ? "T-shirt"
                  : garment === "hoodie"
                    ? "Hoodie"
                    : "Polo"}
              </button>
            ))}
          </div>
          <h2>How would you like to begin?</h2>
          <div className="bee-start-paths">
            <button
              onClick={() => {
                setHelpCreate(true);
                setShowTemplates(false);
                setBriefStep(0);
              }}
            >
              <strong>Help me create it</strong>
              <span>Start with your words and a ready-made layout.</span>
            </button>
            <button
              onClick={() => {
                setHelpCreate(false);
                setShowTemplates(true);
              }}
            >
              <strong>Use a template</strong>
              <span>Choose a layout, then make it your own.</span>
            </button>
            <button
              disabled={p.busy}
              onClick={() => {
                setStep("edit");
                p.upload();
              }}
            >
              <strong>Upload my design</strong>
              <span>Bring a PNG, JPEG or WebP image, up to 250 KB.</span>
            </button>
            <button onClick={p.advanced}>
              <strong>Start from scratch</strong>
              <span>Open the full editor and precise controls.</span>
            </button>
          </div>
          {p.hasWork && (
            <button onClick={() => setStep("edit")}>
              Continue my current design →
            </button>
          )}
          {helpCreate && (
            <form
              className="bee-template-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (briefStep < 2) {
                  setBriefStep((n) => n + 1);
                  return;
                }
                setHelpCreate(false);
                setShowTemplates(true);
              }}
            >
              <h3 tabIndex={-1} data-step-heading>
                {
                  [
                    "What are we making this for?",
                    "What should it look like?",
                    "Anything we should keep?",
                  ][briefStep]
                }
              </h3>
              <p>
                Question group {briefStep + 1} of 3 · Skip any answer you are
                unsure about.
              </p>
              {briefFields
                .filter(([key]) =>
                  (briefStep === 0
                    ? ["occasion", "audience"]
                    : briefStep === 1
                      ? ["subject", "style", "colors"]
                      : ["notes"]
                  ).includes(key),
                )
                .map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      maxLength={500}
                      value={brief[key]}
                      onChange={(e) =>
                        p.update({ brief: { ...brief, [key]: e.target.value } })
                      }
                      placeholder={
                        key === "subject"
                          ? "For example, a bulldog mascot"
                          : "Optional"
                      }
                    />
                  </label>
                ))}
              <p>
                Your answers stay with the project for BEE. The next step
                creates an editable text layout; it does not generate the
                requested mascot or illustration.
              </p>
              <div className="bee-guide-actions">
                {briefStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setBriefStep((n) => n - 1)}
                  >
                    Back
                  </button>
                )}
                <button type="submit" className="bee-primary">
                  {briefStep < 2 ? "Continue →" : "Choose a starting layout →"}
                </button>
              </div>
            </form>
          )}
          {showTemplates && (
            <form
              className="bee-template-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  p.doc.surfaces[p.surface].length &&
                  !window.confirm(
                    "Replace this side with a template? You can undo this change.",
                  )
                )
                  return;
                p.applyTemplate(template, title, detail, ink);
                setStep("edit");
              }}
            >
              <h3 tabIndex={-1} data-step-heading>
                Your words. Your starting point.
              </h3>
              <label>
                Choose a layout
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <p>{templates.find((t) => t.id === template)?.description}</p>
              <label>
                Main wording
                <input
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={templates.find((t) => t.id === template)?.title}
                />
              </label>
              <label>
                Supporting wording
                <input
                  maxLength={200}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder={templates.find((t) => t.id === template)?.detail}
                />
              </label>
              <label>
                Design color
                <input
                  type="color"
                  value={ink}
                  onChange={(e) => setInk(e.target.value)}
                />
              </label>
              <button className="bee-primary" type="submit">
                Use this layout →
              </button>
              <p>
                These are editable text layouts. For an illustration or mascot,
                upload artwork or ask BEE for help. AI image generation is not
                connected yet.
              </p>
            </form>
          )}
        </div>
      ) : (
        <div className="bee-guided-workspace">
          <div className="bee-guided-preview">
            <div className="bee-stagebar">
              {(["front", "back"] as const).map((s) => (
                <button
                  key={s}
                  aria-pressed={p.surface === s}
                  onClick={() => p.setSurface(s)}
                >
                  {s === "front" ? "Front" : "Back"} ·{" "}
                  {p.doc.surfaces[s].length}
                </button>
              ))}
              <button disabled={!p.canUndo} onClick={p.undo}>
                Undo
              </button>
              <button disabled={!p.canRedo} onClick={p.redo}>
                Redo
              </button>
            </div>
            <div className="bee-garment-preview">
              <GarmentSvg
                garment={p.draft.garment}
                color={p.draft.color}
                view={p.surface}
              />
              <img
                src={surfacePreview(p.doc, p.surface)}
                alt={`${p.surface} design on an approximate ${p.draft.garment} preview`}
              />
              <p>Placement preview · final dimensions confirmed by BEE</p>
            </div>
          </div>
          <div className="bee-guided-controls">
            {step === "edit" ? (
              <>
                <h2 tabIndex={-1} data-step-heading>
                  Make it yours.
                </h2>
                <label>
                  Garment color
                  <select
                    value={p.draft.color}
                    onChange={(e) => p.update({ color: e.target.value })}
                  >
                    <option value="#15191d">Black</option>
                    <option value="#343b41">Charcoal</option>
                    <option value="#1f2a3b">Navy</option>
                    <option value="#284d7f">Royal</option>
                    <option value="#273f34">Forest</option>
                    <option value="#d7d0c2">Bone</option>
                    <option value="#e8e8e4">White</option>
                  </select>
                </label>
                {texts.map((l, i) => (
                  <fieldset key={l.id} disabled={l.locked}>
                    <label>
                      Wording {i + 1}
                      <input
                        maxLength={200}
                        value={l.text}
                        onChange={(e) =>
                          p.patch(l.id, { text: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Text color
                      <input
                        type="color"
                        value={l.fill}
                        onChange={(e) =>
                          p.patch(l.id, { fill: e.target.value })
                        }
                      />
                    </label>
                  </fieldset>
                ))}
                <button disabled={p.busy} onClick={p.upload}>
                  Add artwork
                </button>
                <div
                  className="bee-guide-actions"
                  aria-label="Adjust whole design"
                >
                  {(["center", "larger", "smaller", "fit"] as const).map(
                    (c) => (
                      <button key={c} onClick={() => p.command(c)}>
                        {
                          {
                            center: "Center design",
                            larger: "Make larger",
                            smaller: "Make smaller",
                            fit: "Fit to board",
                          }[c]
                        }
                      </button>
                    ),
                  )}
                </div>
                <form
                  className="bee-guide-command"
                  onSubmit={(e) => {
                    e.preventDefault();
                    p.command(request);
                  }}
                >
                  <label>
                    {GUIDE_NAME}
                    <input
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="Try “center the design”"
                    />
                  </label>
                  <button type="submit">Apply request</button>
                  <p>
                    Quick commands: center the design, make it larger, make it
                    smaller, fit to board. Other requests and AI image
                    generation are not connected yet.
                  </p>
                </form>
                <button onClick={p.advanced}>Open Advanced controls</button>
                <button
                  className="bee-primary"
                  disabled={!hasArtwork}
                  onClick={() => setStep("review")}
                >
                  Review & continue →
                </button>
              </>
            ) : (
              <>
                <h2 tabIndex={-1} data-step-heading>
                  Ready for BEE?
                </h2>
                <DesignBriefSummary brief={p.draft.brief} />
                <ArtworkReview
                  doc={p.doc}
                  color={p.draft.color}
                  edit={p.advanced}
                />
                <p>
                  Review both sides and your exact wording. BEE confirms garment
                  availability, decoration size and your final proof before
                  production.
                </p>
                {(["front", "back"] as const).map((s) => (
                  <div key={s}>
                    <h3>{s === "front" ? "Front" : "Back"}</h3>
                    <p>
                      {p.doc.surfaces[s].filter((l) => !l.hidden).length}{" "}
                      visible design elements
                    </p>
                    {p.doc.surfaces[s].filter(
                      (l) =>
                        !l.hidden &&
                        (l.x < 0 ||
                          l.y < 0 ||
                          l.x + l.width > 600 ||
                          l.y + l.height > 800 ||
                          l.angle !== 0),
                    ).length > 0 && (
                      <p className="bee-review-warning">
                        Check this side in Advanced: artwork may extend beyond
                        the board or is rotated. Exports crop at the board edge.
                      </p>
                    )}
                  </div>
                ))}
                {p.draft.decoration === "embroidery" && (
                  <p>
                    Embroidery requires digitizing and a separate production
                    review.
                  </p>
                )}
                <label>
                  Approximate quantity
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={p.draft.quantity}
                    onChange={(e) =>
                      p.update({
                        quantity: Math.max(
                          1,
                          Math.min(10000, Number(e.target.value) || 1),
                        ),
                      })
                    }
                  />
                </label>
                <p>
                  Next, add your size breakdown, deadline and contact details.
                  Pricing is confirmed through a quote.
                </p>
                <button
                  className="bee-primary"
                  disabled={!hasArtwork}
                  onClick={handoff}
                >
                  Continue with this design →
                </button>
                <button onClick={() => setStep("edit")}>Keep editing</button>
              </>
            )}
            <button onClick={handoff}>
              Ask BEE for help with this project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
