/**
 * Central shop configuration.
 * Every value that a real store owner would change lives here.
 */
export const shopConfig = {
  name: "Jersey House",
  tagline: "Your club. Your colors. Your jersey.",
  description:
    "Curated football jerseys for supporters everywhere — club icons, national colours and retro classics, all in one collection.",
  currency: "৳",
  locale: "en-US",

  /**
   * Placeholder WhatsApp number for the demo.
   * Replace with the shop's real international number (digits only, no "+").
   */
  whatsappNumber: "8801700000000",

  email: "hello@jerseyhouse.bd",
  phone: "+880 1XXX-XXXXXX",
  address: "Dhaka, Bangladesh",

  socials: [
    { label: "Facebook", href: "https://facebook.com", handle: "@jerseyhouse" },
    { label: "Instagram", href: "https://instagram.com", handle: "@jerseyhouse" },
    { label: "TikTok", href: "https://tiktok.com", handle: "@jerseyhouse" },
    { label: "YouTube", href: "https://youtube.com", handle: "Jersey House" },
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
