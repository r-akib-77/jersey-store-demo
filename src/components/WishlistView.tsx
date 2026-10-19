"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { products } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";

export default function WishlistView() {
  const { ids } = useWishlist();
  const saved = products.filter((product) => ids.includes(product.id));

  return (
    <div className="bg-white pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
            <p className="eyebrow text-muted">Saved for later</p>
          </div>
          <h1 className="display-lg mt-4 text-ink">Your wishlist</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {saved.length > 0
              ? `${saved.length} jersey${saved.length === 1 ? "" : "s"} saved. Your list stays on this device.`
              : "Tap the heart on any jersey to keep it here. Your list stays on this device."}
          </p>
        </Reveal>

        <div className="mt-10">
          {saved.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-mist px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white">
                <Heart className="h-5 w-5 text-muted" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-ink">
                Nothing saved yet
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Browse the collection and save the jerseys you want to come back to.
              </p>
              <Link
                href="/shop"
                className="btn-base btn-primary mt-6 h-11 rounded-full px-6 text-xs"
              >
                Browse jerseys
              </Link>
            </div>
          ) : (
            <ProductGrid products={saved} />
          )}
        </div>
      </div>
    </div>
  );
}
