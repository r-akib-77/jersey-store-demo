/** Mobile tap QA: quick-view opens from the jersey image immediately (touch context). */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, ".cache", "shots");
const BASE = process.argv[2] ?? "http://localhost:4173";

const browser = await chromium.launch();
// Real phone-shaped context: touch events, mobile UA
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await context.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`);
});

await page.goto(`${BASE}/shop/`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// 1. Tap the jersey IMAGE itself (not the hover-only button) -> quick view must open.
const card = page.locator("article").nth(2);
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const productName = await card.locator("h3").innerText();
await card.locator("img").tap({ timeout: 5000 });
await page.waitForTimeout(500);
const dialog = page.locator('[role="dialog"]');
const open = await dialog.isVisible();
console.log(`quick view opened from image tap: ${open}`);
if (!open) problems.push("tapping the jersey image does not open quick view");
if (open) {
  const title = await dialog.locator("h2").first().innerText();
  console.log(`dialog product: ${title.trim()} (tapped ${productName.trim()})`);
  if (!title.trim().toLowerCase().includes(productName.trim().toLowerCase().slice(0, 12))) {
    problems.push("quick view opened the wrong product");
  }
}
await page.screenshot({ path: path.join(SHOTS, "tap-check-quickview.png") });

// 2. How long the modal takes to MOUNT after the tap (excludes animation)
await page.goto(`${BASE}/shop/`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
const mountMs = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const t0 = performance.now();
      const observer = new MutationObserver(() => {
        if (document.querySelector('[role="dialog"]')) {
          observer.disconnect();
          resolve(Math.round(performance.now() - t0));
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const img = document.querySelector("article img");
      img.parentElement?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
      );
    }),
);
console.log(`quick view mount latency after tap: ${mountMs}ms`);
if (mountMs > 120) problems.push(`modal mount too slow: ${mountMs}ms`);

// Close the modal from step 2 before continuing
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Close quick view" }).tap();
await page.waitForTimeout(500);
if (await page.locator('[role="dialog"]').count()) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}
console.log("modal closed before heart test");

// 3. Wishlist heart must NOT trigger quick view (isolation)
await page.waitForTimeout(600);
const wishlistBtn = page.locator('article button[aria-label*="wishlist"]').first();
await wishlistBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await wishlistBtn.tap();
await page.waitForTimeout(500);
const dialogAfterHeart = await page.locator('[role="dialog"]').count();
console.log(`dialog open after heart tap: ${dialogAfterHeart}`);
if (dialogAfterHeart > 0) problems.push("wishlist tap wrongly opens quick view");
const heartToast = await page.getByText(/Saved to wishlist/).isVisible();
console.log(`wishlist still saved: ${heartToast}`);
if (!heartToast) problems.push("wishlist save failed");

// 4. Size chips + add-to-cart unaffected
await page.locator('button:has-text("Add to cart")').first().tap();
await page.waitForTimeout(500);
const bagBadge = (await page.getByText(/^1$/).count()) > 0;
console.log(`add to cart still works: ${bagBadge}`);
if (!bagBadge) problems.push("add to cart broken");

await page.screenshot({ path: path.join(SHOTS, "tap-check-cart.png") });

await browser.close();
console.log("\n--- problems ---");
console.log(problems.length ? [...new Set(problems)].join("\n") : "none");
