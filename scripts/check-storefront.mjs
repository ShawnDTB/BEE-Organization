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
assert(entry + home + content < 85000, "Homepage JS exceeds 85 kB gzip budget");
assert(entry + shop + content < 85000, "Shop JS exceeds 85 kB gzip budget");
assert(css < 20000, "Shared CSS exceeds 20 kB gzip budget");
let illustrationBytes = 0;
for (const name of await readdir("dist/storefront"))
  illustrationBytes += (await stat(`dist/storefront/${name}`)).size;
assert(
  illustrationBytes < 15000,
  "Storefront illustrations exceed 15 kB total",
);
const html = await readFile("dist/shop/index.html", "utf8");
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
      },
      illustrationBytes,
      externalFonts: 0,
    },
    null,
    2,
  ),
);
