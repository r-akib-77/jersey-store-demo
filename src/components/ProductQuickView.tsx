"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageCircle, Star, Truck, X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { formatBDT, formatDiscount } from "@/lib/format";
import { buildProductMessage, whatsappUrl } from "@/lib/whatsapp";
import SizeSelector from "@/components/SizeSelector";
import QuantityStepper from "@/components/QuantityStepper";
import WishlistButton from "@/components/WishlistButton";

export default function ProductQuickView() {
  const { quickViewProduct, closeQuickView } = useUI();
  const { addItem, openCart } = useCart();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSize(quickViewProduct.sizes[1] ?? quickViewProduct.sizes[0]);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickViewProduct, closeQuickView]);

  const product = quickViewProduct;
  const discount = product ? formatDiscount(product.price, product.compareAtPrice) : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="quick-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={closeQuickView} />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist md:aspect-auto md:min-h-[34rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {discount && (
                    <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-ink">
                      {discount}
                    </span>
                  )}
                  {product.badge && (
                    <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-muted">{product.categoryLabel}</p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-ink md:text-3xl">
                      {product.name}
                    </h2>
                  </div>
                  <WishlistButton
                    productId={product.id}
                    productName={product.name}
                    className="shrink-0 border border-line"
                  />
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-ink">
                    <Star className="h-3.5 w-3.5 fill-accent-strong text-accent-strong" />
                    <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-xs text-muted">({product.reviewCount} demo reviews)</span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-ink">
                    {formatBDT(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-base text-muted line-through">
                      {formatBDT(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-ink">Select size</span>
                    <span className="text-xs text-muted">Regular fit</span>
                  </div>
                  <div className="mt-3">
                    <SizeSelector
                      sizes={product.sizes}
                      value={size}
                      onChange={setSize}
                      idPrefix={`quick-${product.slug}`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <span className="eyebrow text-ink">Quantity</span>
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                  <span className="ml-auto text-sm font-semibold text-ink">
                    {formatBDT(product.price * quantity)}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem(product, size, quantity);
                      closeQuickView();
                      openCart();
                    }}
                    className="btn-base btn-primary h-12 rounded-xl text-xs"
                  >
                    Add to cart
                  </button>
                  <a
                    href={whatsappUrl(buildProductMessage(product, size, quantity))}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-base btn-outline h-12 rounded-xl border-ink text-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Order on WhatsApp
                  </a>
                </div>

                <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
                  {product.details.map((detail) => (
                    <li key={detail.label} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      <span className="text-muted">
                        <span className="font-semibold text-ink">{detail.label}:</span> {detail.value}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-sm">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                    <span className="text-muted">Delivery arranged directly with the shop on WhatsApp.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
