"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "club", label: "Club" },
  { value: "national", label: "National Teams" },
  { value: "retro", label: "Retro" },
  { value: "training", label: "Training" },
] as const;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export default function ShopView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") ?? "all";
  const initialSort = searchParams.get("sort") ?? "featured";
  const [category, setCategory] = useState<string>(
    CATEGORY_OPTIONS.some((option) => option.value === initialCategory)
      ? initialCategory
      : "all",
  );
  const [sort, setSort] = useState<string>(
    SORT_OPTIONS.some((option) => option.value === initialSort) ? initialSort : "featured",
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !term ||
        `${product.name} ${product.categoryLabel} ${product.shortDescription}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller));
      }
    });

    return list;
  }, [category, sort, query]);

  const updateCategory = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("featured");
    router.replace("/shop", { scroll: false });
  };

  return (
    <div className="bg-white pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
            <p className="eyebrow text-muted">The full collection</p>
          </div>
          <h1 className="display-lg mt-4 text-ink">Shop all jerseys</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Every shirt in the collection — filter by category, search by club or country, and pick
            your size.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-11 w-full max-w-sm items-center gap-3 rounded-full border border-line bg-mist px-4 focus-within:border-ink">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <label htmlFor="shop-search" className="sr-only">
                  Search jerseys
                </label>
                <input
                  id="shop-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by club, country or name…"
                  className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <ProductFilters
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={updateCategory}
                className="lg:ml-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted" />
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full rounded-full border border-line bg-white px-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink outline-none transition-colors focus:border-ink sm:w-auto"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
          {(category !== "all" || query) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink underline decoration-accent-strong decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-8">
          <ProductGrid
            products={visible}
            emptyTitle="No matching jerseys"
            emptyMessage="We couldn’t find anything for that search. Try another club, country or category."
            emptyAction={
              <button
                type="button"
                onClick={resetFilters}
                className="btn-base btn-primary h-11 rounded-full px-6 text-xs"
              >
                Reset filters
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
