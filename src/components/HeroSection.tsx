"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Play, Sparkles } from "lucide-react";
import { shopConfig } from "@/config/shop";

const stripItems = [
  "Real Madrid",
  "FC Barcelona",
  "Manchester United",
  "Liverpool FC",
  "Argentina",
  "Brazil",
  "AC Milan",
  "Juventus",
  "Chelsea FC",
  "France",
  "Germany",
  "Bayern Munich",
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Backdrop imagery */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/hero.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-[72%_center] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/70" />
        <div className="absolute inset-0 bg-ink/25" />
      </div>

      <div className="container-page relative">
        <div className="grid min-h-[78vh] items-center gap-12 py-16 md:min-h-[86vh] md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Season collection — 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="display-xl mt-7 text-white"
            >
              Wear your
              <br />
              <span className="text-accent">passion.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
            >
              From legendary club colors to international icons, find the jersey that
              represents your game.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/shop"
                className="btn-base btn-accent h-13 w-full rounded-full px-8 text-xs sm:w-auto"
              >
                Shop jerseys
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop?category=club"
                className="btn-base btn-outline h-13 w-full rounded-full border-white/40 px-8 text-xs text-white hover:border-white hover:bg-white hover:text-ink sm:w-auto"
              >
                <Play className="h-3.5 w-3.5" />
                Explore collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-7"
            >
              {[
                { value: "40+", label: "Jerseys in the collection" },
                { value: "5", label: "Sizes: S to XXL" },
                { value: "1-on-1", label: "WhatsApp ordering" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl font-extrabold tracking-tight text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative border-t border-white/10 bg-ink/80 py-4 backdrop-blur">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...stripItems, ...stripItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.25em] text-white/45"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-24 right-6 hidden lg:block">
        <a
          href={`https://wa.me/${shopConfig.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Order on WhatsApp"
          className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-ink shadow-xl transition-transform duration-300 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
