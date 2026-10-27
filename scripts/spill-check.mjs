/** Which elements stick out at 360px (excluding the announcement marquee). */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 844 }, hasTouch: true, isMobile: true });
await page.goto("http://localhost:4173", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1200);

const wide = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    if (el.closest(".animate-marquee")) return;
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1) {
      out.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      });
    }
  });
  return out.sort((a, b) => b.right - a.right).slice(0, 10);
});
console.log(JSON.stringify(wide, null, 1));
await browser.close();
