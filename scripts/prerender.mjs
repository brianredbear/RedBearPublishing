import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { INDEXABLE_PATHS } from "./routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

function stripRh(value) {
  return String(value).replace(/ data-rh="true"/g, "");
}

function applyHelmet(document, helmet) {
  if (!helmet) {
    return document;
  }
  let next = document
    .replace(/<html[^>]*>/, `<html ${stripRh(helmet.htmlAttributes.toString())}>`)
    .replace(/<title[^>]*>[^<]*<\/title>/, stripRh(helmet.title.toString()) || "<title>Redbear Publishing</title>")
    .replace(/\s*<link rel="icon"[^>]*>/g, "")
    .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, "")
    .replace(/\s*<link rel="describedby"[^>]*>/g, "")
    .replace(/\s*<link rel="ai-catalog"[^>]*>/g, "")
    .replace(/\s*<link rel="ard"[^>]*>/g, "")
    .replace(/\s*<meta name="msapplication-TileImage"[^>]*>/g, "");
  const headBits = [stripRh(helmet.meta.toString()), stripRh(helmet.link.toString()), stripRh(helmet.script.toString())]
    .filter(Boolean)
    .join("\n    ");
  return next.replace("</head>", `    ${headBits}\n  </head>`);
}

const routes = [...INDEXABLE_PATHS, "/this-page-does-not-exist/"];

for (const url of routes) {
  const { html, helmet } = render(url);
  const page = applyHelmet(template, helmet).replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );
  if (url === "/") {
    await writeFile(path.join(dist, "index.html"), page);
    console.log("prerendered /");
    continue;
  }
  if (url === "/this-page-does-not-exist/") {
    await writeFile(path.join(dist, "404.html"), page);
    console.log("prerendered 404.html");
    continue;
  }
  const folder = path.join(dist, url.replace(/^\//, "").replace(/\/$/, ""));
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, "index.html"), page);
  console.log(`prerendered ${url}`);
}

console.log("prerender complete");
