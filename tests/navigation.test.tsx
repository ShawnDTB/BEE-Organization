// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { SiteHeader } from "../src/components/SiteHeader";
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", {
    value: () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});
it("opens a top-layer dialog with focus and restores it on cancel", () => {
  act(() => root.render(<SiteHeader currentPath="/" />));
  const trigger = host.querySelector(".bee-menu-trigger") as HTMLButtonElement;
  act(() => trigger.click());
  const dialog = document.querySelector("dialog")!;
  expect(dialog.open).toBe(true);
  expect(document.activeElement?.getAttribute("aria-label")).toBe(
    "Close navigation",
  );
  expect(document.body.style.position).toBe("fixed");
  act(() =>
    dialog.dispatchEvent(
      new Event("cancel", { bubbles: true, cancelable: true }),
    ),
  );
  expect(document.querySelector("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.position).toBe("");
});
it("keeps inside clicks open and closes on the backdrop", () => {
  act(() => root.render(<SiteHeader currentPath="/bulk-orders" />));
  act(() =>
    (host.querySelector(".bee-menu-trigger") as HTMLButtonElement).click(),
  );
  const dialog = document.querySelector("dialog")!;
  act(() => (dialog.querySelector(".bee-menu-panel") as HTMLElement).click());
  expect(dialog.open).toBe(true);
  act(() => dialog.click());
  expect(document.querySelector("dialog")).toBeNull();
});
it("exposes current navigation and excludes fake account login wording", () => {
  act(() => root.render(<SiteHeader currentPath="/bulk-orders" />));
  expect(host.querySelector('[aria-current="page"]')?.textContent).toBe(
    "Groups & businesses",
  );
  expect(host.textContent).toContain("My projects");
  expect(host.textContent).not.toContain("Login");
});
