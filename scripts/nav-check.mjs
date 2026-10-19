import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, ".cache", "shots");
const BASE = process.argv[2] ?? "http://localhost:4173";

await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(SHOTS, "nav-mobile.png"), clip: { x: 0, y: 0, width: 390, height: 120 } });

const metrics = await page.evaluate(() => {
  const menu = document.querySelector('button[aria-label="Open menu"]');
  const bag = document.querySelector('button[aria-label*="Shopping bag"]');
  const search = document.querySelector('button[aria-label="Search jerseys"]');
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const svg = el.querySelector("svg");
    const s = svg ? svg.getBoundingClientRect() : null;
    return {
      button: `${Math.round(r.width)}x${Math.round(r.height)}`,
      icon: s ? `${Math.round(s.width)}x${Math.round(s.height)}` : "n/a",
    };
  };
  return { menu: measure(menu), bag: measure(bag), search: measure(search) };
});
console.log(JSON.stringify(metrics, null, 2));

// tablet + desktop sanity
for (const width of [834, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, `nav-${width}.png`), clip: { x: 0, y: 0, width, height: 110 } });
}

await browser.close();
