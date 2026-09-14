// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { StartOrderPage } from "../src/pages/StartOrderPage";
import { readProjects, saveProjectDraft } from "../src/data/projectStore";
vi.mock("../src/components/Turnstile", () => ({
  Turnstile: ({ onToken }: { onToken: (token: string) => void }) => (
    <button type="button" onClick={() => onToken("test-token")}>
      Test security check
    </button>
  ),
}));
let host: HTMLDivElement;
let root: Root;
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  saveProjectDraft({
    name: "Test Customer",
    email: "test@example.com",
    garment: "Polos",
    quantity: "24",
  });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
async function render() {
  await act(async () => {
    root.render(<StartOrderPage />);
  });
}
async function click(text: string) {
  const button = [...host.querySelectorAll("button")].find((button) =>
    button.textContent?.includes(text),
  );
  expect(button).toBeDefined();
  await act(async () => button!.click());
}
it("offers drafts without pretending offline requests were sent", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  expect(host.textContent).toContain("Online submission is being prepared");
  await click("Save a local project draft");
  expect(readProjects()[0]?.delivery).toBe("draft");
  expect(host.textContent).not.toContain("Request received");
});
it("does not treat a static HTML fallback as an available service", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response("<html>app</html>", {
          headers: { "Content-Type": "text/html" },
        }),
    ),
  );
  await render();
  await click("Contact & review");
  expect(
    [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "Online submission unavailable",
    )?.disabled,
  ).toBe(true);
});
it("shows a received state only after server acknowledgement", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url) =>
      url === "/api/intake/status"
        ? json({ enabled: true, siteKey: "test" })
        : json(
            { reference: "BEE-server", receivedAt: "2026-09-14T00:00:00Z" },
            201,
          ),
    ),
  );
  await render();
  await click("Contact & review");
  await act(async () =>
    (host.querySelector('input[type="checkbox"]') as HTMLInputElement).click(),
  );
  await click("Test security check");
  await act(async () => {
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(host.textContent).toContain("Request received");
  expect(readProjects()[0]?.reference).toBe("BEE-server");
  expect(readProjects()[0]?.delivery).toBe("received");
});
it("keeps failed requests unreceived and reuses retry identity", async () => {
  const ids: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options) => {
      if (url === "/api/intake/status")
        return json({ enabled: true, siteKey: "test" });
      ids.push(JSON.parse(options.body).requestId);
      throw new Error("Connection lost");
    }),
  );
  await render();
  await click("Contact & review");
  await act(async () =>
    (host.querySelector('input[type="checkbox"]') as HTMLInputElement).click(),
  );
  await click("Test security check");
  await act(async () => {
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(host.textContent).toContain("Connection lost");
  expect(readProjects()).toHaveLength(0);
  await click("Test security check");
  await act(async () => {
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
});
