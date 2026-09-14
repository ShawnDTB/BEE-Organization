// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { GroupPlannerPage } from "../src/pages/GroupPlannerPage";
import { readProjectDraft, saveProjectDraft } from "../src/data/projectStore";
let host: HTMLDivElement, root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});
it("asks before replacing an existing request's garment and counts", async () => {
  saveProjectDraft({
    garment: "Existing hoodies",
    quantity: "10",
    notes: "Preserve me",
  });
  localStorage.setItem(
    "bee-size-planner-v1",
    JSON.stringify({ garment: "Polos", color: "Navy", counts: { M: 24 } }),
  );
  await act(async () => root.render(<GroupPlannerPage />));
  await act(async () =>
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(host.textContent).toContain("Update the current request?");
  expect(readProjectDraft()).toMatchObject({
    garment: "Existing hoodies",
    quantity: "10",
    notes: "Preserve me",
  });
  expect(host.textContent).toContain("Confirm and continue");
});
it("does not transfer an empty plan or collect participant identities", async () => {
  await act(async () => root.render(<GroupPlannerPage />));
  await act(async () =>
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(host.textContent).toContain("Plan between 1 and 10,000 pieces");
  expect(readProjectDraft().sizePlan).toBeUndefined();
  expect(host.querySelector('input[autocomplete="name"]')).toBeNull();
});
