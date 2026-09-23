import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXACT_REDIRECTS, PREFIX_404, PREFIX_REDIRECTS, UPLOAD_REDIRECTS } from "./legacy-redirects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".map": "application/json",
};

function send(res, status, file, extra = {}) {
  const ext = path.extname(file);
  res.writeHead(status, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    ...extra,
  });
  createReadStream(file).pipe(res);
}

function redirect(res, location) {
  res.writeHead(301, { Location: location });
  res.end();
}

function notFound(res) {
  const file = path.join(dist, "404.html");
  if (existsSync(file)) {
    send(res, 404, file);
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

function canonicalHost(req) {
  const host = (req.headers.host || "").split(":")[0];
  const proto = req.headers["x-forwarded-proto"] || "https";
  if (host === "www.redbearpublishing.com") {
    return { proto: "https", host: "redbearpublishing.com", changed: true };
  }
  if (host === "redbearpublishing.com" && proto === "http") {
    return { proto: "https", host, changed: true };
  }
  return { proto, host, changed: false };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://local");
  let pathname = decodeURIComponent(url.pathname);
  const hostInfo = canonicalHost(req);
  if (hostInfo.changed) {
    redirect(res, `${hostInfo.proto}://${hostInfo.host}${pathname}${url.search}`);
    return;
  }

  if (pathname !== "/" && pathname.endsWith("/index.html")) {
    redirect(res, pathname.replace(/\/index\.html$/, "/") || "/");
    return;
  }

  if (EXACT_REDIRECTS[pathname]) {
    redirect(res, EXACT_REDIRECTS[pathname]);
    return;
  }

  if (pathname.endsWith("/feed") || pathname.endsWith("/feed/")) {
    redirect(res, "/");
    return;
  }

  for (const prefix of PREFIX_404) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix)) {
      notFound(res);
      return;
    }
  }

  for (const rule of PREFIX_REDIRECTS) {
    const excepted = rule.except?.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`) || pathname === `${path}/`,
    );
    if (excepted) {
      continue;
    }
    if (pathname === rule.prefix.slice(0, -1) || pathname.startsWith(rule.prefix)) {
      redirect(res, rule.to);
      return;
    }
  }

  if (pathname.startsWith("/wp-content/uploads/")) {
    const base = path.basename(pathname);
    const mapped = UPLOAD_REDIRECTS[base];
    if (mapped) {
      redirect(res, mapped);
      return;
    }
    notFound(res);
    return;
  }

  const relative = pathname === "/" ? "" : pathname.replace(/^\//, "");
  const asFile = path.join(dist, relative);
  const asIndex = pathname.endsWith("/")
    ? path.join(dist, relative, "index.html")
    : path.join(dist, relative, "index.html");

  if (pathname !== "/" && !pathname.endsWith("/")) {
    if (existsSync(asIndex) && statSync(asIndex).isFile()) {
      redirect(res, `${pathname}/${url.search}`);
      return;
    }
    if (existsSync(asFile) && statSync(asFile).isFile()) {
      send(res, 200, asFile);
      return;
    }
    notFound(res);
    return;
  }

  if (pathname === "/") {
    send(res, 200, path.join(dist, "index.html"));
    return;
  }

  if (existsSync(asIndex) && statSync(asIndex).isFile()) {
    send(res, 200, asIndex);
    return;
  }

  if (existsSync(asFile) && statSync(asFile).isFile()) {
    send(res, 200, asFile);
    return;
  }

  notFound(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`serving ${dist} on ${port}`);
});
