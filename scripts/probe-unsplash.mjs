import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAND = path.join(ROOT, ".cache", "unsplash");
const OUT = path.join(ROOT, ".cache");

const IDS = [
  "photo-1616124619460-ff4ed8f4683c",
  "photo-1577212017184-80cc0da11082",
  "photo-1662096909714-e2f206d0a636",
  "photo-1552066379-e7bfd22155c5",
  "photo-1668791160369-d20b8175eab2",
  "photo-1551854321-1432edd90a5c",
  "photo-1551854386-b42759a60dd0",
  "photo-1551854415-1df5f0d94b99",
  "photo-1551854269-93c58e58b410",
  "photo-1596728602619-d6e7efccad28",
  "photo-1596728602555-9fc339d1e5e3",
  "photo-1596728602615-0f2b2ca4ab93",
  "photo-1552066379-e340103938b9",
  "photo-1627834248396-e0892e56f83e",
  "photo-1728520508268-1766303e1ebb",
  "photo-1577212017308-55c4d60d2609",
  "photo-1676498111080-5b73b7f0122c",
  "photo-1689624291789-7b402a15915a",
  "photo-1671016233693-53162078ca1c",
  "photo-1689624291744-034ee30c8799",
  "photo-1649771543037-916e2702008a",
  "photo-1585925452553-03549ee41dc9",
  "photo-1778222413822-f7a0342cd96f",
  "photo-1780498178879-4064b19e6517",
];

async function main() {
  await mkdir(CAND, { recursive: true });
  const tiles = [];
  let index = 0;
  for (const id of IDS) {
    index += 1;
    const file = path.join(CAND, `${id}.jpg`);
    const url = `https://images.unsplash.com/${id}?w=900&h=1125&fit=crop&crop=entropy&q=80&fm=jpg`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(file, buf);
      const label = Buffer.from(
        `<svg width="300" height="375"><rect x="0" y="0" width="56" height="40" fill="black" opacity="0.72"/><text x="8" y="30" font-family="Arial" font-size="26" font-weight="bold" fill="white">${index}</text></svg>`,
      );
      const tile = await sharp(buf)
        .resize(300, 375)
        .composite([{ input: label, top: 0, left: 0, gravity: "northwest" }])
        .png()
        .toBuffer();
      tiles.push({ input: tile, left: (index - 1) % 6 * 300, top: Math.floor((index - 1) / 6) * 375 });
    } catch (error) {
      console.log(`skip ${index} ${id}: ${error.message}`);
    }
  }
  const rows = Math.ceil(tiles.length / 6);
  await sharp({
    create: { width: 6 * 300, height: rows * 375, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite(tiles)
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, "contact-sheet.jpg"));
  console.log(`tiles: ${tiles.length}`);
}

main();
