export type ProjectTimelineStep = {
  label: string;
  detail: string;
  state: 'complete' | 'current' | 'upcoming';
};

export type CustomerProject = {
  id: string;
  label: string;
  title: string;
  status: string;
  stage: 'Quote' | 'Proof' | 'Production';
  progress: number;
  nextAction: string;
  updated: string;
  timeline: readonly ProjectTimelineStep[];
};

export const customerProjects: readonly CustomerProject[] = [
  {
    id: 'demo-staff-kit',
    label: 'Sample quote',
    title: 'Staff polos + embroidered caps',
    status: 'Needs details',
    stage: 'Quote',
    progress: 24,
    nextAction: 'Confirm garment mix and estimated size range',
    updated: 'Demo project · quote stage',
    timeline: [
      { label: 'Request received', detail: 'Project context collected', state: 'complete' },
      { label: 'Quote details', detail: 'Garment mix and size range needed', state: 'current' },
      { label: 'Pricing review', detail: 'Prepared after project details', state: 'upcoming' },
      { label: 'Proof', detail: 'Artwork and placement approval', state: 'upcoming' },
      { label: 'Production', detail: 'Begins only after approvals', state: 'upcoming' },
    ],
  },
  {
    id: 'demo-creator-hoodie',
    label: 'Sample proof',
    title: 'Creator heavyweight hoodie',
    status: 'Awaiting approval',
    stage: 'Proof',
    progress: 52,
    nextAction: 'Review front artwork placement and approve or request changes',
    updated: 'Demo project · proof stage',
    timeline: [
      { label: 'Request received', detail: 'Project context collected', state: 'complete' },
      { label: 'Quote approved', detail: 'Sample commercial checkpoint', state: 'complete' },
      { label: 'Proof ready', detail: 'Front artwork placement needs review', state: 'current' },
      { label: 'Production', detail: 'Waiting on proof approval', state: 'upcoming' },
      { label: 'Delivery', detail: 'Fulfillment details confirmed later', state: 'upcoming' },
    ],
  },
  {
    id: 'demo-team-shirts',
    label: 'Sample production',
    title: 'Team performance shirts',
    status: 'In production',
    stage: 'Production',
    progress: 78,
    nextAction: 'No action needed right now',
    updated: 'Demo project · production stage',
    timeline: [
      { label: 'Request received', detail: 'Project context collected', state: 'complete' },
      { label: 'Quote approved', detail: 'Sample commercial checkpoint', state: 'complete' },
      { label: 'Proof approved', detail: 'Artwork checkpoint complete', state: 'complete' },
      { label: 'Production', detail: 'Sample status for interface design', state: 'current' },
      { label: 'Delivery', detail: 'Release after quality review', state: 'upcoming' },
    ],
  },
];

export const proofPreview = {
  projectId: 'demo-creator-hoodie',
  title: 'Creator heavyweight hoodie',
  version: 'Proof v2',
  placement: 'Center chest graphic · 11 in wide preview',
  garment: 'Heavyweight hoodie · black development configuration',
  note: 'This is interface demo content. No real artwork, customer, approval, or production instruction is represented.',
} as const;

export const reorderStartingPoints = [
  {
    title: 'Structured embroidered caps',
    productSlug: 'structured-embroidered-cap',
    detail: 'Black cap · front embroidery · prior configuration concept retained',
    note: 'Availability and current pricing would be reconfirmed before a real reorder.',
  },
  {
    title: 'Staff performance polos',
    productSlug: 'embroidered-performance-polo',
    detail: 'Navy polo · left-chest embroidery · prior configuration concept retained',
    note: 'Update quantities and sizes without rebuilding the project from zero.',
  },
] as const;

export const savedDesigns = [
  { name: 'Primary logo', type: 'Brand mark', status: 'Demo approved asset', use: 'General apparel' },
  { name: 'One-color embroidery mark', type: 'Production variant', status: 'Demo production-ready', use: 'Chest and cap embroidery' },
  { name: 'Back graphic', type: 'Graphic artwork', status: 'Demo approved asset', use: 'Creator and event apparel' },
  { name: 'Event lockup', type: 'Campaign artwork', status: 'Demo archived version', use: 'Prior event concept' },
] as const;
