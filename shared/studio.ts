/** BEE's document format is independent of the canvas renderer. */
export const BOARD_WIDTH = 600;
export const BOARD_HEIGHT = 800;
export const STUDIO_LIMIT = 1_000_000;
export type Surface = "front" | "back";
export type StudioLayer = {
  id: string;
  kind: "text" | "image" | "rect" | "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  fill: string;
  text: string;
  font: "Arial" | "Georgia" | "Courier New";
  source?: string;
  locked: boolean;
  hidden: boolean;
};
export type StudioDocument = {
  version: 1;
  revision: number;
  surfaces: Record<Surface, StudioLayer[]>;
};
export function emptyDocument(): StudioDocument {
  return { version: 1, revision: 0, surfaces: { front: [], back: [] } };
}
export function validateStudioDocument(value: unknown): StudioDocument {
  const fail = (): never => {
    throw new Error(
      "This studio document is invalid or exceeds the supported limits.",
    );
  };
  if (
    !value ||
    typeof value !== "object" ||
    JSON.stringify(value).length > STUDIO_LIMIT
  )
    return fail();
  const d = value as StudioDocument;
  if (
    d.version !== 1 ||
    !Number.isSafeInteger(d.revision) ||
    d.revision < 0 ||
    !d.surfaces
  )
    return fail();
  const ids = new Set<string>();
  const surfaces = {} as Record<Surface, StudioLayer[]>;
  for (const surface of ["front", "back"] as const) {
    if (!Array.isArray(d.surfaces[surface]) || d.surfaces[surface].length > 20)
      return fail();
    surfaces[surface] = d.surfaces[surface].map((l) => {
      if (
        !l ||
        typeof l.id !== "string" ||
        !/^[a-zA-Z0-9-]{1,100}$/.test(l.id) ||
        ids.has(l.id)
      )
        return fail();
      ids.add(l.id);
      if (
        !["text", "image", "rect", "ellipse"].includes(l.kind) ||
        !["Arial", "Georgia", "Courier New"].includes(l.font)
      )
        return fail();
      if (
        typeof l.fill !== "string" ||
        !/^#[a-f0-9]{6}$/i.test(l.fill) ||
        typeof l.text !== "string" ||
        l.text.length > 200 ||
        /[\u0000-\u001f]/.test(l.text)
      )
        return fail();
      for (const k of ["x", "y", "width", "height", "angle"] as const)
        if (typeof l[k] !== "number" || !Number.isFinite(l[k])) return fail();
      if (
        Math.abs(l.x) > 1200 ||
        Math.abs(l.y) > 1600 ||
        l.width < 1 ||
        l.width > 1200 ||
        l.height < 1 ||
        l.height > 1600 ||
        Math.abs(l.angle) > 360 ||
        typeof l.locked !== "boolean" ||
        typeof l.hidden !== "boolean"
      )
        return fail();
      if (
        l.kind === "image" &&
        (typeof l.source !== "string" ||
          l.source.length > 350000 ||
          !/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(l.source))
      )
        return fail();
      return {
        id: l.id,
        kind: l.kind,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        angle: l.angle,
        fill: l.fill,
        text: l.text,
        font: l.font,
        locked: l.locked,
        hidden: l.hidden,
        ...(l.kind === "image" ? { source: l.source } : {}),
      };
    });
  }
  return { version: 1, revision: d.revision, surfaces };
}
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
/** Export only the bounded supported document vocabulary, never imported SVG markup. */
export function surfaceSvg(doc: StudioDocument, surface: Surface) {
  const d = validateStudioDocument(doc);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12in" height="16in" viewBox="0 0 600 800"><title>BEE ${surface} artwork — revision ${d.revision}</title>${d.surfaces[
    surface
  ]
    .filter((l) => !l.hidden)
    .map((l) => {
      let shape = "";
      if (l.kind === "text")
        shape = `<text x="0" y="${l.height * 0.8}" font-family="${esc(l.font)}" font-size="${l.height}" textLength="${l.width}" lengthAdjust="spacingAndGlyphs" fill="${l.fill}">${esc(l.text)}</text>`;
      if (l.kind === "image")
        shape = `<image href="${esc(l.source!)}" width="${l.width}" height="${l.height}" preserveAspectRatio="none"/>`;
      if (l.kind === "rect")
        shape = `<rect width="${l.width}" height="${l.height}" fill="${l.fill}"/>`;
      if (l.kind === "ellipse")
        shape = `<ellipse cx="${l.width / 2}" cy="${l.height / 2}" rx="${l.width / 2}" ry="${l.height / 2}" fill="${l.fill}"/>`;
      return `<g transform="translate(${l.x} ${l.y}) rotate(${l.angle})">${shape}</g>`;
    })
    .join("")}</svg>`;
}
export function surfacePreview(doc: StudioDocument, surface: Surface) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(surfaceSvg(doc, surface))}`;
}
export function studioDescription(doc: StudioDocument) {
  return `Studio revision ${doc.revision}: ${doc.surfaces.front.length} front layers, ${doc.surfaces.back.length} back layers`;
}
