export type StoreCategory = 'Embroidery' | 'Graphic Apparel' | 'Teams & Organizations' | 'Creator Merch';

export type StoreProduct = {
  slug: string;
  name: string;
  category: StoreCategory;
  badge: string;
  description: string;
  mediaLabel: string;
  decoration: string;
  bestFor: string;
  quantityGuidance: string;
  colors: readonly string[];
  sizes: readonly string[];
  featured?: boolean;
};

export const storeCategories = ['All', 'Embroidery', 'Graphic Apparel', 'Teams & Organizations', 'Creator Merch'] as const;

export const storeProducts: readonly StoreProduct[] = [
  {
    slug: 'embroidered-performance-polo',
    name: 'Embroidered Performance Polo',
    category: 'Embroidery',
    badge: 'Professional staple',
    description: 'A clean starting point for staff, teams, businesses, departments, and organization apparel that needs a durable embroidered finish.',
    mediaLabel: 'Polo / left-chest embroidery',
    decoration: 'Embroidery',
    bestFor: 'Staff apparel, uniforms, organizations, client-facing teams',
    quantityGuidance: 'Useful for small staff runs through recurring organization programs.',
    colors: ['Black', 'Charcoal', 'Navy', 'White', 'Royal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    featured: true,
  },
  {
    slug: 'heavyweight-creator-hoodie',
    name: 'Heavyweight Creator Hoodie',
    category: 'Creator Merch',
    badge: 'Creator-ready',
    description: 'A substantial hoodie base intended for creator drops, community pieces, premium graphics, and embroidery-led capsule collections.',
    mediaLabel: 'Heavyweight fleece / creator collection',
    decoration: 'Graphic decoration or embroidery',
    bestFor: 'Creators, communities, limited collections, premium merch',
    quantityGuidance: 'Ideal for pilot runs that can grow into repeat drops.',
    colors: ['Black', 'Bone', 'Heather Gray', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    featured: true,
  },
  {
    slug: 'team-performance-tee',
    name: 'Team Performance Tee',
    category: 'Teams & Organizations',
    badge: 'Group program',
    description: 'A performance-oriented shirt base for teams, clubs, events, camps, and staff programs that need organized size runs and repeatability.',
    mediaLabel: 'Performance tee / team graphics',
    decoration: 'Graphic decoration',
    bestFor: 'Teams, camps, clubs, events, organization programs',
    quantityGuidance: 'Built around coordinated quantity and size collection.',
    colors: ['Black', 'White', 'Navy', 'Royal', 'Red', 'Graphite'],
    sizes: ['Youth S', 'Youth M', 'Youth L', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    featured: true,
  },
  {
    slug: 'structured-embroidered-cap',
    name: 'Structured Embroidered Cap',
    category: 'Embroidery',
    badge: 'High-visibility branding',
    description: 'A structured cap platform for staff, teams, creator collections, business branding, and group programs where a compact mark carries the identity.',
    mediaLabel: 'Structured cap / front embroidery',
    decoration: 'Embroidery',
    bestFor: 'Businesses, teams, creators, events, staff apparel',
    quantityGuidance: 'Good for coordinated runs and reorder programs.',
    colors: ['Black', 'Charcoal', 'Navy', 'Khaki', 'Black / White'],
    sizes: ['Adjustable', 'S/M', 'L/XL'],
  },
  {
    slug: 'event-essential-tee',
    name: 'Event Essential Tee',
    category: 'Graphic Apparel',
    badge: 'Flexible graphic base',
    description: 'A versatile tee starting point for events, reunions, fundraisers, staff days, community programs, and detailed graphic artwork.',
    mediaLabel: 'Cotton tee / graphic decoration',
    decoration: 'Graphic decoration',
    bestFor: 'Events, fundraisers, communities, one-time group orders',
    quantityGuidance: 'Designed for simple size runs through larger coordinated orders.',
    colors: ['Black', 'White', 'Heather Gray', 'Navy', 'Forest', 'Maroon'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
  },
  {
    slug: 'workwear-quarter-zip',
    name: 'Embroidered Workwear Quarter-Zip',
    category: 'Embroidery',
    badge: 'Elevated uniform',
    description: 'A polished layer for management teams, office staff, field teams, and organizations that want a more elevated uniform piece.',
    mediaLabel: 'Quarter-zip / embroidered chest mark',
    decoration: 'Embroidery',
    bestFor: 'Businesses, leadership teams, schools, staff programs',
    quantityGuidance: 'Best when garment consistency and future reorders matter.',
    colors: ['Black', 'Charcoal', 'Navy', 'Heather Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    slug: 'creator-graphic-tee',
    name: 'Creator Graphic Tee',
    category: 'Creator Merch',
    badge: 'Drop foundation',
    description: 'A creator-focused tee base for artwork-led releases, community designs, channel milestones, limited runs, and repeat collection pieces.',
    mediaLabel: 'Premium tee / creator artwork',
    decoration: 'Graphic decoration',
    bestFor: 'Streamers, creators, artists, gaming communities, personal brands',
    quantityGuidance: 'Works well as a focused first product before expanding a catalog.',
    colors: ['Black', 'White', 'Washed Black', 'Bone', 'Forest'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    slug: 'organization-full-zip',
    name: 'Organization Full-Zip Layer',
    category: 'Teams & Organizations',
    badge: 'Repeat-program ready',
    description: 'A practical full-zip layer for staff, volunteers, coaching teams, departments, and recurring organization apparel programs.',
    mediaLabel: 'Full-zip layer / organization branding',
    decoration: 'Embroidery or graphic decoration',
    bestFor: 'Organizations, staff teams, coaches, volunteers, recurring programs',
    quantityGuidance: 'Structured for multi-size orders and future replenishment.',
    colors: ['Black', 'Navy', 'Charcoal', 'Royal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
];

export function findStoreProduct(slug: string) {
  return storeProducts.find((product) => product.slug === slug);
}

export const dashboardPreviewProjects = [
  {
    label: 'Sample quote',
    title: 'Staff polos + embroidered caps',
    status: 'Needs details',
    progress: 24,
    nextAction: 'Confirm garment mix and estimated size range',
    meta: 'Quote stage · Demo content',
  },
  {
    label: 'Sample proof',
    title: 'Creator heavyweight hoodie',
    status: 'Awaiting approval',
    progress: 48,
    nextAction: 'Review front artwork placement and approve or request changes',
    meta: 'Proof stage · Demo content',
  },
  {
    label: 'Sample production',
    title: 'Team performance shirts',
    status: 'In production',
    progress: 76,
    nextAction: 'No action needed right now',
    meta: 'Production stage · Demo content',
  },
] as const;

export const dashboardPreviewReorders = [
  {
    title: 'Structured embroidered caps',
    detail: 'Prior configuration retained: black cap · front embroidery',
    note: 'Availability and current pricing would be reconfirmed before a reorder.',
  },
  {
    title: 'Staff performance polos',
    detail: 'Prior configuration retained: navy polo · left-chest embroidery',
    note: 'Update quantities and sizes without rebuilding the project from zero.',
  },
] as const;
