// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import axe from "axe-core";
import { HomePageV4 } from "../src/pages/HomePageV4";
import { ShopV2Page } from "../src/pages/ShopV2";
import { SiteHeader } from "../src/components/SiteHeader";
import { SiteFooter } from "../src/components/SiteFooter";
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  Object.defineProperty(window, "matchMedia", {
    value: () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    configurable: true,
  });
  document.documentElement.lang = "en";
  document.title = "Works by BEE";
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});
it.each([HomePageV4, ShopV2Page])(
  "has no automated WCAG A/AA structural violations: %s",
  async (Page) => {
    act(() =>
      root.render(
        <>
          <SiteHeader currentPath={Page === HomePageV4 ? "/" : "/shop"} />
          <main>
            <Page />
          </main>
          <SiteFooter />
        </>,
      ),
    );
    // jsdom has no rendered layout. Contrast is checked separately against
    // actual design pairs; browser QA covers dimensions, focus and overflow.
    const results = await axe.run(host, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
      rules: { "color-contrast": { enabled: false } },
    });
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  },
);
function luminance(hex: string) {
  const c = hex
    .match(/[a-f\d]{2}/gi)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0]! * 0.2126 + c[1]! * 0.7152 + c[2]! * 0.0722;
}
it.each([
  ["0f172a", "f5f7f7"],
  ["4b5e63", "f5f7f7"],
  ["0b6b63", "f5f7f7"],
  ["0b6b63", "e1e5e9"],
  ["4b5e63", "e1e5e9"],
  ["ffffff", "12312b"],
  ["102d2a", "14b8a6"],
  ["e1e5e9", "102d2a"],
  ["5eead4", "102d2a"],
  ["365b55", "e2eeeb"],
  ["5a706b", "f5f7f7"],
  ["bdcfca", "102d2a"],
])("meets 4.5:1 normal-text contrast for #%s on #%s", (fg, bg) => {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  expect((light! + 0.05) / (dark! + 0.05)).toBeGreaterThanOrEqual(4.5);
});
