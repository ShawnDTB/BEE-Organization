export type BrandDirection = {
  id: 'engineered' | 'maker' | 'premium';
  number: string;
  name: string;
  tagline: string;
  thesis: string;
  audience: string;
  traits: string[];
  colors: { name: string; value: string }[];
  logo: string;
  recommended?: boolean;
};
