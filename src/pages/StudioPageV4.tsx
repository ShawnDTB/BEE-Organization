import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { StaticCanvas, type Canvas } from "fabric";
import { validateDesign } from "../../shared/request";
import {
  emptyDocument,
  validateStudioDocument,
  surfacePreview,
  studioDescription,
  type StudioLayer,
  type Surface,
} from "../../shared/studio";
import {
  getDraft,
  saveStudioDraft,
  upsertBagItem,
  safeQuantity,
  type StudioDraft,
} from "../data/projectStore";
import { downloadText } from "../data/download";
import { FabricBoard, makeObject } from "../studio/FabricBoard";
import {
  changeDocument,
  migrateDraft,
  travel,
  layer,
  type History,
} from "../studio/document";
import { GarmentSvg } from "./StudioPageV3";
import "../styles/studio.css";
const RECOVERY = "bee-studio-recovery-v2";
const colors = [
  ["Black", "#15191d"],
  ["Charcoal", "#343b41"],
  ["Navy", "#1f2a3b"],
  ["Royal", "#284d7f"],
  ["Forest", "#273f34"],
  ["Bone", "#d7d0c2"],
  ["White", "#e8e8e4"],
];
const products = {
  tee: "creator-graphic-tee",
  hoodie: "heavyweight-creator-hoodie",
  polo: "embroidered-performance-polo",
};
function fresh(): StudioDraft {
  const now = new Date().toISOString();
  const requested = new URLSearchParams(location.search).get("garment");
  const garment =
    requested === "hoodie" || requested === "polo" ? requested : "tee";
  return {
    id: `studio-${crypto.randomUUID()}`,
    name: "My apparel design",
    garment,
    color: "#15191d",
    view: "front",
    decoration: garment === "polo" ? "embroidery" : "graphic",
    text: "",
    textColor: "#143b65",
    placement: "center-front",
    x: 50,
    y: 45,
    scale: 100,
    size: "M",
    quantity: 12,
    createdAt: now,
    updatedAt: now,
    document: emptyDocument(),
  };
}
function openDraft(d: StudioDraft): StudioDraft {
  const doc = migrateDraft(d);
  return {
    ...d,
    ...(!d.document
      ? {
          id: `studio-${crypto.randomUUID()}`,
          name: `${d.name.slice(0, 95)} — migrated copy`,
        }
      : {}),
    document: doc,
  };
}
function initial() {
  const params = new URLSearchParams(location.search);
  const found = getDraft(params.get("draft"));
  try {
    const raw = localStorage.getItem(RECOVERY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const requested = params.get("draft");
      if (
        (requested && parsed.id === requested) ||
        (!requested && !params.has("garment"))
      ) {
        return {
          draft: {
            ...validateDesign(parsed),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          message: "Recovered your latest studio work from this browser.",
        };
      }
    }
    if (found)
      return {
        draft: openDraft(found),
        message: found.document
          ? "Draft reopened."
          : "Opened a migrated copy. Check placement; your original draft is preserved.",
      };
  } catch {
    return {
      draft: fresh(),
      message:
        "The previous draft could not be opened. Your saved files have not been removed.",
    };
  }
  return {
    draft: fresh(),
    message: "Start with text, a shape, or your artwork.",
  };
}
export function StudioPageV4() {
  const [start] = useState(initial);
  const [draft, setDraft] = useState(start.draft);
  const [history, setHistory] = useState<History>({
    past: [],
    present: start.draft.document || emptyDocument(),
    future: [],
  });
  const [surface, setSurface] = useState<Surface>(start.draft.view);
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState(start.message);
  const [saveState, setSaveState] = useState("Preparing recovery");
  const [busy, setBusy] = useState(false);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const doc = history.present;
  const layers = doc.surfaces[surface];
  const active = layers.find((l) => l.id === selected);
  const importInput = useRef<HTMLInputElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
  const saved = useRef("");
  const docRef = useRef(doc);
  docRef.current = doc;
  const uploadEpoch = useRef(0);
  const working = {
    ...draft,
    name: draft.name.trim() || "My apparel design",
    document: doc,
    view: surface,
    text: "",
    artworkData: undefined,
    updatedAt: new Date().toISOString(),
  };
  const latest = useRef(working);
  latest.current = working;
  useEffect(() => {
    const save = () => {
      try {
        const value = latest.current;
        localStorage.setItem(RECOVERY, JSON.stringify(value));
        window.history.replaceState(
          {},
          "",
          `/studio?draft=${encodeURIComponent(value.id)}`,
        );
        saved.current = JSON.stringify({ draft, doc });
        setSaveState("Recovered automatically on this browser");
      } catch {
        setSaveState("Recovery failed — download your design now");
      }
    };
    setSaveState("Saving recovery…");
    const timer = setTimeout(save, 500);
    const unload = () => {
      try {
        localStorage.setItem(RECOVERY, JSON.stringify(latest.current));
      } catch {}
    };
    window.addEventListener("pagehide", unload);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", unload);
    };
  }, [draft, doc]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (saved.current !== JSON.stringify({ draft, doc })) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft, doc]);
  const commit = (next: StudioLayer[], target = surface) => {
    try {
      const checked = validateStudioDocument({
        ...docRef.current,
        surfaces: { ...docRef.current.surfaces, [target]: next },
      });
      setHistory((h) => changeDocument(h, checked));
    } catch {
      setStatus(
        "That change exceeds the document limits. Download a copy or reduce image sizes.",
      );
    }
  };
  function patch(id: string, p: Partial<StudioLayer>) {
    const next = layers.map((l) => (l.id === id ? { ...l, ...p } : l));
    try {
      const h = changeDocument(history, {
        ...doc,
        surfaces: { ...doc.surfaces, [surface]: next },
      });
      setHistory(h);
    } catch {
      setStatus(
        "Use a supported value. Artwork dimensions must be between 0.02 and 24 inches wide.",
      );
    }
  }
  function add(kind: StudioLayer["kind"]) {
    if (layers.length >= 20) {
      setStatus("Each side supports 20 layers. Remove a layer to add another.");
      return;
    }
    const l = layer(kind);
    commit([...layers, l]);
    setSelected(l.id);
    setPreview(false);
  }
  function save(toBag = false) {
    try {
      const result = saveStudioDraft({
        ...working,
        name: working.name.trim() || "My apparel design",
      });
      if (toBag)
        upsertBagItem({
          id: result.id,
          draftId: result.id,
          productSlug: products[result.garment],
          color: colors.find((c) => c[1] === result.color)?.[0] || result.color,
          size: result.size,
          quantity: safeQuantity(result.quantity),
          decoration: `${result.decoration} · ${studioDescription(doc)}`,
        });
      setStatus(
        toBag
          ? "Both sides saved to your project bag. Review the project to request a quote."
          : "Design saved to My projects on this browser.",
      );
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 250000
    ) {
      setStatus(
        "Choose a PNG, JPEG or WebP under 250 KB. Keep larger originals for BEE’s production review.",
      );
      return;
    }
    const target = surface;
    const epoch = uploadEpoch.current;
    setBusy(true);
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const img = new Image();
      img.src = source;
      await img.decode();
      if (img.naturalWidth * img.naturalHeight > 16000000)
        throw Error("Choose an image with fewer than 16 million pixels.");
      if (epoch !== uploadEpoch.current) return;
      const current = docRef.current.surfaces[target];
      if (current.length >= 20) throw Error("This side already has 20 layers.");
      const l = {
        ...layer("image"),
        source,
        width: 300,
        height: Math.max(
          1,
          Math.min(1000, (300 * img.naturalHeight) / img.naturalWidth),
        ),
      };
      commit([...current, l], target);
      if (target === surface) setSelected(l.id);
      setStatus(
        "Image added. Its original uploaded bytes are included in the design file.",
      );
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "This image could not be decoded.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function importDesign(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1500000) {
      setStatus("Choose a BEE design JSON file under 1.5 MB.");
      return;
    }
    try {
      const raw = JSON.parse(await file.text());
      const validated = validateDesign(raw);
      const copy = openDraft({
        ...validated,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      copy.id = `studio-${crypto.randomUUID()}`;
      if (
        !confirm(
          "Open this file as a new copy? Download your current work first if you need to keep it.",
        )
      )
        return;
      uploadEpoch.current++;
      setDraft(copy);
      setHistory({ past: [], present: copy.document!, future: [] });
      setSelected(null);
      setSurface("front");
      setStatus(
        "Imported a new copy. Check both sides before adding it to your project.",
      );
    } catch {
      setStatus(
        "This file is not a supported BEE design. Your current work is unchanged.",
      );
    }
  }
  async function exportArtwork(format: "svg" | "png") {
    setBusy(true);
    let c: StaticCanvas | undefined;
    try {
      c = new StaticCanvas(undefined, { width: 600, height: 800 });
      const objects = await Promise.all(layers.map(makeObject));
      c.add(...objects);
      c.renderAll();
      if (format === "svg")
        downloadText(
          `BEE-${surface}-r${doc.revision}.svg`,
          c.toSVG({ width: "12in", height: "16in" }),
          "image/svg+xml",
        );
      else {
        const url = c.toDataURL({ format: "png", multiplier: 3 });
        const a = document.createElement("a");
        a.href = url;
        a.download = `BEE-${surface}-r${doc.revision}-1800x2400.png`;
        a.click();
      }
      setStatus(
        `${surface} artwork exported. Board: 12 × 16 inches. Confirm final dimensions, fonts and production suitability with BEE.`,
      );
    } catch {
      setStatus(
        "Export failed. Download the editable design file to preserve your work.",
      );
    } finally {
      await c?.dispose();
      setBusy(false);
    }
  }
  function newDesign() {
    if (
      !confirm("Start a new design? Download or save your current work first.")
    )
      return;
    uploadEpoch.current++;
    const next = fresh();
    setDraft(next);
    setHistory({ past: [], present: next.document!, future: [] });
    setSelected(null);
    setSurface("front");
    setStatus("New blank design.");
  }
  function orderLayer(direction: number) {
    if (!active) return;
    const i = layers.indexOf(active),
      j = i + direction;
    if (j < 0 || j >= layers.length) return;
    const next = [...layers];
    [next[i], next[j]] = [next[j]!, next[i]!];
    commit(next);
  }
  const warnings = layers.filter(
    (l) =>
      !l.hidden &&
      (l.x < 0 ||
        l.y < 0 ||
        l.x + l.width > 600 ||
        l.y + l.height > 800 ||
        l.angle !== 0),
  );
  return (
    <section className="bee-studio">
      <header className="bee-studio-heading">
        <div>
          <span className="eyebrow">BEE Studio</span>
          <h1>Make it yours.</h1>
          <p>Build your artwork. Try it on. Keep every detail.</p>
        </div>
        <a href="/start-order">Prefer help from BEE? →</a>
      </header>
      <div className="bee-projectbar">
        <label>
          Design name
          <input
            maxLength={120}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </label>
        <span role="status">{saveState}</span>
        <button onClick={() => save()}>Save to My projects</button>
        <button
          onClick={() =>
            downloadText(
              "BEE-design.json",
              JSON.stringify(
                {
                  ...working,
                  name: working.name.trim() || "My apparel design",
                },
                null,
                2,
              ),
              "application/json",
            )
          }
        >
          Download editable file
        </button>
        <button onClick={() => importInput.current?.click()}>Open file</button>
        <button onClick={newDesign}>New</button>
        <input
          hidden
          ref={importInput}
          type="file"
          accept=".json,application/json"
          onChange={importDesign}
        />
      </div>
      <div className="bee-editor-grid">
        <aside className="bee-tools" aria-label="Design tools">
          <h2>Add to your design</h2>
          <div className="bee-tool-buttons">
            <button onClick={() => add("text")}>＋ Text</button>
            <button
              onClick={() => uploadInput.current?.click()}
              disabled={busy}
            >
              ＋ Artwork
            </button>
            <button onClick={() => add("rect")}>＋ Rectangle</button>
            <button onClick={() => add("ellipse")}>＋ Ellipse</button>
          </div>
          <input
            hidden
            type="file"
            ref={uploadInput}
            accept="image/png,image/jpeg,image/webp"
            onChange={upload}
          />
          <p className="bee-hint">
            PNG, JPEG or WebP · up to 250 KB per image. 20 layers per side.
          </p>
          <h2>Layers · {surface}</h2>
          <p className="bee-hint">Top of this list is the frontmost layer.</p>
          <div className="bee-layers">
            {[...layers].reverse().map((l) => (
              <button
                key={l.id}
                className={l.id === selected ? "is-selected" : ""}
                aria-pressed={l.id === selected}
                onClick={() => {
                  setSelected(l.id);
                  setPreview(false);
                }}
              >
                {l.kind === "text"
                  ? l.text || "Empty text"
                  : l.kind === "image"
                    ? "Uploaded artwork"
                    : l.kind}
                <small>
                  {l.hidden ? "Hidden" : l.locked ? "Locked" : "Editable"}
                </small>
              </button>
            ))}
            {!layers.length && (
              <p>Start with a word, a shape, or your artwork.</p>
            )}
          </div>
          <details>
            <summary>Garment & quantity</summary>
            <label>
              Garment
              <select
                value={draft.garment}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    garment: e.target.value as StudioDraft["garment"],
                  })
                }
              >
                <option value="tee">Tee</option>
                <option value="hoodie">Hoodie</option>
                <option value="polo">Polo</option>
              </select>
            </label>
            <label>
              Color
              <select
                value={draft.color}
                onChange={(e) => setDraft({ ...draft, color: e.target.value })}
              >
                {colors.map(([name, value]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Decoration
              <select
                value={draft.decoration}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    decoration: e.target.value as StudioDraft["decoration"],
                  })
                }
              >
                <option value="graphic">Graphic / print</option>
                <option value="embroidery">Embroidery</option>
              </select>
            </label>
            <label>
              Starting size
              <select
                value={draft.size}
                onChange={(e) => setDraft({ ...draft, size: e.target.value })}
              >
                {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min={1}
                max={10000}
                value={draft.quantity}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    quantity: safeQuantity(Number(e.target.value)),
                  })
                }
              />
            </label>
            <p className="bee-hint">
              Availability, sizes and decoration are confirmed with BEE.
            </p>
          </details>
        </aside>
        <div className="bee-stage" aria-label="Artwork workspace">
          <div className="bee-stagebar">
            <div role="group" aria-label="Design side">
              {(["front", "back"] as const).map((s) => (
                <button
                  key={s}
                  aria-pressed={surface === s}
                  onClick={() => {
                    setSurface(s);
                    setSelected(null);
                  }}
                >
                  {s === "front" ? "Front" : "Back"}{" "}
                  <small>{doc.surfaces[s].length}</small>
                </button>
              ))}
            </div>
            <div>
              <button
                disabled={!history.past.length}
                onClick={() => setHistory((h) => travel(h, "undo"))}
              >
                Undo
              </button>
              <button
                disabled={!history.future.length}
                onClick={() => setHistory((h) => travel(h, "redo"))}
              >
                Redo
              </button>
            </div>
          </div>
          <div className="bee-viewbar" role="group" aria-label="Preview mode">
            <button aria-pressed={!preview} onClick={() => setPreview(false)}>
              Artwork
            </button>
            <button aria-pressed={preview} onClick={() => setPreview(true)}>
              On garment
            </button>
            <span>12 × 16 in artwork board</span>
          </div>
          {preview ? (
            <div className="bee-garment-preview">
              <GarmentSvg
                garment={draft.garment}
                color={draft.color}
                view={surface}
              />
              <img
                src={surfacePreview(doc, surface)}
                alt={`${surface} artwork on approximate garment preview`}
              />
              <p>Approximate placement · edit in Artwork view</p>
            </div>
          ) : (
            <FabricBoard
              layers={layers}
              selected={selected}
              onSelect={setSelected}
              onChange={patch}
              onReady={setCanvas}
            />
          )}
          {!preview && !canvas && (
            <p role="status">
              Preparing artwork… If it does not appear, download your editable
              file and reload.
            </p>
          )}
          <div className="bee-exportbar">
            <button disabled={busy} onClick={() => exportArtwork("svg")}>
              Export {surface} SVG
            </button>
            <button disabled={busy} onClick={() => exportArtwork("png")}>
              Export {surface} PNG
            </button>
            <span>Transparent artwork only · r{doc.revision}</span>
          </div>
          <p className="bee-hint">
            PNG: 1800 × 2400 pixels (150 PPI at board size). SVG text uses the
            selected system font. Neither export is a production approval.
          </p>
        </div>
        <aside className="bee-properties" aria-label="Layer properties">
          <h2>{active ? "Selected layer" : "Your design, your way"}</h2>
          {active ? (
            <>
              <div className="bee-inline">
                <label>
                  <input
                    type="checkbox"
                    checked={active.locked}
                    onChange={(e) =>
                      patch(active.id, { locked: e.target.checked })
                    }
                  />{" "}
                  Lock
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={active.hidden}
                    onChange={(e) =>
                      patch(active.id, { hidden: e.target.checked })
                    }
                  />{" "}
                  Hide
                </label>
              </div>
              <fieldset disabled={active.locked}>
                <legend className="sr-only">Edit selected layer</legend>
                {active.kind === "text" && (
                  <>
                    <label>
                      Text
                      <input
                        maxLength={200}
                        value={active.text}
                        onChange={(e) =>
                          patch(active.id, { text: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Font
                      <select
                        value={active.font}
                        onChange={(e) =>
                          patch(active.id, {
                            font: e.target.value as StudioLayer["font"],
                          })
                        }
                      >
                        {["Arial", "Georgia", "Courier New"].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                {active.kind !== "image" && (
                  <label>
                    Layer color
                    <input
                      type="color"
                      value={active.fill}
                      onChange={(e) =>
                        patch(active.id, { fill: e.target.value })
                      }
                    />
                  </label>
                )}
                <div className="bee-property-grid">
                  {(["x", "y", "width", "height"] as const).map((k) => (
                    <label key={k}>
                      {
                        {
                          x: "Left",
                          y: "Top",
                          width: "Width",
                          height: "Height",
                        }[k]
                      }{" "}
                      (in)
                      <input
                        type="number"
                        step="0.1"
                        value={Math.round((active[k] / 50) * 100) / 100}
                        onChange={(e) => {
                          if (e.target.value !== "")
                            patch(active.id, {
                              [k]: Number(e.target.value) * 50,
                            });
                        }}
                      />
                    </label>
                  ))}
                </div>
                <label>
                  Rotation (degrees)
                  <input
                    type="number"
                    min={-360}
                    max={360}
                    value={active.angle}
                    onChange={(e) =>
                      patch(active.id, { angle: Number(e.target.value) })
                    }
                  />
                </label>
                <div className="bee-tool-buttons">
                  <button
                    onClick={() =>
                      patch(active.id, { x: (600 - active.width) / 2 })
                    }
                  >
                    Center horizontally
                  </button>
                  <button
                    onClick={() =>
                      patch(active.id, { y: (800 - active.height) / 2 })
                    }
                  >
                    Center vertically
                  </button>
                  <button
                    disabled={layers.indexOf(active) === layers.length - 1}
                    onClick={() => orderLayer(1)}
                  >
                    Bring forward
                  </button>
                  <button
                    disabled={layers.indexOf(active) === 0}
                    onClick={() => orderLayer(-1)}
                  >
                    Send backward
                  </button>
                  <button
                    disabled={layers.length >= 20}
                    onClick={() => {
                      const copy = { ...active, id: crypto.randomUUID() };
                      commit([...layers, copy]);
                      setSelected(copy.id);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      commit(layers.filter((l) => l.id !== active.id));
                      setSelected(null);
                    }}
                  >
                    Remove layer
                  </button>
                </div>
              </fieldset>
            </>
          ) : (
            <p>
              Select a layer to change its text, size, color or position. Drag
              the artwork directly, or use the fields here.
            </p>
          )}
          <div className="bee-quality">
            <h2>Before you send</h2>
            {warnings.length > 0 && (
              <p role="status">
                Check {warnings.length} rotated or edge-crossing layer
                {warnings.length === 1 ? "" : "s"}. Artwork beyond the board is
                cropped in exports.
              </p>
            )}
            <p>
              The board is a starting size, not a verified print area. Garment
              previews are approximate.
            </p>
            {draft.decoration === "embroidery" && (
              <p>
                Embroidery needs digitizing and BEE review. These files contain
                artwork, not machine stitches.
              </p>
            )}
            <p>
              Check your spelling and keep the original artwork. BEE confirms
              dimensions, materials and the final proof.
            </p>
          </div>
          <button className="bee-primary" onClick={() => save(true)}>
            Save both sides + add to bag
          </button>
          <a href="/cart">Review project bag →</a>
        </aside>
      </div>
      <p className="bee-feedback" role="status">
        {status}
      </p>
    </section>
  );
}
