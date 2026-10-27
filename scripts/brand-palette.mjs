/** Sample brand colors from the client logo (script/brand-palette.mjs — reusable for future clients). */
import sharp from "sharp";

const SRC = process.argv[2] ?? "C:/Users/rakib/Desktop/logo.jpg";

const img = sharp(SRC);
const { width, height } = await img.metadata();
const raw = await img.clone().raw().toBuffer();
const px = (x, y) => {
  const i = (y * width + x) * 3;
  return [raw.at(i), raw.at(i + 1), raw.at(i + 2)];
};
const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

const samples = {
  bg_corner: [60, 60],
  bg_center_left: [200, 700],
  da_letter: [300, 310],
  da_letter2: [560, 300],
  toto_blue: [340, 490],
  toto_blue2: [520, 490],
  sports_white: [300, 570],
  stripe: [620, 628],
};

const out = { width, height };
for (const [key, [x, y]] of Object.entries(samples)) {
  const [r, g, b] = px(x, y);
  out[key] = { hex: hex(r, g, b), rgb: [r, g, b] };
}

// average the blue letters over a small grid for a stable value
const blues = [];
for (let x = 300; x <= 700; x += 20) {
  for (let y = 440; y <= 520; y += 10) {
    const [r, g, b] = px(x, y);
    if (b > 150 && b > r + 40) blues.push([r, g, b]);
  }
}
const avg = (arr) => arr[0].map((_, c) => Math.round(arr.reduce((s, p) => s + p[c], 0) / arr.length));
if (blues.length) out.blue_avg = { hex: hex(...avg(blues)), n: blues.length };

// average the background over corners
const bgs = [];
for (let x = 20; x <= 200; x += 30) for (let y = 20; y <= 200; y += 30) bgs.push(px(x, y));
out.bg_avg = { hex: hex(...avg(bgs)), n: bgs.length };

console.log(JSON.stringify(out, null, 2));
