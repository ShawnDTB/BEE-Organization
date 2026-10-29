// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { ShopV2Page } from "../src/pages/ShopV2";
import { HomePageV4 } from "../src/pages/HomePageV4";
import { WorkGallery } from "../src/components/WorkGallery";
import { StartOrderPage } from "../src/pages/StartOrderPage";
import { saveProjectDraft } from "../src/data/projectStore";
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  window.history.replaceState(null, "", "/shop");
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
it("opens a linked category and keeps filters, results and browser history aligned", () => {
  window.history.replaceState(null, "", "/shop?category=hats");
  act(() => root.render(<ShopV2Page />));
  expect(host.querySelectorAll("article")).toHaveLength(1);
  expect(host.querySelector("[aria-pressed=true]")?.textContent).toBe("Hats");
  act(() =>
    [...host.querySelectorAll("button")]
      .find((b) => b.textContent === "Embroidery")!
      .click(),
  );
  expect(window.location.search).toBe("?category=embroidery");
  expect(host.querySelectorAll("article")).toHaveLength(2);
  expect(host.querySelector("[role=status]")?.textContent).toContain(
    "2 options",
  );
  act(() => {
    window.history.replaceState(null, "", "/shop?category=hats");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(host.querySelectorAll("article")).toHaveLength(1);
  expect(host.querySelector("[aria-pressed=true]")?.textContent).toBe("Hats");
});
it("handles invalid category URLs and never presents preview ideas as purchasable stock", () => {
  window.history.replaceState(null, "", "/shop?category=invalid");
  act(() => root.render(<ShopV2Page />));
  expect(host.querySelectorAll("article")).toHaveLength(6);
  expect(host.querySelector("[aria-pressed=true]")?.textContent).toBe(
    "All options",
  );
  expect(host.textContent).toContain("checkout are being prepared");
  expect(host.querySelector('a[href="/checkout"]')).toBeNull();
  expect(
    host.querySelector('a[href="/start-order?type=custom&item=tee"]'),
  ).not.toBeNull();
});
it("makes homepage categories direct shop links and hides a gallery without real work", () => {
  act(() => root.render(<HomePageV4 />));
  const links = host.querySelectorAll(
    'nav[aria-label="Shop by product type"] a',
  );
  expect(links).toHaveLength(5);
  expect([...links].map((a) => a.getAttribute("href"))).toContain(
    "/shop?category=decals",
  );
  expect(host.querySelector('[aria-roledescription="carousel"]')).toBeNull();
});
it("supports manual gallery controls and announces the selected work without autoplay", () => {
  act(() =>
    root.render(
      <WorkGallery
        photos={[
          { src: "/one.webp", alt: "Stitched team cap", caption: "Team caps" },
          { src: "/two.webp", alt: "Printed shirt", caption: "Shirts" },
        ]}
      />,
    ),
  );
  act(() =>
    (
      host.querySelector('[aria-label="Next work photo"]') as HTMLButtonElement
    ).click(),
  );
  expect(host.querySelector("img")?.alt).toBe("Printed shirt");
  expect(host.querySelector("figcaption")?.textContent).toContain("2 of 2");
  act(() =>
    (
      host.querySelector('[aria-label="Next work photo"]') as HTMLButtonElement
    ).click(),
  );
  expect(host.querySelector("img")?.alt).toBe("Stitched team cap");
});
it.each([false, true])(
  "prefills a selected product while protecting an existing draft: %s",
  async (existing) => {
    if (existing)
      saveProjectDraft({
        garment: "Existing team polos",
        notes: "Keep this brief",
      });
    window.history.replaceState(
      null,
      "",
      "/start-order?type=custom&item=hoodie",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ enabled: false }), {
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );
    await act(async () => root.render(<StartOrderPage />));
    const input = host.querySelector(
      'input[placeholder="Polos for the team, hoodies for a merch drop…"]',
    ) as HTMLInputElement;
    expect(input.value).toBe(existing ? "Existing team polos" : "Hoodies");
    expect(host.textContent).not.toContain("Request received");
  },
);
