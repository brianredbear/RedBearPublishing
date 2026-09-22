import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const referenceDir = path.join(root, "reference", "images");
const fallbackDir = path.join(root, "public", "images", "original");
const outImages = path.join(root, "public", "images");
const outFonts = path.join(root, "public", "fonts");
const fontSrc = path.join(root, "reference", "fonts");
const outIcons = path.join(root, "public");

const PHOTO_WIDTHS = [320, 480, 800, 1200, 1600];
const GRAPHIC_WIDTHS = [320, 480, 800, 1120, 1600];

const FAVICONS = [
  "cropped-redbear-favicon-copy-32x32.png",
  "cropped-redbear-favicon-copy-180x180.png",
  "cropped-redbear-favicon-copy-192x192.png",
  "cropped-redbear-favicon-copy-270x270.png",
  "cropped-redbear-favicon-copy.png",
];

const GRAPHICS = new Set([
  "Combined-Shape-Copy-2@2x.png",
  "Spectrum-Logo-web.png",
  "action_logo_final_full_color.png",
  "amazon-kindle-2.png",
  "redbear.-logo-red-loutline.png",
  "redbear.-logo-whiteloutline.png",
]);

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const srcDir = (await exists(referenceDir)) ? referenceDir : fallbackDir;
if (!(await exists(srcDir))) {
  throw new Error("No image source found in reference/images or public/images/original");
}

await mkdir(outImages, { recursive: true });

for (const entry of await readdir(outImages, { withFileTypes: true })) {
  if (entry.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
    await rm(path.join(outImages, entry.name));
  }
}

if (await exists(path.join(outImages, "original"))) {
  await rm(path.join(outImages, "original"), { recursive: true, force: true });
}

const files = (await readdir(srcDir)).filter(
  (name) => /\.(jpg|jpeg|png)$/i.test(name) && !FAVICONS.includes(name),
);

let bytesIn = 0;
let bytesOut = 0;

for (const file of files) {
  const input = path.join(srcDir, file);
  bytesIn += (await stat(input)).size;

  const meta = await sharp(input).metadata();
  const nativeWidth = meta.width ?? 0;
  const stem = file.replace(/\.(jpg|jpeg|png)$/i, "");
  const isGraphic = GRAPHICS.has(file);
  const targets = new Set(
    (isGraphic ? GRAPHIC_WIDTHS : PHOTO_WIDTHS)
      .filter((width) => width < nativeWidth)
      .concat(nativeWidth),
  );

  for (const width of targets) {
    const output = path.join(outImages, `${stem}-${width}.webp`);
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
    if (isGraphic) {
      await pipeline
        .webp({ quality: 88, alphaQuality: 90, effort: 6, smartSubsample: true })
        .toFile(output);
    } else {
      await pipeline
        .webp({ quality: 72, effort: 6, smartSubsample: true, preset: "photo" })
        .toFile(output);
    }
    bytesOut += (await stat(output)).size;
  }

  console.log(`webp ${file} (${nativeWidth}px, ${[...targets].join("/")})`);
}

if (await exists(fontSrc)) {
  await mkdir(outFonts, { recursive: true });
  for (const file of await readdir(fontSrc)) {
    if (file.endsWith(".woff2")) {
      await copyFile(path.join(fontSrc, file), path.join(outFonts, file));
    }
  }
}

for (const file of FAVICONS) {
  const input = path.join(srcDir, file);
  if (await exists(input)) {
    await copyFile(input, path.join(outIcons, file));
  }
}

console.log(
  `images ready: ${(bytesIn / 1024 / 1024).toFixed(2)}MB originals → ${(bytesOut / 1024 / 1024).toFixed(2)}MB webp`,
);
