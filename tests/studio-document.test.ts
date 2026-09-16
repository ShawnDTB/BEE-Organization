// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import {
  emptyDocument,
  validateStudioDocument,
  surfaceSvg,
} from "../shared/studio";
import { validateDesign, validateRequest } from "../shared/request";
import {
  layer,
  migrateDraft,
  changeDocument,
  travel,
} from "../src/studio/document";
import {
  saveStudioDraft,
  upsertBagItem,
  snapshotItems,
  createProject,
  readProjects,
  reorderProject,
  readDrafts,
  emptyProjectIntake,
  type StudioDraft,
} from "../src/data/projectStore";
const old: StudioDraft = {
  id: "studio-old",
  name: "Old artwork",
  garment: "tee",
  color: "#15191d",
  view: "back",
  decoration: "graphic",
  text: "OLD",
  textColor: "#ffffff",
  placement: "center-back",
  x: 50,
  y: 45,
  scale: 100,
  size: "M",
  quantity: 12,
  createdAt: "2026-09-15",
  updatedAt: "2026-09-15",
};
beforeEach(() => localStorage.clear());
it("migrates onto the actual old placement surface without mutating original", () => {
  const doc = migrateDraft(old);
  expect(doc.surfaces.front).toEqual([]);
  expect(doc.surfaces.back[0]?.text).toBe("OLD");
  expect(old).not.toHaveProperty("document");
});
it("retains both surfaces through validation and JSON round trip", () => {
  const doc = emptyDocument();
  doc.surfaces.front = [layer("text")];
  doc.surfaces.back = [layer("ellipse")];
  expect(validateStudioDocument(JSON.parse(JSON.stringify(doc)))).toEqual(doc);
  expect(validateDesign({ ...old, document: doc }).document).toEqual(doc);
});
it("undo/redo keeps the opposite side intact and advances revision identity", () => {
  const d = emptyDocument();
  d.surfaces.back = [layer("rect")];
  let h = { past: [], present: d, future: [] } as Parameters<
    typeof changeDocument
  >[0];
  h = changeDocument(h, {
    ...d,
    surfaces: { ...d.surfaces, front: [layer("text")] },
  });
  h = travel(h, "undo");
  expect(h.present.surfaces.front).toEqual([]);
  expect(h.present.surfaces.back).toEqual(d.surfaces.back);
  h = travel(h, "redo");
  expect(h.present.surfaces.front).toHaveLength(1);
  expect(h.present.revision).toBe(3);
});
it("discards redo when a new edit branches from undo", () => {
  let h = { past: [], present: emptyDocument(), future: [] } as Parameters<
    typeof changeDocument
  >[0];
  h = changeDocument(h, {
    ...h.present,
    surfaces: { front: [layer("text")], back: [] },
  });
  h = travel(h, "undo");
  h = changeDocument(h, {
    ...h.present,
    surfaces: { front: [layer("ellipse")], back: [] },
  });
  expect(h.future).toEqual([]);
});
it.each([NaN, Infinity, -1, 2000])(
  "rejects invalid layer widths %s",
  (width) => {
    const d = emptyDocument();
    d.surfaces.front = [{ ...layer("rect"), width }];
    expect(() => validateStudioDocument(d)).toThrow();
  },
);
it.each([
  "javascript:alert(1)",
  "https://example.com/image.png",
  'data:image/svg+xml,<svg onload="alert(1)"/>',
])("rejects executable or remotely loaded image data", (source) => {
  const d = emptyDocument();
  d.surfaces.front = [{ ...layer("image"), source }];
  expect(() => validateStudioDocument(d)).toThrow();
});
it("rejects unsupported versions, duplicate IDs and too many layers", () => {
  expect(() =>
    validateStudioDocument({ ...emptyDocument(), version: 2 }),
  ).toThrow();
  const d = emptyDocument();
  const l = layer("rect");
  d.surfaces.front = [l];
  d.surfaces.back = [l];
  expect(() => validateStudioDocument(d)).toThrow();
  d.surfaces.back = [];
  d.surfaces.front = Array.from({ length: 21 }, () => layer("rect"));
  expect(() => validateStudioDocument(d)).toThrow();
});
it("escapes text and excludes hidden layers from the preview", () => {
  const d = emptyDocument();
  d.surfaces.front = [
    { ...layer("text"), text: '<script>&"' },
    { ...layer("text"), text: "SECRET", hidden: true },
  ];
  const svg = surfaceSvg(d, "front");
  expect(svg).toContain("&lt;script&gt;");
  expect(svg).not.toContain("<script>");
  expect(svg).not.toContain("SECRET");
  expect(svg).toContain('width="12in"');
});
it("preserves both surfaces in validated requests, immutable snapshots and reorders", () => {
  const document = emptyDocument();
  document.surfaces.front = [layer("text")];
  document.surfaces.back = [layer("rect")];
  saveStudioDraft({ ...old, document });
  upsertBagItem({
    id: old.id,
    draftId: old.id,
    productSlug: "tee",
    color: "Black",
    size: "M",
    quantity: 12,
    decoration: "graphic",
  });
  const intake = {
    ...emptyProjectIntake,
    name: "Test",
    email: "test@example.com",
  };
  const request = validateRequest({
    requestId: crypto.randomUUID(),
    intake,
    items: snapshotItems(),
    consent: true,
    website: "",
  });
  expect(request.items[0]?.design?.document).toEqual(document);
  const project = createProject(intake, undefined, undefined, request.items);
  saveStudioDraft({ ...old, document: emptyDocument() });
  expect(readProjects()[0]?.snapshotItems?.[0]?.design?.document).toEqual(
    document,
  );
  reorderProject(project);
  expect(readDrafts().at(-1)?.document).toEqual(document);
});

it("preserves creative intent through design validation and request snapshots", () => {
  const brief = {
    occasion: "Charity event",
    audience: "Our school",
    subject: "Bulldog mascot",
    style: "Bold",
    colors: "Blue and white",
    notes: "Keep the school name exact",
  };
  const design = validateDesign({ ...old, document: emptyDocument(), brief });
  expect(design.brief).toEqual(brief);
  saveStudioDraft({ ...old, ...design });
  upsertBagItem({
    id: old.id,
    draftId: old.id,
    productSlug: "creator-graphic-tee",
    color: "Black",
    size: "M",
    quantity: 12,
    decoration: "graphic",
  });
  expect(snapshotItems()[0]?.design?.brief).toEqual(brief);
  expect(validateDesign(JSON.parse(JSON.stringify(design))).brief).toEqual(
    brief,
  );
  expect(() =>
    validateDesign({ ...old, brief: { ...brief, subject: "x".repeat(501) } }),
  ).toThrow("design brief");
  expect(validateDesign(old).brief).toBeUndefined();
});
