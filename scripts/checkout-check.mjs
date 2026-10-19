/**
 * Checkout QA: seeds a cart, then checks the checkout page at several widths.
 */
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
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

// Seed a cart, then land on the checkout page
await page.goto(`${BASE}/shop`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Add to cart" }).first().click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Close bag" }).click();
await page.waitForTimeout(400);

for (const width of [360, 390, 430, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}/checkout/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input, select, textarea")).map((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        name: el.getAttribute("name"),
        h: Math.round(r.height),
        font: style.fontSize,
        w: Math.round(r.width),
      };
    }),
  );
  const small = width < 640 ? inputs.filter((i) => parseFloat(i.font) < 16 && i.h > 0) : [];
  const short = inputs.filter((i) => i.h < 44);

  console.log(
    `@${width}px overflow=${overflow}px | inputs=${inputs.length} font<16px=${small.length} height<44=${short.length}`,
  );
  if (overflow > 1) problems.push(`overflow ${overflow}px @${width}px`);
  if (small.length) problems.push(`inputs under 16px font @${width}px: ${small.length}`);
  if (short.length) problems.push(`inputs under 44px tall @${width}px: ${short.length}`);

  await page.screenshot({
    path: path.join(SHOTS, `checkout-${width}.png`),
    fullPage: true,
  });
}

// Interactive checks on mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/checkout/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(SHOTS, "checkout-mobile-top.png") });

// Collapsible summary
await page.getByRole("button", { name: /Order summary/ }).click();
await page.waitForTimeout(500);
const expandedItems = await page.getByText(/Size .* · Qty/).count();
await page.screenshot({ path: path.join(SHOTS, "checkout-mobile-summary-open.png") });
console.log(`summary expands: ${expandedItems > 0}`);
if (expandedItems === 0) problems.push("mobile summary does not expand");

// Sticky bar
const ctaBefore = page.getByRole("button", { name: /Add your details/ });
const barVisible = await ctaBefore.isVisible();
console.log(`sticky bar CTA visible: ${barVisible}`);
if (!barVisible) problems.push("sticky mobile CTA not visible");

await page.getByLabel("Full name").fill("Rakib Hasan");
await page.getByLabel("Phone number").fill("01712345678");
await page.waitForTimeout(500);
const cta = await page.getByRole("link", { name: /Send on WhatsApp/ }).getAttribute("href");
console.log(`whatsapp href after filling: ${String(cta).slice(0, 80)}`);
if (!cta || !cta.includes("wa.me")) problems.push("mobile CTA not wired to WhatsApp");
if (!cta.includes("Rakib%20Hasan")) problems.push("customer name missing from WhatsApp message");
await page.screenshot({ path: path.join(SHOTS, "checkout-mobile-filled.png") });

// The sticky bar must not cover the footer / last field
const coverage = await page.evaluate(() => {
  const bar = document.querySelector("div.fixed.inset-x-0.bottom-0");
  if (!bar) return null;
  const r = bar.getBoundingClientRect();
  const note = document.querySelector("textarea")?.getBoundingClientRect();
  return { barTop: Math.round(r.top), barHeight: Math.round(r.height), noteBottom: note ? Math.round(note.bottom) : null };
});
console.log(`sticky bar: ${JSON.stringify(coverage)}`);

await browser.close();
console.log("\n--- problems ---");
console.log(problems.length ? [...new Set(problems)].join("\n") : "none");
