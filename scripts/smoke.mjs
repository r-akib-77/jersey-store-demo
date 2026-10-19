/**
 * Visual + interaction smoke test for the Jersey House storefront.
 * Run with: node scripts/smoke.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, ".cache", "shots");
const BASE = process.argv[2] ?? "http://localhost:3100";

const problems = [];

/** Scrolls the page so lazy images and scroll-reveal animations trigger. */
async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
    window.scrollTo(0, total);
    await new Promise((resolve) => setTimeout(resolve, 400));
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page
    .waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      { timeout: 15000 },
    )
    .catch(() => {});
}

async function run() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      problems.push(`http ${response.status()}: ${response.url()}`);
    }
  });

  const shots = [
    { name: "home-desktop", url: "/", width: 1440, height: 1000, full: true },
    { name: "shop-desktop", url: "/shop", width: 1440, height: 1000, full: true },
    { name: "home-mobile", url: "/", width: 390, height: 844, full: true },
    { name: "shop-mobile", url: "/shop", width: 390, height: 844, full: true },
    { name: "checkout-mobile", url: "/checkout", width: 390, height: 844, full: true },
    { name: "wishlist-desktop", url: "/wishlist", width: 1440, height: 900, full: true },
    { name: "policies-desktop", url: "/policies", width: 1440, height: 900, full: true },
    { name: "home-tablet", url: "/", width: 834, height: 1112, full: true },
  ];

  for (const shot of shots) {
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
    await autoScroll(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SHOTS, `${shot.name}.png`), fullPage: shot.full });
    console.log(`shot: ${shot.name}`);
  }

  // Broken image check across the catalog
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/shop`, { waitUntil: "networkidle" });
  await autoScroll(page);
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );
  if (broken.length) problems.push(`broken images: ${broken.join(", ")}`);
  console.log(`broken images: ${broken.length}`);

  // Horizontal overflow check on every viewport
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`overflow @${width}px: ${overflow}px`);
    if (overflow > 1) problems.push(`horizontal overflow ${overflow}px at ${width}px`);
  }

  // ---- Interaction checks (desktop) ----
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // Add to cart from a product card (the bag drawer opens automatically)
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await page.waitForTimeout(900);
  const bagCount = await page.locator('header button[aria-label*="Shopping bag"]').innerText();
  console.log(`bag badge after add: ${bagCount.trim()}`);
  if (!bagCount.includes("1")) problems.push("cart badge did not update after add to cart");

  // Drawer is open: change qty, remove
  const drawerVisible = await page.getByRole("dialog", { name: "Shopping bag" }).isVisible();
  if (!drawerVisible) problems.push("cart drawer did not open");
  await page.screenshot({ path: path.join(SHOTS, "cart-drawer.png") });

  await page.getByRole("button", { name: "Increase quantity" }).first().click();
  await page.waitForTimeout(400);
  const subtotal = await page.locator("text=Subtotal").locator("..").innerText();
  console.log(`drawer subtotal: ${subtotal.replace(/\s+/g, " ")}`);

  await page.getByRole("button", { name: /Remove .* from bag/ }).first().click();
  await page.waitForTimeout(500);
  const emptyCartState = await page.getByText("Your bag is empty").count();
  if (emptyCartState === 0) problems.push("empty cart state not shown after removal");
  await page.screenshot({ path: path.join(SHOTS, "cart-empty.png") });
  await page.getByRole("button", { name: "Close bag" }).click();
  await page.waitForTimeout(500);

  // Quick view
  await page.locator("article").first().hover();
  await page.getByRole("button", { name: /Quick view/ }).first().click({ force: true });
  await page.waitForTimeout(700);
  const quickVisible = await page.getByRole("dialog").first().isVisible();
  if (!quickVisible) problems.push("quick view did not open");
  await page.screenshot({ path: path.join(SHOTS, "quick-view.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Wishlist toggle
  await page.locator("article button[aria-label*='wishlist']").first().click();
  await page.waitForTimeout(400);

  // Search overlay
  await page.getByRole("button", { name: "Search jerseys" }).click();
  await page.waitForTimeout(500);
  await page.getByLabel("Search jerseys").last().fill("argentina");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, "search-overlay.png") });
  const resultCount = await page.locator("text=/result/").count();
  console.log(`search result label present: ${resultCount > 0}`);
  await page.getByRole("button", { name: "Close search" }).click();
  await page.waitForTimeout(400);

  // New arrivals filter
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const newArrivals = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "New arrivals" }) });
  await newArrivals.getByRole("tab", { name: "Retro" }).click();
  await page.waitForTimeout(900);
  const retroCount = await newArrivals.locator("article").count();
  console.log(`new arrivals after Retro filter: ${retroCount} cards`);
  if (retroCount !== 1) problems.push(`retro filter expected 1 card, got ${retroCount}`);
  await page.screenshot({ path: path.join(SHOTS, "new-arrivals-retro.png"), fullPage: false });

  // Shop search + category
  await page.goto(`${BASE}/shop`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.locator("#shop-search").fill("milan");
  await page.waitForTimeout(900);
  const milanResults = await page.locator("article").count();
  console.log(`shop search "milan" -> ${milanResults} cards`);
  if (milanResults !== 1) problems.push(`shop search expected 1 result for 'milan', got ${milanResults}`);

  await page.locator("#shop-search").fill("zzzznothing");
  await page.waitForTimeout(700);
  const emptyState = await page.getByText("No matching jerseys").count();
  if (emptyState === 0) problems.push("no-results state missing on shop page");
  await page.screenshot({ path: path.join(SHOTS, "shop-no-results.png") });

  await page.goto(`${BASE}/shop?category=club`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, "shop-category-club.png") });

  // Mobile menu
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(SHOTS, "mobile-menu.png") });
  const menuVisible = await page.getByRole("dialog", { name: "Main menu" }).isVisible();
  if (!menuVisible) problems.push("mobile menu did not open");
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.waitForTimeout(500);

  // Mobile quick view + add to cart
  await page.getByRole("button", { name: /Quick view/ }).first().click({ force: true });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOTS, "mobile-quick-view.png") });
  await page.getByRole("button", { name: "Add to cart" }).last().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOTS, "mobile-cart.png") });

  // WhatsApp link sanity
  const waHref = await page.locator('a[href*="wa.me"]').first().getAttribute("href");
  console.log(`whatsapp href: ${String(waHref).slice(0, 90)}`);
  if (!waHref || !waHref.includes("wa.me")) problems.push("whatsapp link missing");

  // localStorage persistence
  const stored = await page.evaluate(() => window.localStorage.getItem("jersey-house.cart.v1"));
  console.log(`localStorage cart: ${String(stored).slice(0, 120)}`);
  if (!stored) problems.push("cart not persisted to localStorage");

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const badgeAfterReload = await page
    .locator('header button[aria-label*="Shopping bag"]')
    .innerText();
  console.log(`bag badge after reload: ${badgeAfterReload.trim()}`);
  if (!badgeAfterReload.includes("1")) problems.push("cart badge lost after reload");

  // Wishlist persistence
  const wish = await page.evaluate(() => window.localStorage.getItem("jersey-house.wishlist.v1"));
  console.log(`localStorage wishlist: ${wish}`);

  await browser.close();

  console.log("\n--- problems ---");
  if (problems.length === 0) console.log("none");
  else [...new Set(problems)].forEach((problem) => console.log(problem));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
