// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { SiteHeader } from "../src/components/SiteHeader";
let host: HTMLDivElement;
let root: Root;
let desktop: boolean;
let resize: (() => void) | undefined;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  desktop = false;
  resize = undefined;
  Object.defineProperty(window, "matchMedia", {
    value: () => ({
      get matches() {
        return desktop;
      },
      addEventListener: vi.fn((_event: string, listener: () => void) => {
        resize = listener;
      }),
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
  act(() => root.render(<SiteHeader currentPath="/shop" />));
  act(() =>
    (host.querySelector(".bee-menu-trigger") as HTMLButtonElement).click(),
  );
  const dialog = document.querySelector("dialog")!;
  act(() => (dialog.querySelector(".bee-menu-panel") as HTMLElement).click());
  expect(dialog.open).toBe(true);
  act(() => dialog.click());
  expect(document.querySelector("dialog")).toBeNull();
});
it("unlocks scrolling and moves focus to visible navigation when resized to desktop", () => {
  act(() => root.render(<SiteHeader currentPath="/shop" />));
  act(() =>
    (host.querySelector(".bee-menu-trigger") as HTMLButtonElement).click(),
  );
  expect(document.querySelector("dialog")?.open).toBe(true);
  act(() => {
    desktop = true;
    resize?.();
  });
  expect(document.querySelector("dialog")).toBeNull();
  expect(document.body.style.position).toBe("");
  expect(document.documentElement.style.overflow).toBe("");
  expect(document.activeElement).toBe(
    host.querySelector('.bee-desktop-nav a[aria-current="page"]'),
  );
  expect(
    host.querySelector(".bee-menu-trigger")?.getAttribute("aria-expanded"),
  ).toBe("false");
});
it("exposes current navigation and excludes fake account login wording", () => {
  act(() => root.render(<SiteHeader currentPath="/shop" />));
  expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Shop");
  expect(host.textContent).toContain("Home");
  expect(host.textContent).not.toContain("My projects");
  expect(host.textContent).not.toContain("Login");
});
