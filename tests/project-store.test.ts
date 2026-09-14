// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from "vitest";
import {
  saveStudioDraft,
  upsertBagItem,
  readBag,
  readDrafts,
  createProject,
  readProjects,
  updateBagQuantity,
  deleteStudioDraft,
  reorderProject,
  readProjectDraft,
  emptyProjectIntake,
  type StudioDraft,
  readStorage,
  write,
} from "../src/data/projectStore";
const draft: StudioDraft = {
  id: "studio-test",
  name: "Team polo",
  garment: "polo",
  color: "#15191d",
  view: "front",
  decoration: "embroidery",
  text: "TEAM",
  textColor: "#f4f5f5",
  placement: "left-chest",
  x: 41,
  y: 37,
  scale: 72,
  size: "M",
  quantity: 12,
  createdAt: "2026-09-14",
  updatedAt: "2026-09-14",
};
beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  saveStudioDraft({ ...draft });
  upsertBagItem({
    id: draft.id,
    draftId: draft.id,
    productSlug: "embroidered-performance-polo",
    color: "Black",
    size: "M",
    quantity: 12,
    decoration: "Embroidery",
  });
});
it("keeps bag quantity and reopened design in sync", () => {
  updateBagQuantity(draft.id, 24);
  expect(readDrafts()[0]?.quantity).toBe(24);
  saveStudioDraft({ ...readDrafts()[0]!, text: "NEW" });
  expect(readBag()[0]?.quantity).toBe(24);
});
it("retains the submitted snapshot after source editing and deletion", () => {
  const project = createProject({
    ...emptyProjectIntake,
    name: "Test",
    email: "test@example.com",
  });
  saveStudioDraft({ ...draft, text: "CHANGED" });
  deleteStudioDraft(draft.id);
  expect(readProjects()[0]?.snapshotItems?.[0]?.design?.text).toBe("TEAM");
  expect(project.delivery).toBe("draft");
  expect(project.submittedAt).toBe("");
});
it("reorders the preserved design into a fresh editable copy", () => {
  const project = createProject({
    ...emptyProjectIntake,
    deadline: "2026-12-01",
  });
  deleteStudioDraft(draft.id);
  reorderProject(project);
  const copy = readDrafts()[0];
  expect(copy?.text).toBe("TEAM");
  expect(copy?.id).not.toBe(draft.id);
  expect(readBag()[0]?.quantity).toBe(12);
  expect(readProjectDraft().deadline).toBe("");
});
it("does not invent received status for a local draft", () => {
  const p = createProject(emptyProjectIntake);
  expect(p.status).toContain("not sent");
  expect(p.progress).toBe(0);
  expect(readBag()).toHaveLength(1);
});
it("stores only one local copy of a recovered receipt", () => {
  const receipt = {
    reference: "BEE-server",
    receivedAt: "2026-09-14T00:00:00Z",
  };
  createProject(emptyProjectIntake, readBag(), receipt);
  createProject(emptyProjectIntake, [], receipt);
  expect(readProjects()).toHaveLength(1);
  expect(readProjects()[0]?.delivery).toBe("received");
});
it("handles unavailable reads and surfaces save failure", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error();
  });
  expect(readStorage("x")).toBe(null);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error();
  });
  expect(() => write("x", {})).toThrow("could not save");
});
it("normalizes nonfinite, fractional and oversized quantities", () => {
  updateBagQuantity(draft.id, NaN);
  expect(readBag()[0]?.quantity).toBe(1);
  updateBagQuantity(draft.id, 2.8);
  expect(readBag()[0]?.quantity).toBe(3);
  updateBagQuantity(draft.id, 20000);
  expect(readBag()[0]?.quantity).toBe(10000);
});
