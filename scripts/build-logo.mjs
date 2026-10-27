/**
 * Brand-logo pipeline — converts a client's raster logo into the storefront logo asset.
 *
 *   node scripts/build-logo.mjs "<path-to-source-logo>" [slug]
 *
 * The source is trimmed to its visible content, square-padded on its own detected
 * background colour, and written to public/images/logo.png (also used as favicon).
 * The untouched original is archived under public/images/brand/<slug>-logo.<ext>.
 */
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "images");
const BRAND_DIR = path.join(OUT, "brand");

const SOURCE = process.argv[2] ?? "C:/Users/rakib/Desktop/logo.jpg";
const SLUG = process.argv[3] ?? "client";
const MAX_SIDE = 640; // output resolution (favicon + tile need ~64px at 2x)
const PAD_FRACTION = 0.07; // breathing room around the mark, as a fraction of the square side

const img = sharp(SOURCE);
const meta = await img.metadata();
const { width, height, channels = 3 } = meta;

const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
const pxAt = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return [data.at(i), data.at(i + 1), data.at(i + 2)];
};

// 1. Detect the background colour from the four corners.
const corners = [
  [2, 2],
  [info.width - 3, 2],
  [2, info.height - 3],
  [info.width - 3, info.height - 3],
].map(([x, y]) => pxAt(x, y));
const bg = [0, 1, 2].map((c) =>
  Math.round(corners.reduce((sum, p) => sum + p[c], 0) / corners.length),
);
const TOLERANCE = 26; // mask threshold vs the background colour

// 2. Find the bounding box of real content (anything far from the background colour).
let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const [r, g, b] = pxAt(x, y);
    if (
      Math.abs(r - bg[0]) > TOLERANCE ||
      Math.abs(g - bg[1]) > TOLERANCE ||
      Math.abs(b - bg[2]) > TOLERANCE
    ) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) throw new Error("No content detected — is the background the whole image?");

// 3. Square-pad the content bbox around its own centre. The square we want covers
//    [centre - side/2, centre + side/2); parts outside the source are padded with bg.
const content = {
  left: minX,
  top: minY,
  width: maxX - minX + 1,
  height: maxY - minY + 1,
};
const side = Math.round(Math.max(content.width, content.height) * (1 + PAD_FRACTION * 2));
const centreX = content.left + content.width / 2;
const centreY = content.top + content.height / 2;
const targetLeft = Math.round(centreX - side / 2);
const targetTop = Math.round(centreY - side / 2);

const extract = {
  left: Math.max(0, targetLeft),
  top: Math.max(0, targetTop),
};
extract.width = Math.min(side, width - extract.left);
extract.height = Math.min(side, height - extract.top);

const bgHex =
  "#" +
  bg
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const square = await sharp(SOURCE)
  .extract(extract)
  .extend({
    background: bgHex,
    // Flat-image assumption: the source background must be uniform for seamless padding.
    top: extract.top - targetTop,
    bottom: targetTop + side - (extract.top + extract.height),
    left: extract.left - targetLeft,
    right: targetLeft + side - (extract.left + extract.width),
  })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(square).resize(MAX_SIDE, MAX_SIDE).png().toFile(path.join(OUT, "logo.png"));

// 4. Archive the untouched original so it is never lost.
await mkdir(BRAND_DIR, { recursive: true });
const ext = path.extname(SOURCE) || ".jpg";
await copyFile(SOURCE, path.join(BRAND_DIR, `${SLUG}-logo${ext}`));

const report = {
  source: SOURCE,
  background: bgHex,
  contentBox: content,
  output: `public/images/logo.png (${MAX_SIDE}x${MAX_SIDE})`,
  archived: `public/images/brand/${SLUG}-logo${ext}`,
};
await writeFile(
  path.join(ROOT, ".cache", "build-logo-report.json"),
  JSON.stringify(report, null, 2),
  "utf8",
).catch(() => {});
console.log("client logo processed:", JSON.stringify(report));
