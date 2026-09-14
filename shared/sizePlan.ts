export const apparelSizes = [
  "Youth XS",
  "Youth S",
  "Youth M",
  "Youth L",
  "Youth XL",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
] as const;
export type SizePlan = {
  garment: string;
  color: string;
  counts: Partial<Record<(typeof apparelSizes)[number], number>>;
};
export function sizePlanTotal(plan: SizePlan) {
  return apparelSizes.reduce(
    (total, size) => total + (plan.counts[size] || 0),
    0,
  );
}
export function validateSizePlan(value: unknown): SizePlan {
  if (!value || typeof value !== "object")
    throw new Error("Check the size plan.");
  const p = value as Record<string, unknown>;
  if (
    typeof p.garment !== "string" ||
    !p.garment.trim() ||
    p.garment.length > 120 ||
    typeof p.color !== "string" ||
    p.color.length > 80 ||
    /[\u0000-\u001f]/.test(p.garment + p.color)
  )
    throw new Error("Enter a garment and a valid color description.");
  if (!p.counts || typeof p.counts !== "object" || Array.isArray(p.counts))
    throw new Error("Check the size counts.");
  const counts: SizePlan["counts"] = {};
  for (const [size, count] of Object.entries(p.counts)) {
    if (
      !apparelSizes.includes(size as (typeof apparelSizes)[number]) ||
      typeof count !== "number" ||
      !Number.isInteger(count) ||
      count < 0 ||
      count > 10000
    )
      throw new Error("Size counts must be whole numbers from 0 to 10,000.");
    if (count) counts[size as (typeof apparelSizes)[number]] = count;
  }
  const plan = { garment: p.garment.trim(), color: p.color.trim(), counts };
  if (sizePlanTotal(plan) < 1 || sizePlanTotal(plan) > 10000)
    throw new Error("Plan between 1 and 10,000 pieces in total.");
  return plan;
}
export function sizePlanLines(plan: SizePlan): string {
  return apparelSizes
    .filter((size) => plan.counts[size])
    .map((size) => `${size}: ${plan.counts[size]}`)
    .join(" · ");
}
