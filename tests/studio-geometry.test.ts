import { expect, it } from "vitest";
import { arrangeLayers, layerBounds, snapOffset } from "../src/studio/geometry";
import { layer, changeDocument, travel } from "../src/studio/document";
import { emptyDocument, validateStudioDocument } from "../shared/studio";
it("aligns rotated element bounds and leaves unselected artwork untouched", () => {
  const a = {
    ...layer("rect"),
    id: "a",
    x: 100,
    y: 100,
    width: 80,
    height: 40,
    angle: 90,
  };
  const b = {
    ...layer("rect"),
    id: "b",
    x: 240,
    y: 300,
    width: 50,
    height: 40,
  };
  const c = { ...layer("text"), id: "c", locked: true };
  const result = arrangeLayers([a, b, c], ["a", "b"], "left");
  expect(layerBounds(result[0]!).left).toBeCloseTo(
    layerBounds(result[1]!).left,
  );
  expect(result[2]).toBe(c);
  expect(a.x).toBe(100);
});
it("centers a selection as a unit without changing its spacing or scale", () => {
  const a = { ...layer("rect"), id: "a", x: 30, y: 60, width: 50, height: 50 };
  const b = {
    ...layer("rect"),
    id: "b",
    x: 150,
    y: 250,
    width: 80,
    height: 50,
  };
  const result = arrangeLayers([a, b], ["a", "b"], "board-center");
  expect(result[1]!.x - result[0]!.x).toBe(120);
  expect(result[1]!.y - result[0]!.y).toBe(190);
  const boxes = result.map(layerBounds);
  expect(
    (Math.min(...boxes.map((b) => b.left)) +
      Math.max(...boxes.map((b) => b.right))) /
      2,
  ).toBe(300);
  expect(
    (Math.min(...boxes.map((b) => b.top)) +
      Math.max(...boxes.map((b) => b.bottom))) /
      2,
  ).toBe(400);
  expect(result[0]!.width).toBe(50);
});
it("distributes gaps equally across unequal widths, preserving the outer edges", () => {
  const ls = [
    { x: 20, width: 30 },
    { x: 70, width: 70 },
    { x: 300, width: 50 },
  ].map((p, i) => ({ ...layer("rect"), ...p, id: `a${i}` }));
  const result = arrangeLayers(
    ls,
    ls.map((l) => l.id),
    "space-x",
  );
  expect(result[1]!.x - (result[0]!.x + result[0]!.width)).toBeCloseTo(
    result[2]!.x - (result[1]!.x + result[1]!.width),
  );
  expect(result[0]!.x).toBe(20);
  expect(result[2]!.x + result[2]!.width).toBe(350);
  expect(() =>
    arrangeLayers(
      [{ ...ls[0]!, locked: true }, ...ls.slice(1)],
      ls.map((l) => l.id),
      "space-x",
    ),
  ).toThrow("Unlock");
});
it("snaps within tolerance and does not attract distant artwork", () => {
  expect(
    snapOffset(
      layerBounds({ ...layer("rect"), x: 3, y: 7, width: 100, height: 100 }),
      6,
    ),
  ).toEqual({ x: -3, y: 0 });
  expect(
    snapOffset(
      layerBounds({
        ...layer("rect"),
        x: 249,
        y: 348,
        width: 100,
        height: 100,
      }),
      6,
    ),
  ).toEqual({ x: 1, y: 2 });
});
it("batch arrangement is one reversible revision and preserves the back", () => {
  const doc = emptyDocument();
  doc.surfaces.front = [
    { ...layer("rect"), id: "a" },
    { ...layer("text"), id: "b", x: 250 },
  ];
  doc.surfaces.back = [layer("ellipse")];
  const next = validateStudioDocument({
    ...doc,
    surfaces: {
      ...doc.surfaces,
      front: arrangeLayers(doc.surfaces.front, ["a", "b"], "left"),
    },
  });
  const h = changeDocument({ past: [], present: doc, future: [] }, next);
  expect(h.past).toHaveLength(1);
  expect(h.present.surfaces.back).toEqual(doc.surfaces.back);
  expect(travel(h, "undo").present.surfaces).toEqual(doc.surfaces);
});
