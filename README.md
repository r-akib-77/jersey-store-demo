# Jersey House

A premium, frontend-only storefront demo for **Jersey House** — a football jersey shop.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons and
Framer Motion. There is **no backend**: all product data is local, the cart and wishlist live in
React state plus `localStorage`, and orders are handed off to WhatsApp.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # static production build -> ./out
npm run lint     # eslint
npm run start    # serve the production build
npm run assets:build   # regenerate product renders / logo / photo crops
```

## What's inside

| Area | Notes |
| --- | --- |
| Homepage | Announcement bar, sticky nav, hero, category tiles, best sellers, promo banner, new arrivals with filters, brand highlights, newsletter, footer |
| Shop | Live search, category filters, sorting, empty state |
| Product | Quick-view modal, size selection, quantity, wishlist, WhatsApp order |
| Cart | Slide-over drawer, quantity stepper, removal, subtotal, empty state, `localStorage` persistence |
| Wishlist | Saved products with a dedicated page, persisted locally |
| Checkout | Demo order summary + customer form, final step sends the order to WhatsApp (no payment is processed) |

## Structure

```
src/
  app/            routes: /, /shop, /wishlist, /checkout, /policies
  components/     UI (product, cart, layout, home sections, primitives)
  config/         shop configuration (brand, contact, WhatsApp number, links)
  context/        cart, wishlist and UI state providers
  data/           static product catalogue
  lib/            formatting and WhatsApp message helpers
  types/          shared TypeScript types
scripts/          asset generation and QA helpers (dev-only)
```

## Configuration

`src/config/shop.ts` holds everything a store owner would change:

- `whatsappNumber` — **placeholder** number used to build `wa.me` links
- `email`, `phone`, `address` — placeholder contact details
- navigation, category, shop and policy links
- currency and size list

Prices are shown in Bangladeshi taka (`৳`) via `src/lib/format.ts`.

## Imagery

`npm run assets:build` regenerates:

- `public/images/products/*.png` — studio-style jersey renders generated from SVG templates
- `public/images/logo.png` — the supplied brand mark, trimmed and made transparent
- `public/images/photos/*` — shop photography, cropped to a consistent 4:5 frame

Product photography is a mix of the shop's own photos and free-to-use editorial imagery from
Unsplash, all stored locally so the demo works offline.

## Notes for the demo

- Product names, prices, reviews and contact details are **sample content** for presentation.
- No order is submitted to a server, no payment is taken, and no account is required.
- The next step in a real deployment would be wiring the WhatsApp handoff to a live number and
  adding a real product feed.
