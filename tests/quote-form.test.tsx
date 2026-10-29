// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { StartOrderPage } from "../src/pages/StartOrderPage";
import {
  readProjectDraft,
  readProjects,
  saveProjectDraft,
  emptyProjectIntake,
  saveStudioDraft,
  upsertBagItem,
} from "../src/data/projectStore";
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
  window.history.replaceState(null, "", "/start-order");
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
function attachDesign(garment: "tee" | "hoodie", quantity: number) {
  const id = `studio-${garment}`;
  saveStudioDraft({
    id,
    name: `My ${garment}`,
    garment,
    color: "#15191d",
    view: "front",
    decoration: "graphic",
    text: "",
    textColor: "#ffffff",
    placement: "center-front",
    x: 50,
    y: 45,
    scale: 100,
    size: "M",
    quantity,
    createdAt: "2026-10-29T00:00:00Z",
    updatedAt: "2026-10-29T00:00:00Z",
  });
  upsertBagItem({
    id,
    draftId: id,
    productSlug:
      garment === "tee" ? "creator-graphic-tee" : "heavyweight-creator-hoodie",
    color: "Black",
    size: "M",
    quantity,
    decoration: "graphic",
  });
}
it("carries a single Studio garment and quantity into an empty brief", async () => {
  saveProjectDraft(emptyProjectIntake);
  attachDesign("hoodie", 7);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  expect(
    (
      host.querySelector(
        'input[placeholder="Polos for the team, hoodies for a merch drop…"]',
      ) as HTMLInputElement
    ).value,
  ).toBe("Hoodies");
  expect(
    (
      host.querySelector(
        'input[placeholder="About 30 pieces, or still deciding"]',
      ) as HTMLInputElement
    ).value,
  ).toBe("7");
  expect(host.textContent).toContain("7 × Hoodies");
  expect(host.textContent).not.toContain("Your brief has different");
});
it("keeps existing brief details and flags a mismatch with attached Studio designs", async () => {
  attachDesign("hoodie", 1);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  expect(
    (
      host.querySelector(
        'input[placeholder="Polos for the team, hoodies for a merch drop…"]',
      ) as HTMLInputElement
    ).value,
  ).toBe("Polos");
  expect(readProjectDraft().quantity).toBe("24");
  expect(host.textContent).toContain(
    "Your brief has different garment or quantity details",
  );
});
it("totals mixed Studio quantities without guessing one garment", async () => {
  saveProjectDraft(emptyProjectIntake);
  attachDesign("hoodie", 2);
  attachDesign("tee", 3);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  expect(
    (
      host.querySelector(
        'input[placeholder="Polos for the team, hoodies for a merch drop…"]',
      ) as HTMLInputElement
    ).value,
  ).toBe("");
  expect(
    (
      host.querySelector(
        'input[placeholder="About 30 pieces, or still deciding"]',
      ) as HTMLInputElement
    ).value,
  ).toBe("5");
  expect(host.textContent).toContain("2 × Hoodies · 3 × T-shirts");
});
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
it.each([true, false])(
  "asks before changing a saved garment and preserves the rest of the brief: %s",
  async (useSelected) => {
    saveProjectDraft({
      type: "bulk",
      notes: "Keep our sleeve artwork",
      sizePlan: { garment: "Polos", color: "Navy", counts: { M: 24 } },
    });
    window.history.replaceState(
      null,
      "",
      "/start-order?type=custom&item=hoodie",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ enabled: false })),
    );
    await render();
    expect(host.textContent).toContain("You already have a brief started");
    expect(readProjectDraft().garment).toBe("Polos");
    await click(
      useSelected ? "Use hoodies for this brief" : "Keep my saved item",
    );
    expect(host.textContent).not.toContain("You already have a brief started");
    expect(readProjectDraft().garment).toBe(useSelected ? "Hoodies" : "Polos");
    expect(readProjectDraft().type).toBe("bulk");
    expect(readProjectDraft().notes).toBe("Keep our sleeve artwork");
    expect(readProjectDraft().sizePlan?.counts.M).toBe(24);
    expect(window.location.search).toBe("");
  },
);
it("does not require contact details or consent for an offline planning draft", async () => {
  saveProjectDraft({ name: "", email: "" });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  await click("Contact & review");
  expect(host.querySelectorAll("input[required]")).toHaveLength(0);
  expect(
    (host.querySelector('input[type="checkbox"]') as HTMLInputElement).disabled,
  ).toBe(true);
  expect(host.textContent).toContain("not a purchase");
  await click("Save a local project draft");
  expect(readProjects()[0]?.delivery).toBe("draft");
});
it("requires the review step and security confirmation before sending", async () => {
  const fetch = vi.fn(async () => json({ enabled: true, siteKey: "test" }));
  vi.stubGlobal("fetch", fetch);
  await render();
  const send = () =>
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  await act(async () => {
    send();
  });
  await click("Contact & review");
  await act(async () => {
    send();
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(readProjects()).toHaveLength(0);
  expect(host.querySelectorAll("input[required]")).toHaveLength(2);
});
it("allows only one request while a confirmation is pending", async () => {
  let finish!: (response: Response) => void;
  const fetch = vi.fn(async (url) =>
    url === "/api/intake/status"
      ? json({ enabled: true, siteKey: "test" })
      : new Promise<Response>((resolve) => {
          finish = resolve;
        }),
  );
  vi.stubGlobal("fetch", fetch);
  await render();
  await click("Contact & review");
  await act(async () =>
    (host.querySelector('input[type="checkbox"]') as HTMLInputElement).click(),
  );
  await click("Test security check");
  await act(async () => {
    const form = host.querySelector("form")!;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
  expect(fetch).toHaveBeenCalledTimes(2);
  await act(async () =>
    finish(
      json({ reference: "BEE-once", receivedAt: "2026-10-29T00:00:00Z" }, 201),
    ),
  );
  expect(readProjects()).toHaveLength(1);
});
it("shows all project details and the attached size plan for review", async () => {
  saveProjectDraft({
    fulfillment: "Pickup",
    personalization: "Names on sleeves",
    notes: "Event in October",
    sizePlan: { garment: "Polos", color: "Navy", counts: { M: 12, L: 12 } },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => json({ enabled: false })),
  );
  await render();
  await click("Contact & review");
  expect(host.textContent).toContain("Names on sleeves");
  expect(host.textContent).toContain("Event in October");
  expect(host.textContent).toContain("24 planned pieces");
  expect(host.textContent).toContain("M: 12 · L: 12");
  await click("Remove size plan from request");
  expect(host.textContent).not.toContain("24 planned pieces");
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
