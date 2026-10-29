// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Reveal } from "../src/components/Reveal";

let host: HTMLDivElement;
let root: Root;
let below: boolean;
let reduced: boolean;
let notify: IntersectionObserverCallback;
let motionChange: () => void;
let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;
let removeListener: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  below = true;
  reduced = false;
  observe = vi.fn();
  disconnect = vi.fn();
  removeListener = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ top: below ? window.innerHeight + 100 : 100 }) as DOMRect,
  );
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_event: string, callback: () => void) => {
      motionChange = callback;
    },
    removeEventListener: removeListener,
  }));
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render() {
  act(() =>
    root.render(
      <Reveal>
        <a href="/studio">Create a custom design</a>
      </Reveal>,
    ),
  );
  return host.querySelector(".reveal")!;
}
it("reveals an offscreen section once and disconnects its observer", () => {
  const target = render();
  expect(target.getAttribute("data-reveal-state")).toBe("pending");
  act(() =>
    notify(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(target.getAttribute("data-reveal-state")).toBe("revealed");
  expect(disconnect).toHaveBeenCalledTimes(1);
  act(() =>
    notify(
      [{ isIntersecting: false }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(target.getAttribute("data-reveal-state")).toBe("revealed");
});
it.each(["visible", "reduced", "unsupported"])(
  "keeps content visible for %s conditions",
  (condition) => {
    if (condition === "visible") below = false;
    if (condition === "reduced") reduced = true;
    if (condition === "unsupported")
      vi.stubGlobal("IntersectionObserver", undefined);
    const target = render();
    expect(target.getAttribute("data-reveal-state")).toBe("visible");
    expect(observe).not.toHaveBeenCalled();
  },
);
it("reveals immediately when focus enters before scrolling", () => {
  const target = render();
  act(() => (host.querySelector("a") as HTMLAnchorElement).focus());
  expect(target.getAttribute("data-reveal-state")).toBe("revealed");
  expect(document.activeElement).toBe(host.querySelector("a"));
  expect(disconnect).toHaveBeenCalled();
});
it("honors a live reduced-motion change without hiding the section again", () => {
  const target = render();
  act(() => {
    reduced = true;
    motionChange();
  });
  expect(target.getAttribute("data-reveal-state")).toBe("revealed");
  act(() => {
    reduced = false;
    motionChange();
  });
  expect(target.getAttribute("data-reveal-state")).toBe("revealed");
});
it("leaves content visible if observing fails and cleans up on unmount", () => {
  observe.mockImplementation(() => {
    throw Error("unavailable");
  });
  const target = render();
  expect(target.getAttribute("data-reveal-state")).toBe("visible");
  expect(disconnect).toHaveBeenCalled();
  act(() => root.unmount());
  root = createRoot(host);
  expect(removeListener).toHaveBeenCalled();
});
