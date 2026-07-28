import type { BrandDirection } from '../types/brand';

export const brandDirections: BrandDirection[] = [
  {
    id: 'engineered',
    number: '01',
    name: 'Engineered Monogram',
    tagline: 'Built with precision. Made to perform.',
    thesis:
      'A modular B assembled from engineered panels, with a restrained amber insert that hints at a wing, stitch path, and fabrication component without becoming a mascot.',
    audience: 'Best for long-term growth across apparel, creator merchandise, production services, and possible technology offerings.',
    traits: ['Precise', 'Technical', 'Modular', 'Durable'],
    colors: [
      { name: 'Carbon', value: '#0A0B0D' },
      { name: 'Graphite', value: '#1D2025' },
      { name: 'Steel', value: '#AEB4BC' },
      { name: 'Warm White', value: '#F4F1E9' },
      { name: 'Amber', value: '#E3A72F' },
    ],
    logo: '/brand/directions/engineered-monogram.svg',
    recommended: true,
  },
  {
    id: 'maker',
    number: '02',
    name: 'Modern Maker',
    tagline: 'Crafted to stand out.',
    thesis:
      'A more energetic system built from stitch-like stripes, workwear geometry, and a bold block B. It feels approachable, creative, and connected to hands-on production.',
    audience: 'Best for creator collaborations, local events, community apparel, and a louder social-media presence.',
    traits: ['Creative', 'Hands-on', 'Energetic', 'Accessible'],
    colors: [
      { name: 'Ink', value: '#111214' },
      { name: 'Charcoal', value: '#25272B' },
      { name: 'Canvas', value: '#ECE7DC' },
      { name: 'Amber', value: '#F0B533' },
      { name: 'Signal White', value: '#FFFFFF' },
    ],
    logo: '/brand/directions/modern-maker.svg',
  },
  {
    id: 'premium',
    number: '03',
    name: 'Premium Apparel Studio',
    tagline: 'Elevated apparel. Personally produced.',
    thesis:
      'A refined outlined monogram with generous spacing and boutique-fashion restraint. This direction emphasizes finish, presentation, and premium creator collections.',
    audience: 'Best for elevated apparel capsules, boutique creator merchandise, client gifting, and polished brand partnerships.',
    traits: ['Elevated', 'Minimal', 'Editorial', 'Refined'],
    colors: [
      { name: 'Obsidian', value: '#090A0C' },
      { name: 'Black Satin', value: '#17181B' },
      { name: 'Ivory', value: '#F3EFE5' },
      { name: 'Champagne', value: '#CDAA62' },
      { name: 'Stone', value: '#8A8984' },
    ],
    logo: '/brand/directions/premium-apparel.svg',
  },
];
