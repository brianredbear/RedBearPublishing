import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { webpSrc } from "./image-src.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = new Date().toISOString().slice(0, 10);
const SITE = "https://redbearpublishing.com";
const { posts, INDEXABLE_PATHS } = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href
);

const imageByPath = {
  "/": `${SITE}${webpSrc("Softwire_-Betrayal-on-Orbis-2-web.jpg", 800)}`,
  "/comics/": `${SITE}${webpSrc("Spectrum-Logo-web.png", 900)}`,
  "/category/actionopolis/": `${SITE}${webpSrc("redbear-books_0007_Evolver-Exceleraation.jpg", 563)}`,
};

for (const post of posts) {
  imageByPath[`/${post.slug}/`] = `${SITE}${webpSrc(post.image, post.width)}`;
}

const urls = INDEXABLE_PATHS.map((route) => {
  const loc = route === "/" ? `${SITE}/` : `${SITE}${route}`;
  const image = imageByPath[route];
  const imageXml = image
    ? `
    <image:image>
      <image:loc>${image}</image:loc>
    </image:image>`
    : "";
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>${imageXml}
  </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;

await writeFile(path.join(root, "dist/sitemap.xml"), xml);
await writeFile(path.join(root, "public/sitemap.xml"), xml);
console.log(`sitemap wrote ${INDEXABLE_PATHS.length} urls`);
