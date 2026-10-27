/** Rebrand QA: screenshots + palette assertions across key pages. */
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
const problems = [];

// Desktop home
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
desktop.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
desktop.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`);
});
await desktop.goto(BASE, { waitUntil: "networkidle" });
await desktop.waitForTimeout(1000);
await desktop.screenshot({ path: path.join(SHOTS, "rebrand-home-top.png") });
const brandText = await desktop.locator("header a[aria-label*='home']").innerText();
console.log("navbar wordmark:", JSON.stringify(brandText.replace(/\n/g, " / ")));
await desktop.screenshot({ path: path.join(SHOTS, "rebrand-home-full.png"), fullPage: true });

// Footer brand row
const footerLogo = await desktop.evaluate(() => {
  const img = document.querySelector("footer img");
  const tile = img?.closest("span");
  const r = img.getBoundingClientRect();
  return { src: img.getAttribute("src"), w: Math.round(r.width), tileRounded: !!tile?.className.includes("rounded-xl") };
});
console.log("footer logo:", JSON.stringify(footerLogo));
if (!footerLogo.src?.endsWith("logo.png") || footerLogo.w <= 0) problems.push("footer logo missing");

// Shop page (filters untouched, sanitise accent usage)
await desktop.goto(`${BASE}/shop/`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(900);
const accent = await desktop.evaluate(() => {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue("--color-accent").trim();
});
console.log("live accent token:", accent);
if (accent.toLowerCase() !== "#3ab6fe") problems.push(`accent token wrong: ${accent}`);
await desktop.screenshot({ path: path.join(SHOTS, "rebrand-shop.png") });

// Checkout CTA colour sanity
await desktop.goto(`${BASE}/checkout/`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: path.join(SHOTS, "rebrand-checkout.png") });

// Mobile home
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1000);
await mobile.screenshot({ path: path.join(SHOTS, "rebrand-mobile-home.png") });

// Favicon resolves
const icon = await desktop.evaluate(async () => {
  const link = document.querySelector("link[rel='icon']");
  if (!link) return null;
  const res = await fetch(link.href);
  return { href: link.href, status: res.status, type: res.headers.get("content-type") };
});
console.log("favicon:", JSON.stringify(icon));
if (!icon || icon.status !== 200) problems.push("favicon not resolving");

await browser.close();
console.log("\n--- problems ---");
console.log(problems.length ? [...new Set(problems)].join("\n") : "none");
