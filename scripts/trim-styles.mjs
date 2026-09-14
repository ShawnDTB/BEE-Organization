// Remove selectors whose component classes no longer exist. Preserve dynamic
// state classes and interpolation prefixes; never remove tag-only selectors.
import postcss from "postcss";
import { readdir, readFile, writeFile } from "node:fs/promises";
async function source(dir) {
  let text = "";
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory() && entry.name !== "styles")
      text += await source(path);
    else if (/\.[tj]sx?$/.test(entry.name))
      text += await readFile(path, "utf8");
  }
  return text;
}
const text = await source("src");
const css = postcss.parse(await readFile("src/styles/site.css", "utf8"));
const used = new Set(text.match(/[A-Za-z][A-Za-z0-9_-]*/g));
const keep = (name) =>
  used.has(name) ||
  name.startsWith("is-") ||
  text.includes(`${name.split("--")[0]}--\${`);
let removed = 0;
css.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && rule.parent.name.endsWith("keyframes"))
    return;
  const selectors = rule.selectors.filter((selector) =>
    [...selector.matchAll(/\.([A-Za-z_-][A-Za-z0-9_-]*)/g)].every((match) =>
      keep(match[1]),
    ),
  );
  if (!selectors.length) {
    rule.remove();
    removed++;
  } else rule.selectors = selectors;
});
css.walkAtRules((rule) => {
  if (rule.nodes?.length === 0) rule.remove();
});
await writeFile("src/styles/site.css", css.toString());
console.log(`Removed ${removed} obsolete selector rules.`);
