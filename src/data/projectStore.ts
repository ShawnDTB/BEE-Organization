export const CART_KEY = 'bee-project-bag-v1';
export const CART_EVENT = 'bee-cart-updated';
export const DRAFT_KEY = 'bee-studio-drafts-v1';
export const PROJECT_DRAFT_KEY = 'bee-current-project-draft-v1';
export const PROJECTS_KEY = 'bee-projects-v1';
export const PROJECT_EVENT = 'bee-projects-updated';
export const COLLECTOR_KEY = 'bee-group-collector-v1';
export const PROJECT_NOTES_KEY = 'bee-project-notes-v1';

export type GarmentType = 'tee' | 'hoodie' | 'polo';
export type GarmentView = 'front' | 'back';
export type DecorationType = 'embroidery' | 'graphic';
export type PlacementPreset = 'left-chest' | 'center-front' | 'full-front' | 'center-back';
export type IntakeType = 'custom' | 'bulk' | 'creator' | 'unsure';

export type StudioDraft = {
  id: string;
  name: string;
  garment: GarmentType;
  color: string;
  view: GarmentView;
  decoration: DecorationType;
  text: string;
  textColor: string;
  artworkData?: string;
  placement: PlacementPreset;
  x: number;
  y: number;
  scale: number;
  size: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectBagItem = {
  id: string;
  draftId?: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  decoration: string;
};

export type ProjectIntake = {
  type: IntakeType;
  garment: string;
  quantity: string;
  artwork: string;
  deadline: string;
  fulfillment: string;
  personalization: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
};

export type ProjectTimelineStep = { label: string; detail: string; state: 'complete' | 'current' | 'upcoming' };

export type BeeProject = {
  id: string;
  reference: string;
  title: string;
  type: IntakeType;
  stage: 'Request' | 'Quote' | 'Proof' | 'Production' | 'Complete';
  status: string;
  progress: number;
  nextAction: string;
  intake: ProjectIntake;
  items: ProjectBagItem[];
  designIds: string[];
  timeline: ProjectTimelineStep[];
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
};

export type ProjectNote = { id: string; projectId: string; body: string; createdAt: string };
export type CollectorParticipant = { id: string; name: string; item: string; size: string; personalization: string; createdAt: string };
export type CollectorState = { target: number; participants: CollectorParticipant[]; updatedAt: string };

export const emptyProjectIntake: ProjectIntake = { type: 'custom', garment: '', quantity: '', artwork: '', deadline: '', fulfillment: '', personalization: '', name: '', organization: '', email: '', phone: '', notes: '' };

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function readArray<T>(key: string): T[] {
  const value = parseJson<unknown>(window.localStorage.getItem(key), []);
  return Array.isArray(value) ? value as T[] : [];
}

function write(key: string, value: unknown) { window.localStorage.setItem(key, JSON.stringify(value)); }

export function readDrafts(): StudioDraft[] {
  return readArray<StudioDraft>(DRAFT_KEY).map((draft) => ({ ...draft, name: draft.name || `${draft.garment ?? 'Garment'} draft`, updatedAt: draft.updatedAt || draft.createdAt || new Date().toISOString() }));
}
export function getDraft(id: string | null | undefined) { return id ? readDrafts().find((draft) => draft.id === id) : undefined; }
export function saveStudioDraft(draft: StudioDraft) {
  const drafts = readDrafts(); const index = drafts.findIndex((item) => item.id === draft.id);
  write(DRAFT_KEY, index >= 0 ? drafts.map((item) => item.id === draft.id ? draft : item) : [...drafts, draft]);
  window.dispatchEvent(new Event(PROJECT_EVENT)); return draft;
}
export function duplicateStudioDraft(id: string) {
  const source = getDraft(id); if (!source) return undefined; const now = new Date().toISOString();
  const copy: StudioDraft = { ...source, id: `studio-${Date.now()}`, name: `${source.name} copy`, createdAt: now, updatedAt: now }; saveStudioDraft(copy); return copy;
}
export function renameStudioDraft(id: string, name: string) { const draft = getDraft(id); if (draft) saveStudioDraft({ ...draft, name: name.trim() || draft.name, updatedAt: new Date().toISOString() }); }
export function deleteStudioDraft(id: string) { write(DRAFT_KEY, readDrafts().filter((draft) => draft.id !== id)); saveBag(readBag().filter((item) => item.draftId !== id && item.id !== id)); window.dispatchEvent(new Event(PROJECT_EVENT)); }

export function readBag(): ProjectBagItem[] { return readArray<ProjectBagItem>(CART_KEY).map((item) => ({ ...item, draftId: item.draftId || (item.id.startsWith('studio-') ? item.id : undefined) })); }
export function saveBag(items: ProjectBagItem[]) { write(CART_KEY, items); window.dispatchEvent(new Event(CART_EVENT)); window.dispatchEvent(new Event(PROJECT_EVENT)); }
export function upsertBagItem(item: ProjectBagItem) { const items = readBag(); const index = items.findIndex((existing) => existing.id === item.id || (item.draftId && existing.draftId === item.draftId)); saveBag(index >= 0 ? items.map((existing, i) => i === index ? item : existing) : [...items, item]); }

export function readProjectDraft(): ProjectIntake { return { ...emptyProjectIntake, ...parseJson<Partial<ProjectIntake>>(window.localStorage.getItem(PROJECT_DRAFT_KEY), {}) }; }
export function saveProjectDraft(patch: Partial<ProjectIntake>) { const next = { ...readProjectDraft(), ...patch }; write(PROJECT_DRAFT_KEY, next); window.dispatchEvent(new Event(PROJECT_EVENT)); return next; }
export function clearProjectDraft() { window.localStorage.removeItem(PROJECT_DRAFT_KEY); window.dispatchEvent(new Event(PROJECT_EVENT)); }
export function readProjects(): BeeProject[] { return readArray<BeeProject>(PROJECTS_KEY); }

function nextReference(projects: BeeProject[]) {
  const highest = projects.reduce((max, project) => { const match = project.reference.match(/BEE-(\d+)/i); return Math.max(max, match ? Number(match[1]) : 0); }, 0);
  return `BEE-${String(highest + 1).padStart(4, '0')}`;
}
function projectTitle(intake: ProjectIntake, items: ProjectBagItem[]) {
  if (intake.organization.trim()) return `${intake.organization.trim()} apparel`;
  if (intake.garment.trim()) return intake.garment.trim();
  if (items.length > 0) return items.length === 1 ? 'Custom apparel project' : `${items.length}-design apparel project`;
  return intake.type === 'creator' ? 'Creator merchandise project' : intake.type === 'bulk' ? 'Group apparel project' : 'Custom apparel project';
}
export function createProject(intake: ProjectIntake, items = readBag()) {
  const projects = readProjects(); const now = new Date().toISOString(); const reference = nextReference(projects);
  const project: BeeProject = {
    id: `project-${Date.now()}`, reference, title: projectTitle(intake, items), type: intake.type, stage: 'Request', status: 'Request received', progress: 10, nextAction: 'BEE review', intake, items,
    designIds: items.map((item) => item.draftId || item.id).filter(Boolean),
    timeline: [
      { label: 'Request', detail: 'Project details saved and ready for review.', state: 'current' },
      { label: 'Quote', detail: 'Garment, quantity, pricing, and timing are confirmed.', state: 'upcoming' },
      { label: 'Proof', detail: 'Artwork and placement are approved.', state: 'upcoming' },
      { label: 'Production', detail: 'Approved work is produced and checked.', state: 'upcoming' },
      { label: 'Delivery', detail: 'Pickup, delivery, or shipping completes the order.', state: 'upcoming' },
    ],
    createdAt: now, updatedAt: now, submittedAt: now,
  };
  write(PROJECTS_KEY, [project, ...projects]); clearProjectDraft(); saveBag([]); window.dispatchEvent(new Event(PROJECT_EVENT)); return project;
}

export function readProjectNotes(): ProjectNote[] { return readArray<ProjectNote>(PROJECT_NOTES_KEY); }
export function saveProjectNote(projectId: string, body: string) {
  const clean = body.trim(); if (!clean) return undefined;
  const note: ProjectNote = { id: `note-${Date.now()}`, projectId, body: clean, createdAt: new Date().toISOString() };
  write(PROJECT_NOTES_KEY, [...readProjectNotes(), note]); window.dispatchEvent(new Event(PROJECT_EVENT)); return note;
}

export function readCollector(): CollectorState {
  const fallback: CollectorState = { target: 12, participants: [], updatedAt: new Date().toISOString() };
  const value = parseJson<CollectorState>(window.localStorage.getItem(COLLECTOR_KEY), fallback);
  return { target: Math.max(1, Number(value.target) || 12), participants: Array.isArray(value.participants) ? value.participants : [], updatedAt: value.updatedAt || fallback.updatedAt };
}
export function saveCollector(next: CollectorState) { write(COLLECTOR_KEY, { ...next, updatedAt: new Date().toISOString() }); window.dispatchEvent(new Event(PROJECT_EVENT)); }
