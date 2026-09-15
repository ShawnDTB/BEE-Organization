// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { StaffInboxPage } from "../src/pages/StaffInboxPage";
import { emptyProjectIntake } from "../src/data/projectStore";
let root: Root, host: HTMLDivElement;
const id = "22222222-2222-4222-8222-222222222222";
const row = {
  id,
  reference: "BEE-test",
  receivedAt: "2026-09-15T00:00:00Z",
  name: "Example customer",
  organization: "Sample team",
  garment: "Polos",
  quantity: "20",
  deadline: "",
  status: "new",
  version: 0,
  updatedAt: "2026-09-15T00:00:00Z",
};
const detail = {
  ...row,
  snapshot: {
    intake: {
      ...emptyProjectIntake,
      name: row.name,
      email: "example@example.com",
      notes: "Original request",
    },
    items: [],
  },
  events: [],
};
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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
  vi.unstubAllGlobals();
});
async function click(text: string) {
  const button = [...host.querySelectorAll("button")].find((b) =>
    b.textContent?.includes(text),
  );
  expect(button).toBeDefined();
  await act(async () => button!.click());
}
function mockApi(post?: () => Promise<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string, init: RequestInit) => {
      if (path === "/api/staff/session")
        return json({ email: "reviewer@example.com" });
      if (path.startsWith("/api/staff/inbox?"))
        return json({ requests: [row], nextBefore: null });
      if (init?.method === "POST") return post!();
      return json(detail);
    }),
  );
}
it("keeps customer details unavailable when staff authorization fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ error: "Denied" }, 403)),
  );
  await act(async () => root.render(<StaffInboxPage />));
  expect(host.textContent).toContain("Staff access is required");
  expect(host.textContent).not.toContain("Example customer");
  expect(localStorage.length).toBe(0);
});
it("shows the original request and never stores staff/customer data locally", async () => {
  mockApi();
  await act(async () => root.render(<StaffInboxPage />));
  await click("Sample team");
  expect(host.textContent).toContain("Original request");
  expect(host.textContent).toContain("example@example.com");
  expect(host.textContent).toContain("No review updates yet");
  expect(localStorage.length).toBe(0);
  await click("Hide customer details");
  expect(host.textContent).not.toContain("example@example.com");
});
it("waits for server confirmation and preserves errors without a false saved message", async () => {
  mockApi(async () =>
    json({ error: "Another update was saved. Refresh this request." }, 409),
  );
  await act(async () => root.render(<StaffInboxPage />));
  await click("Sample team");
  await act(async () => {
    const select = host.querySelector(
      ".staff-review-form select",
    ) as HTMLSelectElement;
    select.value = "reviewing";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await click("Save review update");
  expect(host.textContent).toContain("Another update was saved");
  expect(host.textContent).not.toContain("Review update saved");
  expect(localStorage.length).toBe(0);
});
