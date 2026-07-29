import type { BrandDirection } from '../types/brand';

export const brandDirections: BrandDirection[] = [
  {
    id: 'everson-supply',
    number: '01',
    name: 'Everson Supply Co.',
    tagline: 'Heritage, reliability, and room to grow.',
    thesis:
      'A founder-led name that trades insect branding for Brian’s family name. It feels established, dependable, and credible when approaching schools, businesses, teams, and community organizations.',
    audience: 'Best for wholesale trust, local relationships, institutional buyers, and a future product catalog beyond apparel.',
    traits: ['Established', 'Dependable', 'Founder-led', 'Expandable'],
    colors: [
      { name: 'Carbon', value: '#0B0D10' },
      { name: 'Tungsten', value: '#343A40' },
      { name: 'Bone', value: '#F3F0E8' },
      { name: 'Copper', value: '#C8793A' },
      { name: 'Slate', value: '#77818A' },
    ],
    logo: '/brand/rebrand/everson-supply-concept.svg',
  },
  {
    id: 'bee-assembly',
    number: '02',
    name: 'BEE Assembly',
    tagline: 'Built together. Made to represent.',
    thesis:
      'BEE becomes Brian Eugene Everson’s founder mark rather than a mascot. Assembly connects groups coming together, garments being produced, and Brian’s interest in building computer hardware and systems.',
    audience: 'Best overall balance for schools, teams, organizations, creators, custom apparel, and possible technology services later.',
    traits: ['Modular', 'Community-first', 'Technical', 'Memorable'],
    colors: [
      { name: 'Carbon', value: '#0B0D10' },
      { name: 'Steel', value: '#394047' },
      { name: 'Bone', value: '#F5F2EA' },
      { name: 'Copper', value: '#C8793A' },
      { name: 'Signal', value: '#E0A53A' },
    ],
    logo: '/brand/rebrand/bee-assembly-horizontal-dark.svg',
    recommended: true,
  },
  {
    id: 'bee-foundry',
    number: '03',
    name: 'BEE Foundry',
    tagline: 'Where ideas become finished goods.',
    thesis:
      'The most maker-driven route. Foundry positions the company as a place where artwork, blank garments, fabrication, and technical ideas are transformed into finished products.',
    audience: 'Best for a workshop-forward identity, creator collaborations, production storytelling, and future fabrication or hardware work.',
    traits: ['Crafted', 'Industrial', 'Experimental', 'Builder-led'],
    colors: [
      { name: 'Forge', value: '#111315' },
      { name: 'Iron', value: '#464C51' },
      { name: 'Canvas', value: '#ECE7DD' },
      { name: 'Ember', value: '#B86632' },
      { name: 'Ash', value: '#92918C' },
    ],
    logo: '/brand/rebrand/bee-foundry-concept.svg',
  },
];
