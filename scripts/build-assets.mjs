/**
 * Jersey House — asset build script (development utility).
 *
 * Generates the storefront imagery:
 *   1. Product renders  -> public/images/products/*.png  (studio style, 4:5)
 *   2. Brand logo       -> public/images/logo.png        (trimmed, transparent, black)
 *   3. Shop photos      -> public/images/photos/*.jpg     (consistent crop + grade)
 *
 * Run with: npm run assets:build
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_PRODUCTS = path.join(ROOT, "public", "images", "products");
const OUT_PHOTOS = path.join(ROOT, "public", "images", "photos");
const OUT_BRAND = path.join(ROOT, "public", "images");
const SOURCE_PHOTOS = "C:/Users/rakib/Desktop";
const SOURCE_LOGO = path.join(SOURCE_PHOTOS, "jerseyHouseLogo.jpg");

const W = 1000;
const H = 1250;

/* ------------------------------------------------------------------ */
/* Jersey render engine                                                */
/* ------------------------------------------------------------------ */

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

const CREW_NECK = "M 448 282 C 448 238 552 238 552 282 C 552 314 448 314 448 282 Z";
const V_NECK = "M 442 276 C 458 246 542 246 558 276 L 500 352 Z";

const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * @param {object} spec
 * @returns {string} svg markup
 */
function jerseySvg(spec) {
  const {
    base,
    accent = base,
    trim,
    pattern = "solid",
    collar = "crew",
    sponsor = "FLIGHT",
    sponsorColor = "#ffffff",
    sponsorSize = 50,
    sponsorSub = "",
    crest = "shield",
    crestColor = "#111111",
    crestText = "JH",
    crestTextColor = "#ffffff",
    stars = 0,
    mark = "#111111",
    year = "",
    folds = true,
  } = spec;

  const uid = Math.random().toString(36).slice(2, 9);

  const patternLayer = () => {
    switch (pattern) {
      case "stripes": {
        const w = spec.patternWidth ?? 46;
        const gap = spec.patternGap ?? 92;
        const color = spec.patternColor ?? accent;
        let out = "";
        for (let x = 186; x < 812; x += gap) {
          out += `<rect x="${x}" y="240" width="${w}" height="720" fill="${color}" opacity="0.95"/>`;
        }
        return out;
      }
      case "wide-stripes": {
        const w = spec.patternWidth ?? 78;
        const gap = spec.patternGap ?? 156;
        const color = spec.patternColor ?? accent;
        let out = "";
        for (let x = 176; x < 820; x += gap) {
          out += `<rect x="${x}" y="240" width="${w}" height="720" fill="${color}" opacity="0.96"/>`;
        }
        return out;
      }
      case "hoops": {
        const h = spec.patternHeight ?? 58;
        const gap = spec.patternGap ?? 116;
        const color = spec.patternColor ?? accent;
        let out = "";
        for (let y = 320; y < 950; y += gap) {
          out += `<rect x="180" y="${y}" width="640" height="${h}" fill="${color}" opacity="0.95"/>`;
        }
        return out;
      }
      case "chestband": {
        const color = spec.patternColor ?? accent;
        const inner = spec.patternInner;
        return `<rect x="180" y="352" width="640" height="78" fill="${color}" opacity="0.95"/>
          ${inner ? `<rect x="180" y="372" width="640" height="38" fill="${inner}" opacity="0.95"/>` : ""}`;
      }
      case "sash": {
        const color = spec.patternColor ?? accent;
        return `<path d="M 190 980 L 545 240 L 675 240 L 320 980 Z" fill="${color}" opacity="0.95"/>`;
      }
      case "hem": {
        const color = spec.patternColor ?? accent;
        return `<path d="M 320 760 L 680 760 L 668 948 L 332 948 Z" fill="${color}" opacity="0.95"/>`;
      }
      case "gradient": {
        return `<rect x="180" y="240" width="640" height="720" fill="url(#grad-${uid})" opacity="0.95"/>`;
      }
      case "diagonal": {
        const color = spec.patternColor ?? accent;
        return `<path d="M 180 690 L 820 430 L 820 700 L 180 960 Z" fill="${color}" opacity="0.85"/>`;
      }
      default:
        return "";
    }
  };

  const neckPath = collar === "v" ? V_NECK : CREW_NECK;

  const crestLayer = () => {
    const g = [];
    if (stars > 0) {
      const sx = 600 - ((stars - 1) * 11) / 2;
      for (let i = 0; i < stars; i += 1) {
        g.push(
          `<path d="M ${sx + i * 11} 322 l 2.2 4.6 5 .7 -3.6 3.5 .9 5 -4.5 -2.4 -4.5 2.4 .9 -5 -3.6 -3.5 5 -.7 Z" fill="${spec.crestStarColor ?? "#F5D442"}"/>`,
        );
      }
    }
    if (crest === "shield") {
      g.push(
        `<g transform="translate(580 336)">
          <path d="M 0 0 L 44 0 L 44 32 Q 44 58 22 70 Q 0 58 0 32 Z" fill="${crestColor}" stroke="rgba(255,255,255,0.75)" stroke-width="3"/>
          <path d="M 0 0 L 44 0 L 44 15 L 0 15 Z" fill="rgba(255,255,255,0.22)"/>
          <text x="22" y="48" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" letter-spacing="0.5" fill="${crestTextColor}">${esc(
            crestText,
          )}</text>
        </g>`,
      );
    } else if (crest === "circle") {
      g.push(
        `<g transform="translate(580 336)">
          <circle cx="22" cy="35" r="35" fill="${crestColor}" stroke="rgba(255,255,255,0.8)" stroke-width="3"/>
          <circle cx="22" cy="35" r="26" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
          <text x="22" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="bold" letter-spacing="0.5" fill="${crestTextColor}">${esc(
            crestText,
          )}</text>
        </g>`,
      );
    } else if (crest === "diamond") {
      g.push(
        `<g transform="translate(581 338)">
          <path d="M 22 0 L 44 32 L 22 64 L 0 32 Z" fill="${crestColor}" stroke="rgba(255,255,255,0.8)" stroke-width="3"/>
          <text x="22" y="40" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="${crestTextColor}">${esc(
            crestText,
          )}</text>
        </g>`,
      );
    }
    return g.join("");
  };

  const markLayer = () =>
    `<g transform="translate(394 336)" fill="${mark}">
      <path d="M 0 26 L 10 0 L 20 0 L 10 26 Z"/>
      <path d="M 13 26 L 23 0 L 33 0 L 23 26 Z" opacity="0.85"/>
      <path d="M 26 26 L 36 0 L 46 0 L 36 26 Z" opacity="0.7"/>
    </g>`;

  const sponsorLayer = () => {
    const sub = sponsorSub
      ? `<text x="500" y="516" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" letter-spacing="6" fill="${sponsorColor}" opacity="0.85">${esc(
          sponsorSub,
        )}</text>`
      : "";
    return `<text x="500" y="478" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${sponsorSize}" font-weight="bold" letter-spacing="3" fill="${sponsorColor}">${esc(
      sponsor,
    )}</text>${sub}`;
  };

  const yearLayer = year
    ? `<text x="500" y="922" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" letter-spacing="8" fill="${trim}" opacity="0.45">${esc(
        year,
      )}</text>`
    : "";

  const zipDetail =
    collar === "zip"
      ? `<rect x="490" y="248" width="22" height="80" rx="6" fill="${trim}" opacity="0.95"/><rect x="496" y="262" width="9" height="52" rx="4" fill="#ffffff" opacity="0.35"/>`
      : "";

  const foldLayer = folds
    ? `<g filter="url(#soft-${uid})" opacity="0.55">
        <path d="M 356 320 C 346 540 350 760 358 940 L 384 940 C 376 760 372 540 380 320 Z" fill="#000000" opacity="0.10"/>
        <path d="M 500 320 C 496 540 498 760 500 940 L 520 940 C 518 760 518 540 524 320 Z" fill="#000000" opacity="0.07"/>
        <path d="M 620 320 C 628 540 632 760 624 940 L 650 940 C 658 760 654 540 646 320 Z" fill="#000000" opacity="0.09"/>
       </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg-${uid}" cx="50%" cy="40%" r="76%">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#f2f2f2"/>
      <stop offset="1" stop-color="#e0e0e0"/>
    </radialGradient>
    <radialGradient id="vig-${uid}" cx="50%" cy="44%" r="70%">
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.18"/>
    </radialGradient>
    <linearGradient id="sheen-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.26"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.14"/>
    </linearGradient>
    <linearGradient id="grad-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${spec.gradientFrom ?? base}"/>
      <stop offset="1" stop-color="${spec.gradientTo ?? accent}"/>
    </linearGradient>
    <radialGradient id="neck-${uid}" cx="50%" cy="30%" r="80%">
      <stop offset="0" stop-color="#2b2b2b"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </radialGradient>
    <filter id="shadow-${uid}" x="-40%" y="-200%" width="180%" height="500%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
    <filter id="drop-${uid}" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="soft-${uid}" x="-40%" y="-20%" width="180%" height="140%">
      <feGaussianBlur stdDeviation="15"/>
    </filter>
    <filter id="grain-${uid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="11" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="g"/>
      <feComponentTransfer in="g"><feFuncA type="linear" slope="0.13"/></feComponentTransfer>
    </filter>
    <clipPath id="clip-${uid}"><path d="${JERSEY_PATH}"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg-${uid})"/>

  <ellipse cx="500" cy="972" rx="222" ry="28" fill="#2a2a2a" opacity="0.32" filter="url(#shadow-${uid})"/>

  <g>
    <path d="${JERSEY_PATH}" fill="#000000" opacity="0.30" filter="url(#drop-${uid})" transform="translate(6 16)"/>
    <path d="${JERSEY_PATH}" fill="${base}"/>
    <g clip-path="url(#clip-${uid})">
      ${patternLayer()}
      ${foldLayer}
      <rect x="180" y="240" width="640" height="720" fill="url(#sheen-${uid})"/>
      <rect x="180" y="240" width="640" height="720" filter="url(#grain-${uid})" opacity="0.5" style="mix-blend-mode:multiply"/>
      <path d="M 322 462 L 334 948 L 364 948 L 350 462 Z" fill="#000000" opacity="0.08"/>
      <path d="M 678 462 L 666 948 L 636 948 L 650 462 Z" fill="#000000" opacity="0.08"/>
      <path d="M 408 284 C 386 296 352 302 322 310 L 322 330 C 354 322 388 316 412 304 Z" fill="#000000" opacity="0.06"/>
      <path d="M 592 284 C 614 296 648 302 678 310 L 678 330 C 646 322 612 316 588 304 Z" fill="#000000" opacity="0.06"/>
    </g>
    <path d="${JERSEY_PATH}" fill="none" stroke="#000000" stroke-opacity="0.18" stroke-width="2.5"/>

    <g clip-path="url(#clip-${uid})">
      <line x1="202" y1="490" x2="300" y2="556" stroke="${trim}" stroke-width="24" opacity="0.95"/>
      <line x1="798" y1="490" x2="700" y2="556" stroke="${trim}" stroke-width="24" opacity="0.95"/>
    </g>

    <path d="${neckPath}" fill="url(#neck-${uid})"/>
    <path d="${neckPath}" fill="none" stroke="${trim}" stroke-width="22"/>
    <path d="${neckPath}" fill="none" stroke="#ffffff" stroke-opacity="0.30" stroke-width="2.5" transform="translate(0 3)"/>
    ${zipDetail}

    ${markLayer()}
    ${crestLayer()}
    ${sponsorLayer()}
    ${yearLayer}
  </g>

  <rect width="${W}" height="${H}" fill="url(#vig-${uid})"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Product render specs                                                */
/* ------------------------------------------------------------------ */

const WHITE = "#ffffff";

const PRODUCTS = {
  "ac-milan-retro": {
    base: "#FB090B",
    accent: "#101010",
    pattern: "stripes",
    patternColor: "#101010",
    patternWidth: 44,
    patternGap: 88,
    trim: WHITE,
    collar: "crew",
    sponsor: "VECTOR",
    sponsorColor: WHITE,
    crest: "shield",
    crestColor: "#101010",
    crestText: "ACM",
    mark: "#ffffff",
    year: "1999",
  },
  "chelsea-home": {
    base: "#034694",
    accent: WHITE,
    pattern: "solid",
    trim: WHITE,
    collar: "crew",
    sponsor: "VECTOR",
    sponsorColor: WHITE,
    crest: "circle",
    crestColor: "#034694",
    crestText: "CFC",
    mark: "#ffffff",
  },
  "germany-home": {
    base: WHITE,
    accent: "#111111",
    pattern: "chestband",
    patternColor: "#111111",
    patternInner: "#DD0000",
    trim: "#111111",
    collar: "crew",
    sponsor: "PULSE",
    sponsorColor: "#111111",
    crest: "shield",
    crestColor: "#F0C75E",
    crestText: "DFB",
    crestTextColor: "#111111",
    mark: "#111111",
  },
  "france-home": {
    base: "#002395",
    accent: WHITE,
    trim: WHITE,
    collar: "v",
    sponsor: "PULSE",
    sponsorColor: WHITE,
    crest: "shield",
    crestColor: "#002395",
    crestText: "FFF",
    mark: "#ffffff",
  },
  "bayern-home": {
    base: "#DC052D",
    accent: WHITE,
    pattern: "diagonal",
    patternColor: "#ffffff",
    trim: WHITE,
    collar: "crew",
    sponsor: "FLIGHT",
    sponsorColor: WHITE,
    crest: "circle",
    crestColor: "#DC052D",
    crestText: "FCB",
    mark: "#ffffff",
  },
  "pro-training-top": {
    base: "#1D1B4B",
    accent: "#A3E635",
    pattern: "gradient",
    gradientFrom: "#262363",
    gradientTo: "#12102F",
    trim: "#A3E635",
    collar: "zip",
    sponsor: "KICK",
    sponsorSub: "TRAINING",
    sponsorColor: "#A3E635",
    sponsorSize: 44,
    crest: "diamond",
    crestColor: "#A3E635",
    crestText: "JH",
    crestTextColor: "#12102F",
    mark: "#A3E635",
  },
};

/* ------------------------------------------------------------------ */
/* Build steps                                                         */
/* ------------------------------------------------------------------ */

async function buildProductRenders() {
  await mkdir(OUT_PRODUCTS, { recursive: true });
  for (const [slug, spec] of Object.entries(PRODUCTS)) {
    const svg = jerseySvg(spec);
    await writeFile(path.join(OUT_PRODUCTS, `${slug}.svg`), svg, "utf8");
    await sharp(Buffer.from(svg)).resize(W, H).png({ compressionLevel: 9 }).toFile(
      path.join(OUT_PRODUCTS, `${slug}.png`),
    );
    process.stdout.write(`render: ${slug}\n`);
  }
}

async function buildLogo() {
  if (!existsSync(SOURCE_LOGO)) {
    process.stdout.write("logo: source not found, skipped\n");
    return;
  }
  const trimmed = await sharp(SOURCE_LOGO)
    .trim({ threshold: 24 })
    .resize({ width: 512, height: 512, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = trimmed;
  const black = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 236) {
      black[i] = 0;
      black[i + 1] = 0;
      black[i + 2] = 0;
      black[i + 3] = 0;
    } else {
      const alpha = Math.min(255, Math.round(255 * (1 - lum / 236) ** 0.85));
      black[i] = r;
      black[i + 1] = g;
      black[i + 2] = b;
      black[i + 3] = alpha;
    }
  }
  const raw = { width: info.width, height: info.height, channels: 4 };
  await sharp(black, { raw }).png().toFile(path.join(OUT_BRAND, "logo.png"));
  process.stdout.write("logo: built\n");
}

const PHOTO_RECIPES = [
  { src: "jersey 3.jpg", out: "barcelona.jpg", width: 1000, height: 1250 },
  { src: "jersey4.jpg", out: "liverpool.jpg", width: 1000, height: 1250 },
  { src: "jersey 1.jpg", out: "argentina.jpg", width: 1000, height: 1250 },
  { src: "jersey2.jpg", out: "juventus.jpg", width: 1000, height: 1250 },
  { src: "jersey4.jpg", out: "hero.jpg", width: 1920, height: 1200 },
];

/** Editorial + product photography sourced from Unsplash (free to use). */
const UNSPLASH_RECIPES = [
  { id: "photo-1635710064268-69aa5d9355c1", out: "products/real-madrid-home.jpg" },
  { id: "photo-1649771543037-916e2702008a", out: "products/man-utd-home.jpg" },
  { id: "photo-1552066379-e7bfd22155c5", out: "products/brazil-home.jpg" },
  { id: "photo-1577212017308-55c4d60d2609", out: "products/classic-retro.jpg" },
  { id: "photo-1551854321-1432edd90a5c", out: "products/spain-home.jpg" },
  { id: "photo-1551854386-b42759a60dd0", out: "products/mexico-home.jpg" },
  { id: "photo-1683838945242-a4f54753bb7d", out: "photos/promo.jpg" },
  { id: "photo-1616124619460-ff4ed8f4683c", out: "photos/category-club.jpg" },
  { id: "photo-1668791160369-d20b8175eab2", out: "photos/category-national.jpg" },
  { id: "photo-1689624291789-7b402a15915a", out: "photos/category-retro.jpg" },
];

async function buildUnsplash() {
  for (const recipe of UNSPLASH_RECIPES) {
    const target = path.join(OUT_BRAND, recipe.out);
    await mkdir(path.dirname(target), { recursive: true });
    const url = `https://images.unsplash.com/${recipe.id}?w=1000&h=1250&fit=crop&crop=center&q=82&fm=jpg`;
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await sharp(buffer)
        .resize(1000, 1250, { fit: "cover", position: sharp.strategy.attention })
        .modulate({ brightness: 1.03, saturation: 1.02 })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(target);
      process.stdout.write(`unsplash: ${recipe.out}\n`);
    } catch (error) {
      process.stdout.write(`unsplash failed ${recipe.id}: ${error.message}\n`);
    }
  }
}

async function buildPhotos() {
  await mkdir(OUT_PHOTOS, { recursive: true });
  for (const recipe of PHOTO_RECIPES) {
    const src = path.join(SOURCE_PHOTOS, recipe.src);
    if (!existsSync(src)) {
      process.stdout.write(`photo: ${recipe.src} missing, skipped\n`);
      continue;
    }
    await sharp(src)
      .resize(recipe.width, recipe.height, { fit: "cover", position: "centre" })
      .modulate({ brightness: 1.05, saturation: 1.03 })
      .linear(1.05, -8)
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(OUT_PHOTOS, recipe.out));
    process.stdout.write(`photo: ${recipe.out}\n`);
  }
}

async function main() {
  await buildProductRenders();
  await buildLogo();
  await buildPhotos();
  await buildUnsplash();
  process.stdout.write("assets: done\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
