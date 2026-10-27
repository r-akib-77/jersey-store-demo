"use client";

import { useState } from "react";
import { Eye, Plus, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useUIActions } from "@/context/UIContext";
import { formatBDT, formatDiscount } from "@/lib/format";
import SizeSelector from "@/components/SizeSelector";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<string>(product.sizes[1] ?? product.sizes[0]);
  const { addItem, openCart } = useCart();
  const { openQuickView } = useUIActions();
  const discount = formatDiscount(product.price, product.compareAtPrice);

  const handleAdd = () => {
    addItem(product, size, 1);
    openCart();
  };

  return (
    <article className="group relative flex h-full flex-col">
      {/* Whole image area opens quick view — on touch there is no hover,
          so the hover-only button is unreachable; this makes the tap instant. */}
      <div
        onClick={() => openQuickView(product)}
        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-mist transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_-38px_rgba(8,8,8,0.55)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {discount && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-ink">
              {discount}
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
              New
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute right-3 top-3"
        />

        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="absolute inset-x-3 bottom-3 flex h-10 items-center justify-center gap-2 rounded-full bg-white/90 text-[11px] font-bold uppercase tracking-[0.12em] text-ink opacity-0 backdrop-blur transition-all duration-300 hover:bg-ink hover:text-white focus-visible:opacity-100 group-hover:opacity-100 md:opacity-0"
        >
          <Eye className="h-3.5 w-3.5" />
          Quick view
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow text-muted">{product.categoryLabel}</p>
        <h3 className="mt-1.5 font-display text-[15px] font-bold leading-snug tracking-tight text-ink sm:text-base">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            {formatBDT(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted line-through">
              {formatBDT(product.compareAtPrice)}
            </span>
          )}
          <span className="ml-auto hidden items-center gap-1 text-xs text-muted sm:flex">
            <Star className="h-3 w-3 fill-accent-strong text-accent-strong" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <SizeSelector
            sizes={product.sizes}
            value={size}
            onChange={setSize}
            size="sm"
            idPrefix={`card-${product.slug}`}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="btn-base btn-primary h-11 w-full rounded-xl text-[11px]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
