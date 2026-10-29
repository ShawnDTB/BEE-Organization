// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CustomStory } from "../src/components/CustomStory";

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});

it("opens an explicitly illustrative idea and links only to fresh custom planning", () => {
  act(() => root.render(<CustomStory />));
  expect(host.querySelector('[aria-pressed="true"]')?.textContent).toContain(
    "Idea",
  );
  expect(host.querySelector("figure")?.getAttribute("aria-label")).toBe(
    "Example custom concept: Idea",
  );
  expect(host.textContent).toContain(
    "Illustrative concept · not a product or production proof",
  );
  expect(
    host.querySelector('a[href="/studio?garment=tee"]')?.textContent,
  ).toContain("Create your own");
  expect(host.textContent).toContain("Start a fresh concept in Studio");
  expect(host.querySelector('a[href="/checkout"], form, input')).toBeNull();
  expect(
    [...host.querySelectorAll("button")].every(
      (button) => button.type === "button",
    ),
  ).toBe(true);
});

it("changes the labeled example and complete live description only after an explicit selection", () => {
  const timer = vi.spyOn(globalThis, "setInterval");
  act(() => root.render(<CustomStory />));
  expect(timer).not.toHaveBeenCalled();
  const buttons = [...host.querySelectorAll("button")];
  const figure = host.querySelector("figure")!;
  expect(
    buttons.every(
      (button) => button.getAttribute("aria-controls") === figure.id,
    ),
  ).toBe(true);
  act(() => buttons[1]!.click());
  expect(figure.getAttribute("data-stage")).toBe("artwork");
  expect(host.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1);
  expect(host.querySelector("[role=status]")?.textContent).toContain(
    "stays editable",
  );
  act(() => buttons[2]!.click());
  expect(figure.getAttribute("aria-label")).toBe(
    "Example custom concept: Your piece",
  );
  expect(host.querySelector("[role=status]")?.textContent).toContain(
    "final artwork proof",
  );
  expect(host.querySelector("[role=status]")?.getAttribute("aria-atomic")).toBe(
    "true",
  );
});
