import type { RequestDetails, RequestItem } from "./request";
export const triageLabels = {
  new: "New",
  reviewing: "Reviewing",
  "needs-details": "Needs details",
  "ready-to-quote": "Ready to quote",
  archived: "Archived",
} as const;
export type TriageStatus = keyof typeof triageLabels;
export type InboxRow = {
  id: string;
  reference: string;
  receivedAt: string;
  name: string;
  organization: string;
  garment: string;
  quantity: string;
  deadline: string;
  status: TriageStatus;
  version: number;
  updatedAt: string;
};
export type StaffEvent = {
  id: string;
  version: number;
  status: TriageStatus;
  note: string;
  actorEmail: string;
  createdAt: string;
};
export type InboxDetail = InboxRow & {
  snapshot: { intake: RequestDetails; items: RequestItem[] };
  events: StaffEvent[];
};
