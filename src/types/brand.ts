export type BrandDirection = {
  id: 'everson-supply' | 'bee-assembly' | 'bee-foundry';
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
