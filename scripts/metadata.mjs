import { readFile, writeFile, mkdir } from "node:fs/promises";
const routes = {
  "/": [
    "Custom Apparel & Embroidery",
    "Custom apparel for teams, businesses, creators and communities. Build. Empower. Equip.",
  ],
  "/custom-apparel": [
    "Custom Apparel",
    "Explore custom garments, embroidery and graphic apparel with Works by BEE.",
  ],
  "/bulk-orders": [
    "Group & Business Apparel",
    "Plan school, team, business and event apparel with organized quantities, artwork and project details.",
  ],
  "/schools-organizations": [
    "School & Organization Apparel",
    "Start a coordinated apparel request for your school, team or organization.",
  ],
  "/embroidery": [
    "Custom Embroidery",
    "Explore stitched logos and lettering for polos, caps, layers and branded apparel.",
  ],
  "/graphic-apparel": [
    "Graphic Apparel",
    "Bring colorful artwork, creator designs and personal projects to custom apparel.",
  ],
  "/creator-merch": [
    "Creator Merchandise",
    "Plan a focused merch concept for your audience and community.",
  ],
  "/about": [
    "Build. Empower. Equip.",
    "Get to know the purpose behind Works by BEE custom apparel and embroidery.",
  ],
  "/our-work": [
    "Samples & Work",
    "The developing sample library at Works by BEE.",
  ],
  "/shop": [
    "Future Collections",
    "Explore what is next for Works by BEE merchandise.",
  ],
  "/privacy": [
    "Project Privacy",
    "How Works by BEE handles local drafts and submitted project requests.",
  ],
};
const privateRoutes = [
  "/staff",
  "/group-planner",
  "/studio",
  "/cart",
  "/project-review",
  "/start-order",
  "/account",
  "/group-collector",
  "/checkout",
];
const base = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
for (const [path, [title, description]] of Object.entries(routes)) {
  const canonical = `https://worksbybee.com${path === "/" ? "" : path}`;
  const head = `<title>${escape(title)} | Works by BEE</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)} | Works by BEE"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}">`;
  const html = base
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", `${head}</head>`);
  const directory = path === "/" ? "dist" : `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
for (const path of privateRoutes) {
  await mkdir(`dist${path}`, { recursive: true });
  await writeFile(
    `dist${path}/index.html`,
    base.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow"></head>',
    ),
  );
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
    routes,
  )
    .filter(
      (path) =>
        !["/shop", "/our-work", "/schools-organizations"].includes(path),
    )
    .map(
      (path) =>
        `<url><loc>https://worksbybee.com${path === "/" ? "" : path}</loc></url>`,
    )
    .join("")}</urlset>`,
);
