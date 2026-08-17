export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  workingName: 'BEE Organization',
  legalName: 'BEE Organization LLC',
  descriptor: 'Custom Apparel · Embroidery · Graphic Goods',
  primaryMessage: 'Custom apparel built around your group, brand, or idea.',
  supportingMessage: 'Custom embroidery and graphic apparel for individual pieces, creator merch, and group orders—designed, approved, and organized in one place.',
  email: '',
  phone: '',
  serviceArea: 'Schools, teams, organizations, businesses, creators, events, and individual projects.',
} as const;

export const navItems: NavItem[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Design', href: '/studio' },
  { label: 'Bulk & Organizations', href: '/bulk-orders' },
  { label: 'Creator Merch', href: '/creator-merch' },
  { label: 'Work', href: '/our-work' },
  { label: 'About', href: '/about' },
];

export const orderSteps = [
  ['01', 'Design or request', 'Start in Studio or tell us what you need. Rough quantities and unfinished artwork are okay.'],
  ['02', 'Review the details', 'Garment, artwork, placement, quantity, timing, and fulfillment are organized around the project.'],
  ['03', 'Approve quote + proof', 'Pricing and the production proof are explicit checkpoints before anything is made.'],
  ['04', 'Produce, deliver, reorder', 'The approved project moves through production and its key details remain useful for future orders.'],
] as const;

export const faqs = [
  ['Is there a minimum quantity?', 'Minimums depend on the garment, decoration method, artwork, and project. A quote confirms what is practical.'],
  ['Can BEE help with artwork?', 'Yes. Existing logos and designs can be reviewed, and unfinished concepts can be discussed before production.'],
  ['How long does an order take?', 'Timing is confirmed after garment availability, artwork, quantity, and approvals are understood.'],
  ['Can we reorder later?', 'Yes. Approved project details can become a starting point for a reorder while current availability and pricing are reconfirmed.'],
] as const;
