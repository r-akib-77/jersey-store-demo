# Football Jersey Store — Storefront Template

A premium, frontend-only storefront template for a football jersey shop.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons and
Framer Motion. There is **no backend**: all product data is local, the cart and wishlist live in
React state plus `localStorage`, and orders are handed off to WhatsApp.

> The branding is intentionally generic so the demo can be shown to any client. Everything
> brand-specific lives in one file — see [Rebranding](#rebranding-in-two-minutes).

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
node scripts/smoke.mjs http://localhost:4173   # visual + interaction QA run
```

## Rebranding in two minutes

| What | Where |
| --- | --- |
| Store name | `src/config/shop.ts` → `name` (nav wordmark, footer, page titles, WhatsApp messages) |
| Logo | `node scripts/build-logo.mjs "<path-to-client-logo>" <slug>` — trims, square-pads and installs it as `public/images/logo.png` (also the favicon); the original is archived under `public/images/brand/` |
| Colors | Brand tokens in `src/app/globals.css` (`--color-accent*`) — sample the client palette with `node scripts/brand-palette.mjs "<path-to-logo>"` |
| WhatsApp number | `src/config/shop.ts` → `whatsappNumber` (digits only, no `+`) |
| Email / phone / address | `src/config/shop.ts` |
| Social links | `src/config/shop.ts` → `socials` |
| Nav / footer / policy links | `src/config/shop.ts` |
| Accent colour + type | `src/app/globals.css` → the `@theme` block |
| Product catalogue | `src/data/products.ts` (name, price, image, copy) |

`storageNamespace` keeps the cart and wishlist separate per brand, so two demos hosted on the
same domain never share state.

The original client logo is kept at `public/images/brand/` for reference.

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
public/images/    generated renders, processed photos, brand mark
```

## Imagery

`npm run assets:build` regenerates:

- `public/images/products/*.png` — studio-style jersey renders generated from SVG templates
- `public/images/logo.png` — the client brand mark (built from the source logo by `scripts/build-logo.mjs`)
- `public/images/photos/*` — shop photography, cropped to a consistent 4:5 frame

Product photography mixes the client's own photos with free-to-use editorial imagery from
Unsplash, all stored locally so the demo works offline.

## Notes for the demo

- Product names, prices, reviews and contact details are **sample content** for presentation.
- No order is submitted to a server, no payment is taken, and no account is required.
- The next step in a real deployment would be wiring the WhatsApp handoff to a live number and
  adding a real product feed.
