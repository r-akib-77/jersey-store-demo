/** Minimal static file server for the exported site (used for local QA). */
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "out");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((request, response) => {
    const url = decodeURIComponent((request.url ?? "/").split("?")[0]);
    let filePath = path.join(ROOT, url);

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (!existsSync(filePath) && existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }
    if (!existsSync(filePath)) {
      const notFound = path.join(ROOT, "404.html");
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      if (existsSync(notFound)) createReadStream(notFound).pipe(response);
      else response.end("Not found");
      return;
    }

    const type = TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
    response.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    createReadStream(filePath).pipe(response);
  })
  .listen(PORT, () => console.log(`static server on http://localhost:${PORT}`));
