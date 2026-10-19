"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { searchProducts } from "@/data/products";
import { formatBDT } from "@/lib/format";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, openQuickView } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timeout = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(timeout);
    }
    setQuery("");
    return undefined;
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    if (!query.trim()) return searchProducts("").slice(0, 6);
    return searchProducts(query).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={closeSearch} />

          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto rounded-b-3xl bg-white shadow-2xl"
          >
            <div className="container-page pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 flex-1 items-center gap-3 rounded-full border border-line bg-mist px-4 focus-within:border-ink">
                  <Search className="h-4 w-4 shrink-0 text-muted" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search jerseys, clubs, countries…"
                    aria-label="Search jerseys"
                    className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-mist"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-6">
                <p className="eyebrow mb-4 text-muted">
                  {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular right now"}
                </p>

                {results.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line bg-mist px-6 py-12 text-center">
                    <p className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                      No jerseys found
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                      We couldn&apos;t match &ldquo;{query}&rdquo;. Try a club, a country, or browse the full shop.
                    </p>
                    <a
                      href="/shop"
                      onClick={closeSearch}
                      className="btn-base btn-primary mt-5 h-11 rounded-full px-6 text-xs"
                    >
                      Browse all jerseys
                    </a>
                  </div>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((product) => (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => {
                            openQuickView(product);
                            closeSearch();
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-2 text-left transition-colors duration-200 hover:border-ink"
                        >
                          <span className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">{product.name}</span>
                            <span className="block text-xs text-muted">{product.categoryLabel}</span>
                            <span className="mt-1 block text-sm font-bold text-ink">
                              {formatBDT(product.price)}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
