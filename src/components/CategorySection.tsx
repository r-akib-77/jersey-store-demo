"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCategories } from "@/data/products";
import Reveal from "@/components/Reveal";

export default function CategorySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
            <p className="eyebrow text-muted">Shop by category</p>
          </div>
          <h2 className="display-lg mt-4 max-w-2xl text-ink">
            Every shirt tells a story
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Four curated rails — from the biggest European clubs to the classics that never
            left the wardrobe.
          </p>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {productCategories.map((category, index) => (
            <Reveal key={category.value} delay={index * 0.07}>
              <li className="h-full">
                <Link
                  href={`/shop?category=${category.value}`}
                  className="group relative block overflow-hidden rounded-2xl bg-ink"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt={category.label}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <p className="font-display text-[15px] font-extrabold uppercase leading-tight tracking-tight text-white sm:text-xl">
                      {category.label}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      Shop now
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
