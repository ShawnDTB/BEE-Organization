import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  type StudioLayer,
} from "../../shared/studio";
import { layer } from "./document";

export type GuideCommand = "center" | "larger" | "smaller" | "fit";
export const GUIDE_NAME = "BEE Guide";
export function parseGuideCommand(input: string): GuideCommand | null {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/, "");
  // Deliberately narrow: unsupported compound requests must not partially execute.
  const commands: Record<string, GuideCommand> = {
    center: "center",
    "center the design": "center",
    "center my design": "center",
    "make it larger": "larger",
    "make it bigger": "larger",
    larger: "larger",
    "make it smaller": "smaller",
    smaller: "smaller",
    fit: "fit",
    "fit to board": "fit",
    "fit the design": "fit",
  };
  return commands[normalized] || null;
}
export function transformDesign(
  layers: StudioLayer[],
  command: GuideCommand,
): StudioLayer[] {
  const visible = layers.filter((l) => !l.hidden);
  if (!visible.length) throw Error("Add wording or artwork first.");
  if (visible.some((l) => l.locked))
    throw Error(
      "Some artwork is locked. Unlock it in Advanced before moving the whole design.",
    );
  if (visible.some((l) => l.angle !== 0))
    throw Error(
      "This design has rotated artwork. Use Advanced to adjust it precisely.",
    );
  const left = Math.min(...visible.map((l) => l.x));
  const top = Math.min(...visible.map((l) => l.y));
  const width = Math.max(...visible.map((l) => l.x + l.width)) - left;
  const height = Math.max(...visible.map((l) => l.y + l.height)) - top;
  const maxScale = Math.min(
    (BOARD_WIDTH - 40) / width,
    (BOARD_HEIGHT - 40) / height,
  );
  const scale =
    command === "larger"
      ? Math.min(1.1, maxScale)
      : command === "smaller"
        ? 0.9
        : command === "fit"
          ? Math.min(1, maxScale)
          : 1;
  if (command === "larger" && scale <= 1)
    throw Error(
      "The design is already at the suggested board margin. BEE will confirm the final print area.",
    );
  if (visible.some((l) => l.width * scale < 1 || l.height * scale < 1))
    throw Error("That would make part of the design too small.");
  return layers.map((l) =>
    l.hidden
      ? l
      : {
          ...l,
          x: (BOARD_WIDTH - width * scale) / 2 + (l.x - left) * scale,
          y: (BOARD_HEIGHT - height * scale) / 2 + (l.y - top) * scale,
          width: l.width * scale,
          height: l.height * scale,
        },
  );
}
export const templates = [
  {
    id: "event",
    name: "School & community",
    description: "A bold event title with a supporting line.",
    title: "TOGETHER FOR GOOD",
    detail: "SCHOOL CHARITY EVENT",
  },
  {
    id: "business",
    name: "Business & team",
    description: "A clean name and tagline arrangement.",
    title: "YOUR TEAM",
    detail: "BUILT TOGETHER",
  },
  {
    id: "creator",
    name: "Creator collection",
    description: "A simple statement with a signature line.",
    title: "MAKE YOUR MARK",
    detail: "THE ORIGINAL COLLECTION",
  },
] as const;
export function templateLayers(
  id: string,
  title: string,
  detail: string,
  fill: string,
): StudioLayer[] {
  const t = templates.find((t) => t.id === id) || templates[0];
  return [
    {
      ...layer("text"),
      text: title.trim() || t.title,
      x: 60,
      y: 310,
      width: 480,
      height: 55,
      fill,
      font: id === "business" ? ("Georgia" as const) : ("Arial" as const),
    },
    {
      ...layer("text"),
      text: detail.trim() || t.detail,
      x: 100,
      y: 390,
      width: 400,
      height: 25,
      fill,
    },
  ];
}
