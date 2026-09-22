import { mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "reference", "images");
const fontSrc = path.join(root, "reference", "fonts");
const outOriginal = path.join(root, "public", "images", "original");
const outImages = path.join(root, "public", "images");
const outFonts = path.join(root, "public", "fonts");
const outIcons = path.join(root, "public");

const WIDTHS = [480, 800, 1200, 1600];

await mkdir(outOriginal, { recursive: true });
await mkdir(outImages, { recursive: true });
await mkdir(outFonts, { recursive: true });

const files = (await readdir(srcDir)).filter((name) =>
  /\.(jpg|jpeg|png)$/i.test(name),
);

for (const file of files) {
  const input = path.join(srcDir, file);
  await copyFile(input, path.join(outOriginal, file));
  const image = sharp(input);
  const meta = await image.metadata();
  const nativeWidth = meta.width ?? 0;
  const stem = file.replace(/\.(jpg|jpeg|png)$/i, "");
  const targets = new Set(
    WIDTHS.filter((width) => width < nativeWidth).concat(nativeWidth),
  );
  for (const width of targets) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outImages, `${stem}-${width}.webp`));
  }
  console.log(`processed ${file} (${nativeWidth}px)`);
}

for (const file of await readdir(fontSrc)) {
  if (file.endsWith(".woff2")) {
    await copyFile(path.join(fontSrc, file), path.join(outFonts, file));
  }
}

const favicons = [
  "cropped-redbear-favicon-copy-32x32.png",
  "cropped-redbear-favicon-copy-180x180.png",
  "cropped-redbear-favicon-copy-192x192.png",
  "cropped-redbear-favicon-copy-270x270.png",
  "cropped-redbear-favicon-copy.png",
];
for (const file of favicons) {
  await copyFile(path.join(srcDir, file), path.join(outIcons, file));
}

console.log("images, fonts, and favicons ready");
