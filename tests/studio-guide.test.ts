import { expect, it } from "vitest";
import {
  parseGuideCommand,
  templateLayers,
  transformDesign,
} from "../src/studio/guide";
import { validateStudioDocument, emptyDocument } from "../shared/studio";
it("centers a composition as a unit and preserves relative placement and hidden elements", () => {
  const layers = templateLayers("event", "Charity day", "Bulldogs", "#ffffff");
  const hidden = { ...layers[0]!, id: "hidden", hidden: true, x: 17 };
  const result = transformDesign([...layers, hidden], "center");
  expect(result[1]!.x - result[0]!.x).toBe(layers[1]!.x - layers[0]!.x);
  expect(result[2]).toEqual(hidden);
  expect(layers[0]!.y).toBe(310);
  validateStudioDocument({
    ...emptyDocument(),
    surfaces: { front: result, back: [] },
  });
});
it("preserves aspect ratios and fits within board margins", () => {
  const original = {
    ...templateLayers("event", "", "", "#ffffff")[0]!,
    width: 900,
    height: 90,
  };
  const [result] = transformDesign([original], "fit");
  expect(result!.width / result!.height).toBeCloseTo(10);
  expect(result!.x).toBeCloseTo(20);
  expect(result!.width).toBeCloseTo(560);
});
it("rejects locked, rotated and ambiguous operations without partial changes", () => {
  const layers = templateLayers("event", "", "", "#ffffff");
  expect(() =>
    transformDesign([{ ...layers[0]!, locked: true }], "center"),
  ).toThrow("locked");
  expect(() =>
    transformDesign([{ ...layers[0]!, angle: 30 }], "center"),
  ).toThrow("rotated");
  expect(parseGuideCommand("center the design and change the year")).toBeNull();
  expect(parseGuideCommand("Center the design!")).toBe("center");
  expect(parseGuideCommand("make a bulldog")).toBeNull();
});

import { effectivePpi, lowGarmentContrast } from "../src/studio/review";
it("calculates density from placed size and distinguishes similar text colors", () => {
  const l = {
    ...templateLayers("event", "", "", "#ffffff")[0]!,
    kind: "image" as const,
    width: 600,
    height: 400,
  };
  expect(effectivePpi(l, { width: 1200, height: 800 })).toBe(100);
  expect(
    effectivePpi(
      { ...l, width: 300, height: 200 },
      { width: 1200, height: 800 },
    ),
  ).toBe(200);
  expect(lowGarmentContrast("#ffffff", "#e8e8e4")).toBe(true);
  expect(lowGarmentContrast("#ffffff", "#15191d")).toBe(false);
});
