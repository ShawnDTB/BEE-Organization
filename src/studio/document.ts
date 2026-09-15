import {
  emptyDocument,
  validateStudioDocument,
  type StudioDocument,
  type StudioLayer,
  type Surface,
} from "../../shared/studio";
import type { StudioDraft } from "../data/projectStore";
export const layer = (kind: StudioLayer["kind"]): StudioLayer => ({
  id: crypto.randomUUID(),
  kind,
  x: 100,
  y: 180,
  width: 300,
  height: kind === "text" ? 48 : 220,
  angle: 0,
  fill: "#143b65",
  text: kind === "text" ? "YOUR DESIGN" : "",
  font: "Arial",
  locked: false,
  hidden: false,
});
export function migrateDraft(draft: StudioDraft): StudioDocument {
  if (draft.document) return validateStudioDocument(draft.document);
  const doc = emptyDocument();
  const surface: Surface = draft.placement === "center-back" ? "back" : "front";
  if (draft.artworkData)
    doc.surfaces[surface].push({
      ...layer("image"),
      source: draft.artworkData,
    });
  if (draft.text?.trim())
    doc.surfaces[surface].push({
      ...layer("text"),
      text: draft.text,
      fill: draft.textColor,
      y: draft.artworkData ? 420 : 180,
    });
  return validateStudioDocument(doc);
}
export type History = {
  past: StudioDocument[];
  present: StudioDocument;
  future: StudioDocument[];
};
export function changeDocument(h: History, next: StudioDocument): History {
  if (JSON.stringify(h.present.surfaces) === JSON.stringify(next.surfaces))
    return h;
  return {
    past: [...h.past, h.present].slice(-40),
    present: validateStudioDocument({
      ...next,
      revision: h.present.revision + 1,
    }),
    future: [],
  };
}
export function travel(h: History, direction: "undo" | "redo"): History {
  const source = direction === "undo" ? h.past : h.future;
  const next = source.at(-1);
  if (!next) return h;
  const restored = { ...next, revision: h.present.revision + 1 };
  return direction === "undo"
    ? {
        past: h.past.slice(0, -1),
        present: restored,
        future: [...h.future, h.present],
      }
    : {
        past: [...h.past, h.present],
        present: restored,
        future: h.future.slice(0, -1),
      };
}
