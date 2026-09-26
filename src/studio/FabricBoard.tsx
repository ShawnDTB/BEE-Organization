import { snapOffset } from "./geometry";
import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  FabricImage,
  Rect,
  Ellipse,
  IText,
  type FabricObject,
} from "fabric";
import type { StudioLayer } from "../../shared/studio";
export async function makeObject(l: StudioLayer): Promise<FabricObject> {
  const common = {
    left: l.x,
    top: l.y,
    angle: l.angle,
    originX: "left" as const,
    originY: "top" as const,
    fill: l.fill,
    strokeWidth: 0,
    visible: !l.hidden,
    selectable: !l.locked,
    evented: !l.locked,
    cornerColor: "#168aff",
    borderColor: "#168aff",
    cornerSize: 14,
    transparentCorners: false,
    lockScalingFlip: true,
  };
  let obj: FabricObject;
  if (l.kind === "image") {
    obj = await FabricImage.fromURL(l.source!);
    if (obj.width * obj.height > 16000000) {
      obj.dispose();
      throw new Error("Image pixel limit exceeded");
    }
  } else if (l.kind === "text")
    obj = new IText(l.text, {
      fontFamily: l.font,
      fontSize: 48,
      editable: false,
    });
  else if (l.kind === "ellipse") obj = new Ellipse({ rx: 50, ry: 50 });
  else obj = new Rect({ width: 100, height: 100 });
  obj.set({
    ...common,
    scaleX: l.width / Math.max(1, obj.width),
    scaleY: l.height / Math.max(1, obj.height),
  });
  return obj;
}
export function FabricBoard({
  layers,
  selected,
  onSelect,
  onChange,
  onReady,
}: {
  layers: StudioLayer[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<StudioLayer>) => void;
  onReady: (canvas: Canvas | null) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [snapping, setSnapping] = useState(true);
  const view = useRef({ zoom, snapping });
  view.current = { zoom, snapping };
  const resizeRef = useRef<() => void>(() => {});
  const element = useRef<HTMLCanvasElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  const canvas = useRef<Canvas | null>(null);
  const callbacks = useRef({ onSelect, onChange, onReady });
  callbacks.current = { onSelect, onChange, onReady };
  const objects = useRef(new Map<FabricObject, string>());
  useEffect(() => {
    const c = new Canvas(element.current!, {
      width: 600,
      height: 800,
      preserveObjectStacking: true,
      selection: false,
    });
    canvas.current = c;
    callbacks.current.onReady(c);
    const select = () =>
      callbacks.current.onSelect(
        objects.current.get(c.getActiveObject()!) || null,
      );
    c.on("selection:created", select);
    c.on("selection:updated", select);
    c.on("selection:cleared", () => callbacks.current.onSelect(null));
    c.on("object:moving", ({ target }) => {
      if (!target || !view.current.snapping) return;
      const b = target.getBoundingRect();
      const offset = snapOffset(
        { ...b, right: b.left + b.width, bottom: b.top + b.height },
        6 / c.getZoom(),
      );
      target.set({ left: target.left + offset.x, top: target.top + offset.y });
    });
    c.on("object:modified", ({ target }) => {
      if (!target) return;
      const id = objects.current.get(target);
      if (id)
        callbacks.current.onChange(id, {
          x: Math.round(target.left),
          y: Math.round(target.top),
          width: Math.max(1, Math.round(target.width * target.scaleX)),
          height: Math.max(1, Math.round(target.height * target.scaleY)),
          angle: Math.round(target.angle) % 360,
        });
    });
    const resize = () => {
      const width =
        Math.min(600, outer.current?.clientWidth || 600) * view.current.zoom;
      c.setDimensions({ width, height: (width * 800) / 600 });
      c.setViewportTransform([width / 600, 0, 0, width / 600, 0, 0]);
    };
    resizeRef.current = resize;
    const observer = new ResizeObserver(resize);
    observer.observe(outer.current!);
    resize();
    return () => {
      observer.disconnect();
      resizeRef.current = () => {};
      canvas.current = null;
      callbacks.current.onReady(null);
      void c.dispose();
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const c = canvas.current;
    if (!c) return;
    callbacks.current.onReady(null);
    Promise.all(layers.map(makeObject))
      .then((list) => {
        if (cancelled) {
          list.forEach((o) => o.dispose());
          return;
        }
        objects.current.clear();
        const oldObjects = c.getObjects();
        c.remove(...oldObjects);
        oldObjects.forEach((o) => o.dispose());
        list.forEach((o, i) => {
          objects.current.set(o, layers[i]!.id);
          c.add(o);
        });
        const active = list.find((o) => objects.current.get(o) === selected);
        if (active?.selectable) c.setActiveObject(active);
        c.requestRenderAll();
        callbacks.current.onReady(c);
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onReady(null);
      });
    return () => {
      cancelled = true;
    };
  }, [layers]);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const obj = c.getObjects().find((o) => objects.current.get(o) === selected);
    if (obj?.selectable) c.setActiveObject(obj);
    else c.discardActiveObject();
    c.requestRenderAll();
  }, [selected]);
  useEffect(() => {
    resizeRef.current();
  }, [zoom]);
  return (
    <div className="bee-canvas-workspace">
      <div className="bee-canvas-controls">
        <label>
          Zoom
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            {[0.5, 1, 1.5, 2, 3].map((z) => (
              <option key={z} value={z}>
                {z === 1 ? "Fit to width" : `${z * 100}% of fit`}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => setZoom(1)}>Fit artwork</button>
        <label>
          <input
            type="checkbox"
            checked={snapping}
            onChange={(e) => setSnapping(e.target.checked)}
          />
          Snap to board edges & center
        </label>
      </div>
      <p className="bee-hint">
        At higher zoom, scroll to move around the artwork. Focus the canvas and
        use arrow keys to move the selected element; hold Shift for larger
        steps.
      </p>
      <div
        ref={outer}
        className="bee-board bee-board-scroll"
        tabIndex={0}
        onKeyDown={(e) => {
          const delta: Record<string, [number, number]> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
          };
          const move = delta[e.key];
          if (!move || e.ctrlKey || e.metaKey || e.altKey) return;
          e.preventDefault();
          const l = layers.find((l) => l.id === selected);
          if (!l || l.locked || l.hidden) return;
          const step = e.shiftKey ? 10 : 1;
          callbacks.current.onChange(l.id, {
            x: l.x + move[0] * step,
            y: l.y + move[1] * step,
          });
        }}
        aria-label="Design canvas. Use the layer list and properties for keyboard editing."
      >
        <canvas ref={element} />
      </div>
    </div>
  );
}
