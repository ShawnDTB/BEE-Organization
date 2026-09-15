import { studioDescription } from "../../shared/studio";
import type { RequestDetails, RequestItem } from "../../shared/request";
import { sizePlanLines, sizePlanTotal } from "../../shared/sizePlan";
export function projectBrief(
  intake: RequestDetails,
  items: RequestItem[],
  receipt?: { reference: string; receivedAt: string } | null,
) {
  const fields: [string, string][] = [
    ["Project type", intake.type],
    ["Organization / brand", intake.organization],
    ["Garments", intake.garment],
    ["Estimated quantity", intake.quantity],
    ["Need-by date", intake.deadline],
    ["Artwork", intake.artwork],
    ["Fulfillment", intake.fulfillment],
    ["Personalization", intake.personalization],
    ["Project notes", intake.notes],
    ["Contact name", intake.name],
    ["Email", intake.email],
    ["Phone", intake.phone],
  ];
  return [
    "WORKS BY BEE",
    "Build. Empower. Equip.",
    "",
    receipt
      ? `REQUEST RECORDED — ${receipt.reference}\nReceived: ${receipt.receivedAt}`
      : "DRAFT — NOT SENT TO BEE",
    "Not a quote, production approval, invoice, or payment receipt.",
    "",
    ...fields.map(
      ([label, value]) => `${label}: ${value.trim() || "To be discussed"}`,
    ),
    "",
    ...(intake.sizePlan
      ? [
          "GROUP SIZE PLAN",
          `${intake.sizePlan.garment} · ${intake.sizePlan.color || "Color to be discussed"}`,
          sizePlanLines(intake.sizePlan),
          `Total: ${sizePlanTotal(intake.sizePlan)} pieces`,
          "Sizes/availability require garment-specific confirmation.",
          "",
        ]
      : []),
    "DESIGN REFERENCES",
    ...(items.length
      ? items.map(
          (item, index) =>
            `${index + 1}. ${item.design?.name || item.productSlug}\n   ${item.quantity} × ${item.size}; ${item.color}; ${item.decoration}${item.design ? `\n   ${item.design.document ? studioDescription(item.design.document) + " · 12 × 16 in artwork boards" : item.design.view + "; " + item.design.placement + "; text: " + (item.design.text || "None")}` : ""}`,
        )
      : ["No Studio designs attached. A mockup is optional."]),
    "",
    "This text brief does not embed artwork. Keep the JSON copy for design snapshots.",
    "Contains contact/project details. Share only with the intended recipient.",
    "https://worksbybee.com",
    "",
  ].join("\n");
}
