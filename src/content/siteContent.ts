export type NavItem = {
  label: string;
  href: string;
};

export type ServiceCard = {
  code: string;
  title: string;
  description: string;
  href: string;
  audience: string;
};

export const siteConfig = {
  workingName: 'BEE Organization',
  legalName: 'BEE Organization LLC',
  descriptor: 'Custom Apparel · Embroidery · Graphic Goods',
  primaryMessage: 'Custom apparel built around your group, brand, or idea.',
  email: '',
  phone: '',
  serviceArea: 'Serving schools, organizations, creators, businesses, teams, events, and individuals.',
  brandStatus: 'Public name and final logo pending approval.',
} as const;

export const navItems: NavItem[] = [
  { label: 'Bulk Orders', href: '/bulk-orders' },
  { label: 'Embroidery', href: '/embroidery' },
  { label: 'Graphic Apparel', href: '/graphic-apparel' },
  { label: 'Creator Merch', href: '/creator-merch' },
  { label: 'Organizations', href: '/schools-organizations' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'About', href: '/about' },
];

export const serviceCards: ServiceCard[] = [
  {
    code: '01',
    title: 'Bulk apparel programs',
    description: 'Organized custom apparel for schools, teams, businesses, events, clubs, and community groups.',
    href: '/bulk-orders',
    audience: 'Best for repeatable group orders',
  },
  {
    code: '02',
    title: 'Embroidery',
    description: 'Professional stitched decoration for polos, hats, outerwear, workwear, bags, and branded uniforms.',
    href: '/embroidery',
    audience: 'Best for durable, elevated branding',
  },
  {
    code: '03',
    title: 'Graphic apparel',
    description: 'Printed and transferred graphics selected around the artwork, garment, order size, and intended use.',
    href: '/graphic-apparel',
    audience: 'Best for detailed or colorful artwork',
  },
  {
    code: '04',
    title: 'Creator merchandise',
    description: 'Small-run and scalable merchandise systems for streamers, content creators, artists, and communities.',
    href: '/creator-merch',
    audience: 'Best for branded launches and reorders',
  },
];

export const orderSteps = [
  ['01', 'Share the project', 'Tell us who the order is for, what you need, the quantity range, and your target date.'],
  ['02', 'Review options', 'We organize garment, decoration, placement, and production choices around the request.'],
  ['03', 'Approve pricing', 'You receive an itemized quote before production commitments are made.'],
  ['04', 'Approve the proof', 'Artwork placement and key details are confirmed before the order moves forward.'],
  ['05', 'Production', 'The approved order is produced and checked against the submitted specifications.'],
  ['06', 'Pickup, delivery, or reorder', 'Completed orders are released through the agreed method and retained for easier reordering.'],
] as const;

export const trustPoints = [
  ['Proof before production', 'Artwork and placement are reviewed before the order enters production.'],
  ['Clear order structure', 'Sizes, quantities, garment colors, and decoration locations are organized in one request.'],
  ['Method selected by project', 'Decoration recommendations account for artwork, material, quantity, durability, and budget.'],
  ['Reorder-ready records', 'Approved artwork and order details can be retained so repeat customers do not start from zero.'],
] as const;

export const faqs = [
  ['Is there a minimum quantity?', 'Minimums depend on the garment, decoration method, and artwork. The quote process confirms what is practical for each project.'],
  ['Can you help with artwork?', 'Yes. Existing logos and designs can be reviewed, and design-preparation needs can be included in the quote.'],
  ['How long does an order take?', 'Turnaround begins after pricing, artwork, garment availability, and the proof are approved. A target schedule is provided with the quote rather than promised generically.'],
  ['Can we reorder later?', 'Yes. Reorders are a core part of the planned system. Availability and pricing are reconfirmed because garment inventory and supplier costs can change.'],
  ['Do you accept customer-supplied garments?', 'This may be possible after the garment and decoration method are reviewed. Customer-supplied items require separate risk and replacement terms.'],
] as const;
