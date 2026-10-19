import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const files = process.argv.slice(2);

const tiles = [];
for (let i = 0; i < files.length; i += 1) {
  const buf = await sharp(path.join(ROOT, files[i])).resize(300, 375).toBuffer();
  const label = Buffer.from(
    `<svg width="300" height="375"><rect x="0" y="0" width="34" height="26" fill="black" opacity="0.75"/><text x="6" y="19" font-family="Arial" font-size="16" fill="white">${i + 1}</text></svg>`,
  );
  tiles.push({
    input: await sharp(buf).composite([{ input: label, top: 0, left: 0 }]).png().toBuffer(),
    left: (i % 4) * 300,
    top: Math.floor(i / 4) * 375,
  });
}

await sharp({
  create: {
    width: 4 * 300,
    height: Math.ceil(files.length / 4) * 375,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite(tiles)
  .jpeg({ quality: 85 })
  .toFile(path.join(ROOT, ".cache", "photos-sheet.jpg"));

console.log("sheet ready");
