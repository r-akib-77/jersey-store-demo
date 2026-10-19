/**
 * Central shop configuration.
 *
 * Everything a store owner would change lives in this file:
 *   1. `name`        — the shop name shown in the nav, footer and page titles
 *   2. `logo`        — path to the brand mark (drop a client's file in public/images)
 *   3. `whatsappNumber` / `email` / `phone` / `address` — placeholder contact details
 *   4. links, sizes, currency and social handles
 */
export const shopConfig = {
  /** Store name. Change this to the client's brand, e.g. "Goal Sports". */
  name: "Jersey Store",

  /** Brand mark. Replace the file at this path with the client's own logo. */
  logo: "/images/logo.png",

  /** Deployed URL — used for absolute meta/OG links. */
  siteUrl: "https://jersey-store-demo.pages.dev",

  /** Namespaces cart + wishlist in localStorage so separate demos never clash. */
  storageNamespace: "jersey-store",

  tagline: "Your club. Your colors. Your jersey.",
  description:
    "Curated football jerseys for supporters everywhere — club icons, national colours and retro classics, all in one collection.",
  currency: "৳",
  locale: "en-US",

  /**
   * PLACEHOLDER WhatsApp number for the demo.
   * Replace with the shop's real international number (digits only, no "+").
   */
  whatsappNumber: "8801700000000",

  /** PLACEHOLDER contact details. */
  email: "hello@yourstore.com",
  phone: "+880 1XXX-XXXXXX",
  address: "Your store address, Dhaka",

  /** PLACEHOLDER social profiles. */
  socials: [
    { label: "Facebook", href: "https://facebook.com", handle: "@yourstore" },
    { label: "Instagram", href: "https://instagram.com", handle: "@yourstore" },
    { label: "TikTok", href: "https://tiktok.com", handle: "@yourstore" },
    { label: "YouTube", href: "https://youtube.com", handle: "Your Store" },
  ],

  sizes: ["S", "M", "L", "XL", "XXL"],

  navLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Club Jerseys", href: "/shop?category=club" },
    { label: "National Teams", href: "/shop?category=national" },
    { label: "Retro Jerseys", href: "/shop?category=retro" },
  ],

  shopLinks: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Checkout", href: "/checkout" },
  ],

  categoryLinks: [
    { label: "Club Jerseys", href: "/shop?category=club" },
    { label: "National Team Jerseys", href: "/shop?category=national" },
    { label: "Retro Jerseys", href: "/shop?category=retro" },
    { label: "Training Wear", href: "/shop?category=training" },
  ],

  policyLinks: [
    { label: "Privacy Policy", href: "/policies#privacy" },
    { label: "Terms of Service", href: "/policies#terms" },
    { label: "Shipping & Returns", href: "/policies#shipping" },
    { label: "Size Guide", href: "/policies#size-guide" },
  ],
} as const;

export type ShopConfig = typeof shopConfig;

/** Splits the store name for the stacked navbar wordmark, e.g. "Jersey Store" -> ["Jersey", "Store"]. */
export function brandWordmark(name: string = shopConfig.name): [string, string?] {
  const [first, ...rest] = name.trim().split(/\s+/);
  return rest.length ? [first, rest.join(" ")] : [first];
}
