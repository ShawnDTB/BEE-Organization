import { readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const files = await readdir("dist/assets");
async function measure(pattern) {
  const names = files.filter((name) => pattern.test(name));
  assert(names.length > 0, `Missing bundle: ${pattern}`);
  const sizes = await Promise.all(
    names.map(
      async (name) => gzipSync(await readFile(`dist/assets/${name}`)).length,
    ),
  );
  return sizes.reduce((a, b) => a + b, 0);
}
const entry = await measure(/^index-[\w-]+\.js$/);
const home = await measure(/^HomePageV4-.*\.js$/);
const shop = await measure(/^ShopV2-.*\.js$/);
const content = await measure(/^storefront-.*\.js$/);
const css = await measure(/^index-.*\.css$/);
const homeCSS = await measure(/^HomePageV4-.*\.css$/);
assert(entry + home + content < 85000, "Homepage JS exceeds 85 kB gzip budget");
assert(entry + shop + content < 85000, "Shop JS exceeds 85 kB gzip budget");
assert(css < 20000, "Shared CSS exceeds 20 kB gzip budget");
assert(homeCSS < 4500, "Home editorial CSS exceeds 4.5 kB gzip budget");
let illustrationBytes = 0;
for (const name of (await readdir("dist/storefront")).filter((name) =>
  name.endsWith(".svg"),
))
  illustrationBytes += (await stat(`dist/storefront/${name}`)).size;
assert(
  illustrationBytes < 15000,
  "Storefront illustrations exceed 15 kB total",
);
const heroBytes = (await stat("dist/storefront/apparel-study.webp")).size;
assert(heroBytes < 220000, "Apparel study exceeds 220 kB image budget");
const smallHeroBytes = (await stat("dist/storefront/apparel-study-640.webp"))
  .size;
const mediumHeroBytes = (await stat("dist/storefront/apparel-study-960.webp"))
  .size;
assert(smallHeroBytes < 50000, "Small hero exceeds 50 kB image budget");
assert(mediumHeroBytes < 100000, "Medium hero exceeds 100 kB image budget");
const homeHTML = await readFile("dist/index.html", "utf8");
assert(
  homeHTML.includes('rel="stylesheet" href="/assets/HomePageV4-'),
  "Home stylesheet must be discoverable before its route executes",
);
assert(
  homeHTML.includes('imagesrcset="/storefront/apparel-study-640.webp 640w'),
);
assert(
  homeHTML.includes(
    'rel="modulepreload" crossorigin href="/assets/HomePageV4-',
  ),
);
const html = await readFile("dist/shop/index.html", "utf8");
assert(html.includes('rel="modulepreload" crossorigin href="/assets/ShopV2-'));
assert(!html.includes('as="image"'), "Home hero must not preload on Shop");
assert(
  !html.includes('href="/assets/HomePageV4-'),
  "Home editorial assets must stay off Shop",
);
const plannerHTML = await readFile("dist/start-order/index.html", "utf8");
assert(
  plannerHTML.includes(
    'rel="modulepreload" crossorigin href="/assets/StartOrderPage-',
  ),
);
assert(
  !homeHTML.includes("index.min-"),
  "Fabric must not be preloaded on Home",
);
assert(html.includes("Shop Custom Apparel &amp; More"));
assert(
  !(
    await readFile(
      `dist/assets/${files.find((name) => /^index-.*\.css$/.test(name))}`,
      "utf8",
    )
  ).includes("fonts.googleapis.com"),
);
assert(!html.includes("index.min-"), "Fabric must not be eagerly preloaded");
console.log(
  JSON.stringify(
    {
      gzipBytes: {
        homepageJS: entry + home + content,
        shopJS: entry + shop + content,
        sharedCSS: css,
        homeEditorialCSS: homeCSS,
      },
      illustrationBytes,
      heroBytes,
      responsiveHeroBytes: { small: smallHeroBytes, medium: mediumHeroBytes },
      externalFonts: 0,
    },
    null,
    2,
  ),
);
