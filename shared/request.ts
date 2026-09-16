import { validateDesignBrief, type DesignBrief } from "./designBrief";
import { validateSizePlan, type SizePlan } from "./sizePlan";
import { validateStudioDocument, type StudioDocument } from "./studio";
export const MAX_PREVIEW_BYTES = 350_000;
export const MAX_REQUEST_BYTES = 2_000_000;
export type RequestDetails = {
  sizePlan?: SizePlan;
  type: "custom" | "bulk" | "creator" | "unsure";
  garment: string;
  quantity: string;
  artwork: string;
  deadline: string;
  fulfillment: string;
  personalization: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
};
export type DesignSnapshot = {
  brief?: DesignBrief;
  document?: StudioDocument;
  id: string;
  name: string;
  garment: "tee" | "hoodie" | "polo";
  color: string;
  view: "front" | "back";
  decoration: "embroidery" | "graphic";
  text: string;
  textColor: string;
  artworkData?: string;
  placement: "left-chest" | "center-front" | "full-front" | "center-back";
  x: number;
  y: number;
  scale: number;
  size: string;
  quantity: number;
};
export type RequestItem = {
  id: string;
  draftId?: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  decoration: string;
  design?: DesignSnapshot;
};
export type QuoteRequest = {
  requestId: string;
  intake: RequestDetails;
  items: RequestItem[];
  consent: true;
  website: string;
};
export class ValidationError extends Error {}
const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ValidationError("Check the project details.");
  return value as Record<string, unknown>;
};
const string = (v: unknown, max: number, min = 0) => {
  if (
    typeof v !== "string" ||
    v.trim().length < min ||
    v.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)
  )
    throw new ValidationError("Check the text fields and their length.");
  return v.trim();
};
const choice = <T extends string>(value: unknown, values: readonly T[]): T => {
  if (!values.includes(value as T))
    throw new ValidationError("Choose a supported option.");
  return value as T;
};
const number = (value: unknown, min: number, max: number, integer = false) => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    throw new ValidationError("Enter a valid quantity or placement.");
  return value;
};
const color = (v: unknown) => {
  const c = string(v, 7, 7);
  if (!/^#[0-9a-f]{6}$/i.test(c))
    throw new ValidationError("Choose a valid color.");
  return c;
};
export function validateDesign(value: unknown): DesignSnapshot {
  const d = record(value);
  let document: StudioDocument | undefined;
  try {
    document =
      d.document === undefined ? undefined : validateStudioDocument(d.document);
  } catch {
    throw new ValidationError("Check the layered studio document.");
  }
  let brief: DesignBrief | undefined;
  try {
    brief = d.brief === undefined ? undefined : validateDesignBrief(d.brief);
  } catch {
    throw new ValidationError(
      "Check the design brief; each answer must be under 500 characters.",
    );
  }
  const artworkData =
    d.artworkData === undefined
      ? undefined
      : string(d.artworkData, MAX_PREVIEW_BYTES);
  if (
    artworkData &&
    !/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(artworkData)
  )
    throw new ValidationError("Use a PNG, JPEG, or WebP preview.");
  return {
    ...(document ? { document } : {}),
    ...(brief === undefined ? {} : { brief }),
    id: string(d.id, 100, 1),
    name: string(d.name, 120, 1),
    garment: choice(d.garment, ["tee", "hoodie", "polo"]),
    color: color(d.color),
    view: choice(d.view, ["front", "back"]),
    decoration: choice(d.decoration, ["embroidery", "graphic"]),
    text: string(d.text, 36),
    textColor: color(d.textColor),
    artworkData,
    placement: choice(d.placement, [
      "left-chest",
      "center-front",
      "full-front",
      "center-back",
    ]),
    x: number(d.x, 24, 76),
    y: number(d.y, 25, 70),
    scale: number(d.scale, 45, 160),
    size: string(d.size, 30, 1),
    quantity: number(d.quantity, 1, 10000, true),
  };
}
export function validateRequest(value: unknown): QuoteRequest {
  const body = record(value);
  const i = record(body.intake);
  if (body.consent !== true)
    throw new ValidationError(
      "Confirm that BEE may review and contact you about this request.",
    );
  const requestId = string(body.requestId, 36, 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    throw new ValidationError("Start a new request and try again.");
  const email = string(i.email, 254, 3).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new ValidationError("Enter a valid email address.");
  const deadline = string(i.deadline, 10);
  if (
    deadline &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
      !Number.isFinite(Date.parse(deadline)) ||
      new Date(deadline).toISOString().slice(0, 10) !== deadline)
  )
    throw new ValidationError("Enter a valid date.");
  const intake: RequestDetails = {
    type: choice(i.type, ["custom", "bulk", "creator", "unsure"]),
    name: string(i.name, 120, 1),
    email,
    phone: string(i.phone, 40),
    organization: string(i.organization, 160),
    garment: string(i.garment, 200),
    quantity: string(i.quantity, 80),
    artwork: string(i.artwork, 100),
    deadline,
    fulfillment: string(i.fulfillment, 100),
    personalization: string(i.personalization, 500),
    notes: string(i.notes, 4000),
  };
  if (i.sizePlan !== undefined) {
    try {
      intake.sizePlan = validateSizePlan(i.sizePlan);
    } catch (error) {
      throw new ValidationError((error as Error).message);
    }
  }
  if (!Array.isArray(body.items) || body.items.length > 20)
    throw new ValidationError("A request can include up to 20 designs.");
  const items = body.items.map((raw): RequestItem => {
    const item = record(raw);
    return {
      id: string(item.id, 100, 1),
      draftId:
        item.draftId === undefined ? undefined : string(item.draftId, 100, 1),
      productSlug: string(item.productSlug, 100, 1),
      color: string(item.color, 40, 1),
      size: string(item.size, 30, 1),
      quantity: number(item.quantity, 1, 10000, true),
      decoration: string(item.decoration, 250, 1),
      design:
        item.design === undefined ? undefined : validateDesign(item.design),
    };
  });
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new ValidationError("Remove duplicate project items.");
  return {
    requestId,
    intake,
    items,
    consent: true,
    website: string(body.website, 200),
  };
}
