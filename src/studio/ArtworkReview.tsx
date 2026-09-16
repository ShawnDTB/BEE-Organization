import { useEffect, useState } from "react";
import type { StudioDocument } from "../../shared/studio";
import { effectivePpi, lowGarmentContrast, type ImageSize } from "./review";
export function ArtworkReview({
  doc,
  color,
  edit,
}: {
  doc: StudioDocument;
  color: string;
  edit: () => void;
}) {
  const [sizes, setSizes] = useState<Record<string, ImageSize | null>>({});
  const sources = JSON.stringify([
    ...new Set(
      Object.values(doc.surfaces)
        .flat()
        .filter((l) => l.kind === "image" && !l.hidden)
        .map((l) => l.source!),
    ),
  ]);
  useEffect(() => {
    let current = true;
    setSizes({});
    const images: HTMLImageElement[] = [];
    for (const source of JSON.parse(sources) as string[]) {
      const img = new Image();
      images.push(img);
      img.onload = () => {
        if (current)
          setSizes((s) => ({
            ...s,
            [source]: { width: img.naturalWidth, height: img.naturalHeight },
          }));
      };
      img.onerror = () => {
        if (current) setSizes((s) => ({ ...s, [source]: null }));
      };
      img.src = source;
    }
    return () => {
      current = false;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [sources]);
  const findings: string[] = [];
  for (const [side, layers] of Object.entries(doc.surfaces)) {
    for (const l of layers.filter((l) => !l.hidden)) {
      if (l.kind === "image") {
        const size = sizes[l.source!];
        if (size === undefined)
          findings.push(`${side}: Checking image resolution…`);
        else if (size === null)
          findings.push(
            `${side}: This image could not be checked. Upload it again or ask BEE to review the original.`,
          );
        else {
          const ppi = effectivePpi(l, size);
          if (ppi < 150)
            findings.push(
              `${side}: An image is approximately ${Math.round(ppi)} PPI at this layout size. Make it smaller in Advanced or upload a higher-resolution original. BEE confirms the requirement for your product.`,
            );
        }
      } else if (l.kind === "text" && lowGarmentContrast(l.fill, color)) {
        findings.push(
          `${side}: “${l.text.slice(0, 45)}” is close to the garment color. Try a lighter or darker text color, unless another design element sits behind it.`,
        );
      }
    }
  }
  return (
    <section aria-label="Artwork checks">
      <h3>Artwork checks</h3>
      <p>
        Resolution is estimated from the current 12 × 16 inch board. Color
        suggestions compare text with the garment, not overlapping artwork.
        These checks do not approve production.
      </p>
      <div aria-live="polite">
        {findings.map((finding, i) => (
          <p key={i}>{finding}</p>
        ))}
      </div>
      {findings.length > 0 && (
        <button onClick={edit}>Adjust artwork in Advanced</button>
      )}
    </section>
  );
}
