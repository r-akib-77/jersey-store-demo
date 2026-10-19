import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function PromoBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/promo.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
      </div>

      <div className="container-page relative py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
              <p className="eyebrow text-accent">The campaign</p>
            </div>

            <h2 className="display-lg mt-5 mt-2 text-white">
              The game never
              <br />
              goes out of style.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
              Discover your next favourite jersey.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="btn-base btn-accent h-13 w-full rounded-full px-8 text-xs sm:w-auto"
              >
                Explore the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop?category=retro"
                className="btn-base btn-outline h-13 w-full rounded-full border-white/40 px-8 text-xs text-white hover:border-white hover:bg-white hover:text-ink sm:w-auto"
              >
                Retro classics
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
