import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAND = path.join(ROOT, ".cache", "unsplash");
const OUT = path.join(ROOT, ".cache");

const ids = JSON.parse(await readFile(path.join(ROOT, ".cache", "unsplash-ids.json"), "utf8"));
const start = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 24);
const slice = ids.slice(start, start + count);

await mkdir(CAND, { recursive: true });

const tiles = [];
let index = 0;
for (const id of slice) {
  index += 1;
  const file = path.join(CAND, `${id}.jpg`);
  const url = `https://images.unsplash.com/${id}?w=800&h=1000&fit=crop&crop=entropy&q=80&fm=jpg`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(file, buf);
    const label = Buffer.from(
      `<svg width="240" height="300"><rect x="0" y="0" width="42" height="30" fill="black" opacity="0.75"/><text x="7" y="22" font-family="Arial" font-size="19" font-weight="bold" fill="white">${start + index}</text></svg>`,
    );
    const tile = await sharp(buf)
      .resize(240, 300)
      .composite([{ input: label, top: 0, left: 0, gravity: "northwest" }])
      .png()
      .toBuffer();
    tiles.push({ input: tile, left: (index - 1) % 8 * 240, top: Math.floor((index - 1) / 8) * 300 });
  } catch (error) {
    console.log(`skip ${start + index}: ${error.message}`);
  }
}

const rows = Math.ceil(tiles.length / 8);
await sharp({
  create: { width: 8 * 240, height: Math.max(1, rows) * 300, channels: 3, background: { r: 255, g: 255, b: 255 } },
})
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, `sheet-${start}.jpg`));

console.log(`sheet-${start}.jpg with ${tiles.length} tiles (ids ${start}..${start + count - 1})`);
