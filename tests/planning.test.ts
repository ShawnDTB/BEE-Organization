// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import {
  sizePlanTotal,
  sizePlanLines,
  validateSizePlan,
} from "../shared/sizePlan";
import { projectBrief } from "../src/data/projectBrief";
import {
  emptyProjectIntake,
  readProjectDraft,
  saveProjectDraft,
  hasCurrentProjectDraft,
  createProject,
  deleteProjectCopy,
  readProjects,
  saveProjectNote,
  readProjectNotes,
  PROJECT_DRAFT_KEY,
} from "../src/data/projectStore";
beforeEach(() => localStorage.clear());
const plan = {
  garment: "Polos",
  color: "Navy",
  counts: { M: 12, L: 8, "Youth S": 4 },
};
it("totals youth and adult sizes without mixing their labels", () => {
  expect(sizePlanTotal(validateSizePlan(plan))).toBe(24);
  expect(sizePlanLines(plan)).toBe("Youth S: 4 · M: 12 · L: 8");
});
it("rejects fractional, negative, nonnumeric, unsupported and oversized counts", () => {
  for (const counts of [
    { M: -1 },
    { M: 1.5 },
    { M: "4" },
    { M: Infinity },
    { Huge: 2 },
    { M: 10000, L: 1 },
    {},
  ])
    expect(() => validateSizePlan({ ...plan, counts })).toThrow();
});
it("stores the size plan with the request without deleting other details", () => {
  saveProjectDraft({
    name: "Test",
    email: "test@example.com",
    notes: "Keep these notes",
  });
  saveProjectDraft({ sizePlan: plan, garment: plan.garment, quantity: "24" });
  expect(readProjectDraft()).toMatchObject({
    name: "Test",
    notes: "Keep these notes",
    sizePlan: plan,
  });
  saveProjectDraft({ sizePlan: undefined });
  expect(readProjectDraft().sizePlan).toBeUndefined();
});
it("recovers safe defaults from malformed browser data", () => {
  localStorage.setItem(
    PROJECT_DRAFT_KEY,
    JSON.stringify({
      name: { invalid: true },
      email: 23,
      type: "bogus",
      sizePlan: { bad: true },
    }),
  );
  expect(readProjectDraft()).toEqual(emptyProjectIntake);
});
it("surfaces a current autosaved request without requiring a history snapshot", () => {
  expect(hasCurrentProjectDraft()).toBe(false);
  saveProjectDraft({ type: "bulk" });
  expect(hasCurrentProjectDraft()).toBe(false);
  saveProjectDraft({ garment: "custom" });
  expect(hasCurrentProjectDraft()).toBe(true);
});
it("exports a human-readable brief including size counts and no false receipt", () => {
  const brief = projectBrief(
    { ...emptyProjectIntake, name: "Organizer", sizePlan: plan },
    [],
  );
  expect(brief).toContain("DRAFT — NOT SENT TO BEE");
  expect(brief).toContain("Total: 24 pieces");
  expect(brief).toContain("Contact name: Organizer");
  expect(brief).not.toContain("REQUEST RECORDED");
  expect(
    projectBrief(emptyProjectIntake, [], {
      reference: "BEE-test",
      receivedAt: "today",
    }),
  ).toContain("REQUEST RECORDED — BEE-test");
});
it("removes only the selected local project and its notes", () => {
  const first = createProject(emptyProjectIntake, []);
  const second = createProject(
    { ...emptyProjectIntake, garment: "Hoodie" },
    [],
  );
  saveProjectNote(first.id, "Remove me");
  saveProjectNote(second.id, "Keep me");
  deleteProjectCopy(first.id);
  expect(readProjects().map((p) => p.id)).toEqual([second.id]);
  expect(readProjectNotes().map((n) => n.body)).toEqual(["Keep me"]);
});
