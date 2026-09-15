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
