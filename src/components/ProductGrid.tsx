"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export default function ProductGrid({
  products,
  emptyTitle = "No jerseys found",
  emptyMessage = "Try a different search term or filter.",
  emptyAction,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-mist px-6 py-16 text-center">
        <PackageSearch className="mx-auto h-8 w-8 text-muted" />
        <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-ink">
          {emptyTitle}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{emptyMessage}</p>
        {emptyAction && <div className="mt-6 flex justify-center">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <motion.ul
      layout
      className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.li
            key={product.id}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0"
          >
            <ProductCard product={product} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
