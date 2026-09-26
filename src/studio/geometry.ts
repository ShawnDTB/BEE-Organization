import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  type StudioLayer,
} from "../../shared/studio";
export type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};
export function layerBounds(
  l: Pick<StudioLayer, "x" | "y" | "width" | "height" | "angle">,
): Bounds {
  const a = (l.angle * Math.PI) / 180,
    cos = Math.cos(a),
    sin = Math.sin(a);
  const points = [
    [0, 0],
    [l.width, 0],
    [0, l.height],
    [l.width, l.height],
  ].map(([x, y]) => ({
    x: l.x + x! * cos - y! * sin,
    y: l.y + x! * sin + y! * cos,
  }));
  const left = Math.min(...points.map((p) => p.x)),
    top = Math.min(...points.map((p) => p.y));
  const right = Math.max(...points.map((p) => p.x)),
    bottom = Math.max(...points.map((p) => p.y));
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}
export type ArrangeAction =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "horizontal"
  | "vertical"
  | "space-x"
  | "space-y"
  | "board-center";
export function arrangeLayers(
  layers: StudioLayer[],
  ids: string[],
  action: ArrangeAction,
): StudioLayer[] {
  const selected = layers.filter((l) => ids.includes(l.id));
  if (!selected.length) throw Error("Choose artwork to arrange.");
  if (selected.some((l) => l.locked || l.hidden))
    throw Error("Unlock and show the selected artwork before arranging it.");
  if (action !== "board-center" && selected.length < 2)
    throw Error("Select at least two elements to align.");
  const boxes = selected.map((l) => ({ layer: l, ...layerBounds(l) }));
  const left = Math.min(...boxes.map((b) => b.left)),
    right = Math.max(...boxes.map((b) => b.right));
  const top = Math.min(...boxes.map((b) => b.top)),
    bottom = Math.max(...boxes.map((b) => b.bottom));
  const patches = new Map<string, { x: number; y: number }>();
  if (action === "space-x" || action === "space-y") {
    if (boxes.length < 3)
      throw Error("Choose at least three elements for equal spacing.");
    const horizontal = action === "space-x";
    boxes.sort((a, b) => (horizontal ? a.left - b.left : a.top - b.top));
    const gap =
      ((horizontal ? right - left : bottom - top) -
        boxes.reduce((n, b) => n + (horizontal ? b.width : b.height), 0)) /
      (boxes.length - 1);
    if (gap < -0.001)
      throw Error(
        "Spread the outside elements farther apart before adding equal spacing.",
      );
    let cursor = horizontal ? left : top;
    for (const b of boxes) {
      patches.set(b.layer.id, {
        x: b.layer.x + (horizontal ? cursor - b.left : 0),
        y: b.layer.y + (horizontal ? 0 : cursor - b.top),
      });
      cursor += (horizontal ? b.width : b.height) + Math.max(0, gap);
    }
  } else
    for (const b of boxes) {
      let dx = 0,
        dy = 0;
      if (action === "left") dx = left - b.left;
      if (action === "right") dx = right - b.right;
      if (action === "top") dy = top - b.top;
      if (action === "bottom") dy = bottom - b.bottom;
      if (action === "horizontal") dx = (left + right - b.left - b.right) / 2;
      if (action === "vertical") dy = (top + bottom - b.top - b.bottom) / 2;
      if (action === "board-center") {
        dx = (BOARD_WIDTH - left - right) / 2;
        dy = (BOARD_HEIGHT - top - bottom) / 2;
      }
      patches.set(b.layer.id, { x: b.layer.x + dx, y: b.layer.y + dy });
    }
  return layers.map((l) =>
    patches.has(l.id) ? { ...l, ...patches.get(l.id)! } : l,
  );
}
/** Snap bounding-box anchors to board edges or center in document coordinates. */
export function snapOffset(bounds: Bounds, tolerance: number) {
  function closest(anchors: number[], targets: number[]) {
    let delta = 0,
      best = tolerance;
    for (let i = 0; i < anchors.length; i++) {
      const d = targets[i]! - anchors[i]!;
      if (Math.abs(d) <= best) {
        delta = d;
        best = Math.abs(d);
      }
    }
    return delta;
  }
  return {
    x: closest(
      [bounds.left, (bounds.left + bounds.right) / 2, bounds.right],
      [0, BOARD_WIDTH / 2, BOARD_WIDTH],
    ),
    y: closest(
      [bounds.top, (bounds.top + bounds.bottom) / 2, bounds.bottom],
      [0, BOARD_HEIGHT / 2, BOARD_HEIGHT],
    ),
  };
}
