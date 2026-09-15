import {
  surfacePreview,
  studioDescription,
  type StudioDocument,
} from "../../shared/studio";
export function StudioDesignSummary({
  document,
}: {
  document: StudioDocument;
}) {
  try {
    return (
      <div>
        <p>
          {studioDescription(document)} · 12 × 16 in boards · approximate
          preview
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["front", "back"] as const).map((surface) => (
            <figure key={surface} style={{ margin: 0, width: 120 }}>
              <img
                style={{ width: "100%", background: "#bdc8d3" }}
                src={surfacePreview(document, surface)}
                alt={`${surface} design preview`}
              />
              <figcaption>
                {surface} · {document.surfaces[surface].length} layers
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  } catch {
    return (
      <p>This design cannot be previewed. Keep its original file for review.</p>
    );
  }
}
