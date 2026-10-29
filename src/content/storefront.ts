export const shopCategories = [
  { id: "all", label: "All options" },
  { id: "t-shirts", label: "T-shirts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "hats", label: "Hats" },
  { id: "decals", label: "Decals" },
  { id: "embroidery", label: "Embroidery" },
] as const;
export type ShopCategory = (typeof shopCategories)[number]["id"];
export function parseCategory(value: string | null): ShopCategory {
  return shopCategories.find((category) => category.id === value)?.id ?? "all";
}
// Planning options, not sellable inventory. Prices, stock and checkout must
// come from verified commerce data before anything can be offered for sale.
export const shopOptions = [
  {
    id: "tee",
    name: "Your everyday T-shirt",
    category: "t-shirts",
    image: "tee",
    description:
      "A favorite graphic, a team name, or an idea that is entirely yours.",
    detail:
      "Bring your design or describe an idea. Garment, colors, sizes, print placement and price are confirmed before ordering.",
    garment: "T-shirts",
  },
  {
    id: "hoodie",
    name: "Make it a hoodie",
    category: "hoodies",
    image: "hoodie",
    description: "A little extra comfort. A lot of room to make it personal.",
    detail:
      "Plan a front or back design for a hoodie. Fabric, fit, decoration, sizes and price are confirmed before ordering.",
    garment: "Hoodies",
  },
  {
    id: "hat",
    name: "Top it off",
    category: "hats",
    image: "cap",
    description: "A cap with a personal touch, for your crew or just for you.",
    detail:
      "Share your hat style and artwork idea. The team will need to confirm the cap, decoration and pricing.",
    garment: "Hats",
  },
  {
    id: "decal",
    name: "A small detail. All you.",
    category: "decals",
    image: "decal",
    description:
      "Explore an idea for a decal. Product details are being prepared.",
    detail:
      "Decals are a planned category. Materials, surfaces, dimensions, durability and pricing are not confirmed yet. You can save an idea for later.",
    garment: "Decals",
  },
  {
    id: "polo",
    name: "The stitched finishing touch",
    category: "embroidery",
    image: "polo",
    description: "Explore embroidered names and logos for a polished look.",
    detail:
      "Plan embroidery for polos or other garments. Artwork suitability, stitch detail, placement and pricing need review.",
    garment: "Embroidered polos",
  },
  {
    id: "embroidered-cap",
    name: "Your mark, in stitches",
    category: "embroidery",
    image: "cap",
    description: "Keep a name or logo front and center on an embroidered cap.",
    detail:
      "Simple marks are a useful starting point. The team will confirm digitizing, cap compatibility, thread colors and pricing.",
    garment: "Embroidered hats",
  },
] as const;
export function planningHref(option: (typeof shopOptions)[number]) {
  return `/start-order?type=custom&item=${option.id}`;
}
export const plannedCollections = [
  "Cars & motors",
  "Computers & gaming",
  "Healthcare",
  "Seasonal & holiday",
];
export type WorkPhoto = { src: string; alt: string; caption: string };
// Only owner-approved finished-work photography belongs here. An empty list
// intentionally hides the gallery instead of inventing work or testimonials.
export const workPhotos: readonly WorkPhoto[] = [];
