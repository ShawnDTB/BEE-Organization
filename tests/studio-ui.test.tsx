// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
vi.mock("../src/studio/FabricBoard", () => ({
  FabricBoard: () => <div>Canvas adapter</div>,
  makeObject: vi.fn(),
}));
import { StudioPageV4 } from "../src/pages/StudioPageV4";
import { readDrafts, snapshotItems } from "../src/data/projectStore";
let host: HTMLDivElement, root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  localStorage.setItem("bee-studio-mode", "advanced");
  history.replaceState({}, "", "/studio");
  vi.useFakeTimers();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
async function click(name: string) {
  const b = [...host.querySelectorAll("button")].find(
    (x) => x.textContent?.trim() === name,
  );
  expect(b).toBeTruthy();
  await act(async () => b!.click());
}
it("keeps front/back layers through save, request snapshot and recovery reload", async () => {
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Text");
  await click("Back 0");
  await click("＋ Ellipse");
  await click("Save both sides + add to bag");
  expect(snapshotItems()[0]?.design?.document?.surfaces.front).toHaveLength(1);
  expect(snapshotItems()[0]?.design?.document?.surfaces.back).toHaveLength(1);
  await act(async () => vi.advanceTimersByTime(550));
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(<StudioPageV4 />));
  expect(host.textContent).toContain("Recovered your latest studio work");
  expect(host.textContent).toContain("Front 1");
  expect(host.textContent).toContain("Back 1");
});
it("undo restores a removed layer and redo removes it again", async () => {
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Rectangle");
  await click("Remove layer");
  await click("Undo");
  await click("Save to My projects");
  expect(readDrafts()[0]?.document?.surfaces.front).toHaveLength(1);
  await click("Redo");
  await click("Save to My projects");
  expect(readDrafts()[0]?.document?.surfaces.front).toHaveLength(0);
});
it("reports failed browser recovery without claiming it was saved", async () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Text");
  await act(async () => vi.advanceTimersByTime(550));
  expect(host.textContent).toContain("Recovery failed");
  expect(host.textContent).not.toContain("Recovered automatically");
});
it("recovers newer edits after explicitly reopening a saved draft", async () => {
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Text");
  await click("Save to My projects");
  const id = readDrafts()[0]!.id;
  await click("＋ Rectangle");
  await act(async () => vi.advanceTimersByTime(550));
  expect(location.search).toContain(id);
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(<StudioPageV4 />));
  expect(host.textContent).toContain("Front 2");
  expect(host.textContent).toContain("Recovered your latest studio work");
});

it("starts new visitors guided and preserves template work across modes and undo", async () => {
  localStorage.removeItem("bee-studio-mode");
  await act(async () => root.render(<StudioPageV4 />));
  expect(host.textContent).toContain("How would you like to begin?");
  expect(host.textContent).not.toContain("Export front SVG");
  await click("Use a templateChoose a layout, then make it your own.");
  await act(async () =>
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(host.textContent).toContain("Make it yours.");
  await click("Make larger");
  await click("Advanced");
  await click("Save to My projects");
  const larger = readDrafts()[0]!.document!.surfaces.front;
  expect(larger[0]!.width).toBeGreaterThan(480);
  await click("Undo");
  await click("Save to My projects");
  expect(readDrafts()[0]!.document!.surfaces.front[0]!.width).toBe(480);
  await click("Guided");
  await click("Review & continue →");
  expect(host.textContent).toContain("Ready for BEE?");
  expect(host.textContent).toContain("2 visible design elements");
});

it("keeps the guided creative brief through browser recovery and quote handoff", async () => {
  localStorage.removeItem("bee-studio-mode");
  await act(async () => root.render(<StudioPageV4 />));
  await click(
    "Help me create itStart with your words and a ready-made layout.",
  );
  const input = [...host.querySelectorAll("label")]
    .find((l) => l.textContent?.includes("Event or purpose"))!
    .querySelector("input")!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(input, "School charity day");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await act(async () => vi.advanceTimersByTime(550));
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(<StudioPageV4 />));
  await click(
    "Help me create itStart with your words and a ready-made layout.",
  );
  const restored = [...host.querySelectorAll("label")]
    .find((l) => l.textContent?.includes("Event or purpose"))!
    .querySelector("input")!;
  expect(restored.value).toBe("School charity day");
  await click("Advanced");
  await click("Save both sides + add to bag");
  expect(snapshotItems()[0]?.design?.brief?.occasion).toBe(
    "School charity day",
  );
});

async function setField(label: string, value: string) {
  const input = [...host.querySelectorAll("label")]
    .find((l) => l.textContent?.trim() === label)!
    .querySelector("input")!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
it("links numeric dimensions by default, undoes both together, and allows deliberate stretching", async () => {
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Text");
  await click("Save to My projects");
  const original = readDrafts()[0]!.document!.surfaces.front[0]!;
  await setField("Width (in)", "12");
  await click("Save to My projects");
  const resized = readDrafts()[0]!.document!.surfaces.front[0]!;
  expect(resized.width).toBe(600);
  expect(resized.width / resized.height).toBeCloseTo(
    original.width / original.height,
  );
  await click("Undo");
  await click("Save to My projects");
  expect(readDrafts()[0]!.document!.surfaces.front[0]).toEqual(original);
  const toggle = [...host.querySelectorAll("label")]
    .find((l) => l.textContent?.includes("Keep proportions"))!
    .querySelector("input")!;
  await act(async () => toggle.click());
  await setField("Width (in)", "12");
  await click("Save to My projects");
  expect(readDrafts()[0]!.document!.surfaces.front[0]!.height).toBe(
    original.height,
  );
});
it("centers rotated artwork using visible bounds, with one undo per axis", async () => {
  await act(async () => root.render(<StudioPageV4 />));
  await click("＋ Text");
  await setField("Rotation (degrees)", "90");
  await click("Center horizontally");
  await click("Center vertically");
  await click("Save to My projects");
  const centered = readDrafts()[0]!.document!.surfaces.front[0]!;
  // At 90 degrees the width points down and the height points left.
  expect(centered.x - centered.height / 2).toBeCloseTo(300);
  expect(centered.y + centered.width / 2).toBeCloseTo(400);
  await click("Undo");
  await click("Save to My projects");
  const undone = readDrafts()[0]!.document!.surfaces.front[0]!;
  expect(undone.x).toBe(centered.x);
  expect(undone.y).not.toBe(centered.y);
});
