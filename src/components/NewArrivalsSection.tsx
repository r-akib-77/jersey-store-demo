"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Link from "next/link";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "club", label: "Club" },
  { value: "national", label: "National Teams" },
  { value: "retro", label: "Retro" },
] as const;

export default function NewArrivalsSection() {
  const [filter, setFilter] = useState<string>("all");

  const visible = useMemo(() => {
    const newItems = products.filter((product) => product.isNew);
    if (filter === "all") return newItems;
    return newItems.filter((product) => product.category === filter);
  }, [filter]);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Fresh in"
            title="New arrivals"
            description="The latest kits to land on the rails — filter by the collection you follow."
            action={
              <Link
                href="/shop"
                className="btn-base btn-outline h-11 rounded-full border-ink px-6 text-xs"
              >
                View all
              </Link>
            }
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8">
            <ProductFilters options={OPTIONS} value={filter} onChange={setFilter} />
          </div>
        </Reveal>

        <div className="mt-10">
          <ProductGrid
            products={visible}
            emptyTitle="Nothing here yet"
            emptyMessage="No new arrivals in this category right now — check back soon."
            emptyAction={
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="btn-base btn-primary h-11 rounded-full px-6 text-xs"
              >
                Show all arrivals
              </button>
            }
          />
        </div>
      </div>
    </section>
  );
}
