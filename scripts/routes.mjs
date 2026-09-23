import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const postsFile = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/content/posts.ts"),
  "utf8",
);

export const TITLE_SLUGS = [...postsFile.matchAll(/^\s+slug:\s+"([^"]+)"/gm)].map((match) => match[1]);

export const INDEXABLE_PATHS = [
  "/",
  "/comics/",
  "/category/actionopolis/",
  ...TITLE_SLUGS.map((slug) => `/${slug}/`),
];
