import type { StudioLayer } from "../../shared/studio";
export type ImageSize = { width: number; height: number };
export function effectivePpi(layer: StudioLayer, image: ImageSize) {
  return Math.min(
    image.width / (layer.width / 50),
    image.height / (layer.height / 50),
  );
}
function luminance(hex: string) {
  const rgb = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
}
export function lowGarmentContrast(fill: string, garment: string) {
  const a = luminance(fill),
    b = luminance(garment);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) < 1.5;
}
