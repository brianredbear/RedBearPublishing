import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { chromium } from "playwright";
import { INDEXABLE_PATHS } from "./routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv.includes("--compare") ? "compare" : "baseline";
const outDir = path.join(root, mode === "compare" ? "visual-current" : "visual-baseline");
const widths = [1440, 768, 390];
const port = 4177;
const routes = [...INDEXABLE_PATHS, "/this-page-does-not-exist/"];

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const ping = () => {
      http
        .get(`http://127.0.0.1:${port}/`, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - started > 30000) {
            reject(new Error("preview server did not start"));
            return;
          }
          setTimeout(ping, 250);
        });
    };
    ping();
  });
}

function startPreview() {
  if (existsSync(path.join(root, "dist/spectrum-1/index.html"))) {
    return spawn("node", ["scripts/serve.mjs"], {
      cwd: root,
      stdio: "pipe",
      env: { ...process.env, PORT: String(port) },
    });
  }
  return spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: root, stdio: "pipe" },
  );
}

await mkdir(outDir, { recursive: true });
if (mode === "baseline") {
  await new Promise((resolve, reject) => {
    const build = spawn("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
    build.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("build failed"))));
  });
}

const server = startPreview();
await waitForServer();

const browser = await chromium.launch();
const mismatches = [];

try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    page.on("console", (msg) => {
      if (["error", "warning"].includes(msg.type())) {
        console.log(`[console ${msg.type()}] ${width} ${msg.text()}`);
      }
    });
    for (const route of routes) {
      const slug = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replaceAll("/", "_");
      const file = path.join(outDir, `${slug}-${width}.png`);
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
      await page.addStyleTag({
        content: "*,*::before,*::after{animation:none!important;transition:none!important;}",
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`shot ${route} @${width}`);

      if (mode === "compare") {
        const baselineFile = path.join(root, "visual-baseline", `${slug}-${width}.png`);
        const { readFileSync, existsSync } = await import("node:fs");
        if (!existsSync(baselineFile)) {
          mismatches.push(`missing baseline ${slug}-${width}`);
          continue;
        }
        const imgA = PNG.sync.read(readFileSync(baselineFile));
        const imgB = PNG.sync.read(readFileSync(file));
        if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
          mismatches.push(`${slug}-${width} size ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}`);
          continue;
        }
        const diff = new PNG({ width: imgA.width, height: imgA.height });
        const count = pixelmatch(imgA.data, imgB.data, diff.data, imgA.width, imgA.height, {
          threshold: 0,
        });
        if (count > 0) {
          const diffDir = path.join(root, "visual-diff");
          await mkdir(diffDir, { recursive: true });
          await writeFile(path.join(diffDir, `${slug}-${width}.png`), PNG.sync.write(diff));
          mismatches.push(`${slug}-${width} ${count} pixels`);
        }
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill("SIGTERM");
}

if (mismatches.length) {
  console.error("VISUAL DIFF FAILURES\n" + mismatches.join("\n"));
  process.exit(1);
}
console.log(mode === "compare" ? "visual diff clean" : `baseline written to ${outDir}`);
