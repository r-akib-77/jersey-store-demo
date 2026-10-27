/** Wishlist visibility + tap target on mobile widths. */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = process.argv[2] ?? "http://localhost:4173";

const browser = await chromium.launch();
const problems = [];

for (const width of [360, 390, 430, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    hasTouch: width < 800,
    isMobile: width < 800,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);

  const heart = await page.evaluate(() => {
    const el = document.querySelector('a[aria-label^="Wishlist"]');
    if (!el) return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const icon = el.querySelector("svg")?.getBoundingClientRect();
    return {
      visible: style.display !== "none",
      h: Math.round(rect.height),
      right: Math.round(rect.right),
      vw: document.documentElement.clientWidth,
      iconW: icon ? Math.round(icon.width) : 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  console.log(`@${width}px heart: ${JSON.stringify(heart)}`);

  if (!heart || !heart.visible) problems.push(`heart hidden @${width}px`);
  else {
    if (heart.h < 44 && width < 800) problems.push(`heart tap target ${heart.h}px < 44 @${width}px`);
    if (heart.overflow > 1) problems.push(`overflow ${heart.overflow}px @${width}px`);
  }

  if (width === 360 || width === 1440) {
    await page.screenshot({ path: path.join(ROOT, ".cache", "shots", `heart-${width}.png`) });
  }
  await context.close();
}

await browser.close();
console.log("\nproblems:", problems.length ? problems.join("; ") : "none");
