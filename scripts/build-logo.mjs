/**
 * Generates the generic placeholder brand mark used by the storefront template.
 * A neutral, trademark-free kit silhouette in the brand black with a lime accent.
 * Replace public/images/logo.png with a client's own mark (or point shopConfig.logo
 * at a different file) when rebranding.
 */
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "images");
const BRAND_DIR = path.join(OUT, "brand");
const ORIGINAL_SOURCE = "C:/Users/rakib/Desktop/jerseyHouseLogo.jpg";

const JERSEY_PATH = `M 500 252
C 462 252 434 266 408 284
C 386 296 352 302 322 310
C 262 326 214 358 188 400
C 170 430 174 464 198 488
L 250 552
C 262 568 284 572 298 558
L 322 462
L 332 902
C 333 930 344 948 368 948
L 632 948
C 656 948 667 930 668 902
L 678 462
L 702 558
C 716 572 738 568 750 552
L 802 488
C 826 464 830 430 812 400
C 786 358 738 326 678 310
C 648 302 614 296 592 284
C 566 266 538 252 500 252 Z`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <clipPath id="kit"><path d="${JERSEY_PATH}"/></clipPath>
  </defs>
  <g transform="translate(256 256) scale(0.72) translate(-500 -592)">
    <path d="${JERSEY_PATH}" fill="#080808"/>
    <g clip-path="url(#kit)">
      <path d="M 150 1000 L 520 1000 L 760 100 L 600 100 Z" fill="#A3E635"/>
    </g>
  </g>
</svg>`;

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, "logo.svg"), svg, "utf8");
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(OUT, "logo.png"));

// Keep the original client logo in the repo so it is never lost.
await mkdir(BRAND_DIR, { recursive: true });
if (existsSync(ORIGINAL_SOURCE)) {
  await copyFile(ORIGINAL_SOURCE, path.join(BRAND_DIR, "jersey-house-logo.jpg"));
}

console.log("generic logo: built");
