/** Customer intent is separate from the exact wording rendered on the garment. */
export type DesignBrief = {
  occasion: string;
  audience: string;
  subject: string;
  style: string;
  colors: string;
  notes: string;
};
export const briefFields = [
  ["occasion", "Event or purpose"],
  ["audience", "Who is it for?"],
  ["subject", "Mascot or visual idea"],
  ["style", "Style"],
  ["colors", "Preferred colors"],
  ["notes", "Details to keep"],
] as const;
export const emptyBrief = (): DesignBrief => ({
  occasion: "",
  audience: "",
  subject: "",
  style: "",
  colors: "",
  notes: "",
});
export function validateDesignBrief(value: unknown): DesignBrief {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Check the design brief.");
  const source = value as Record<string, unknown>;
  const result = emptyBrief();
  for (const [key] of briefFields) {
    const v = source[key];
    if (
      typeof v !== "string" ||
      v.length > 500 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)
    )
      throw Error("Keep each design brief answer under 500 characters.");
    result[key] = v.trim();
  }
  return result;
}
export function designBriefLines(brief?: DesignBrief): string[] {
  return brief
    ? briefFields
        .filter(([key]) => brief[key]?.trim())
        .map(([key, label]) => `${label}: ${brief[key]}`)
    : [];
}
