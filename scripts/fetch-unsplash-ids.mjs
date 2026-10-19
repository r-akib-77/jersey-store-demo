/**
 * Discovers Unsplash photo ids for a list of search terms by reading
 * archived copies of the Unsplash search pages (the live site blocks bots).
 */
import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = path.join(ROOT, ".cache");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const QUERIES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "real-madrid-jersey",
      "barcelona-jersey",
      "liverpool-jersey",
      "ac-milan-jersey",
      "football-shirt",
      "soccer-kit",
      "retro-football-shirt",
      "sportswear-clothing",
      "football-player-kit",
      "sportswear-flat-lay",
    ];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, attempts = 4) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 429) {
        await sleep(6000 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      return await res.text();
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error("unreachable");
}

async function snapshotFor(query) {
  const cdx = `https://web.archive.org/cdx/search/cdx?url=unsplash.com/s/photos/${query}&output=json&limit=40&from=2020`;
  const body = await fetchWithRetry(cdx);
  const rows = JSON.parse(body);
  if (!Array.isArray(rows) || rows.length < 2) return null;
  const usable = rows
    .slice(1)
    .filter((row) => row[3] === "text/html" && row[4] === "200")
    .sort((a, b) => (a[1] < b[1] ? 1 : -1));
  return usable[0] ? { ts: usable[0][1], url: usable[0][2] } : null;
}

async function idsFor(query) {
  const snap = await snapshotFor(query);
  if (!snap) {
    console.log(`no snapshot: ${query}`);
    return [];
  }
  const archiveUrl = `https://web.archive.org/web/${snap.ts}id_/${snap.url}`;
  const html = await fetchWithRetry(archiveUrl);
  const ids = [
    ...new Set(
      [...html.matchAll(/images\.unsplash\.com\/(photo-[0-9a-zA-Z\-]+)/g)].map((m) => m[1]),
    ),
  ];
  console.log(`${query}: ${ids.length} ids`);
  return ids;
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const all = new Set();
  for (const query of QUERIES) {
    try {
      const ids = await idsFor(query);
      ids.forEach((id) => all.add(id));
    } catch (error) {
      console.log(`failed ${query}: ${error.message}`);
    }
    await sleep(4000);
  }
  const file = path.join(CACHE, "unsplash-ids.json");
  const previous = await readFile(file, "utf8").then(JSON.parse).catch(() => []);
  const merged = [...new Set([...previous, ...all])];
  await writeFile(file, JSON.stringify(merged, null, 2), "utf8");
  console.log(`total unique ids: ${merged.length}`);
}

main();
