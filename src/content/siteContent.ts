export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  workingName: "Works by BEE",
  legalName: "BEE Organization LLC",
  descriptor: "Custom Apparel & Embroidery",
  primaryMessage:
    "Custom apparel for teams, brands, creators, and personal projects.",
  supportingMessage:
    "Choose a garment, bring your artwork, or start with a rough idea. BEE organizes the quote, proof, production, and reorder around one project.",
  email: import.meta.env.VITE_PUBLIC_CONTACT_EMAIL || "",
  phone: import.meta.env.VITE_PUBLIC_PHONE || "",
  serviceArea:
    "Schools, teams, organizations, businesses, creators, events, and individual projects.",
} as const;

export const navItems: NavItem[] = [
  { label: "Custom apparel", href: "/custom-apparel" },
  { label: "Groups & businesses", href: "/bulk-orders" },
  { label: "Creator merch", href: "/creator-merch" },
  { label: "About", href: "/about" },
];

export const orderSteps = [
  [
    "01",
    "Start the project",
    "Build a mockup in Studio or send the details you already have.",
  ],
  [
    "02",
    "Confirm the order",
    "Garment, decoration, quantity, pricing, timing, and fulfillment are confirmed together.",
  ],
  [
    "03",
    "Approve the proof",
    "Artwork and placement are approved before production begins.",
  ],
  [
    "04",
    "Make it, deliver it, reorder it",
    "The finished project keeps the useful details needed for a future reorder.",
  ],
] as const;

export const faqs = [
  [
    "Is there a minimum quantity?",
    "Minimums depend on the garment, decoration method, artwork, and project. A quote confirms what is practical.",
  ],
  [
    "Can BEE help with artwork?",
    "Yes. Existing logos and designs can be reviewed, and unfinished concepts can be discussed before production.",
  ],
  [
    "How long does an order take?",
    "Timing is confirmed after garment availability, artwork, quantity, and approvals are understood.",
  ],
  [
    "Can we reorder later?",
    "Yes. Approved project details can become a starting point for a reorder while current availability and pricing are reconfirmed.",
  ],
] as const;
