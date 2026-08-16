export type StoreCategory = 'Embroidery' | 'Graphic Apparel' | 'Teams & Organizations' | 'Creator Merch';

export type StoreProduct = {
  slug: string;
  name: string;
  category: StoreCategory;
  badge: string;
  description: string;
  mediaLabel: string;
  image: string;
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
    image: '/store/polo.svg',
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
    image: '/store/hoodie.svg',
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
    image: '/store/tee.svg',
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
    image: '/store/cap.svg',
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
    image: '/store/tee.svg',
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
    image: '/store/layer.svg',
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
    image: '/store/tee.svg',
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
    image: '/store/layer.svg',
    decoration: 'Embroidery or graphic decoration',
    bestFor: 'Organizations, staff teams, coaches, volunteers, recurring programs',
    quantityGuidance: 'Structured for multi-size orders and future replenishment.',
    colors: ['Black', 'Navy', 'Charcoal', 'Royal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
];

export const storeCollections = [
  {
    code: '01',
    title: 'Staff & Team Systems',
    description: 'Polos, caps, and layers selected around consistency, professional presentation, and repeat ordering.',
    productSlugs: ['embroidered-performance-polo', 'structured-embroidered-cap', 'workwear-quarter-zip', 'organization-full-zip'],
    href: '#catalog',
  },
  {
    code: '02',
    title: 'Creator Drop Foundations',
    description: 'Focused garment starting points for creator pilots, community launches, artwork-led releases, and future restocks.',
    productSlugs: ['heavyweight-creator-hoodie', 'creator-graphic-tee'],
    href: '#catalog',
  },
  {
    code: '03',
    title: 'Events & Community Runs',
    description: 'Flexible shirts and performance pieces for events, camps, clubs, fundraisers, reunions, and community programs.',
    productSlugs: ['event-essential-tee', 'team-performance-tee'],
    href: '#catalog',
  },
] as const;

export function findStoreProduct(slug: string) {
  return storeProducts.find((product) => product.slug === slug);
}
