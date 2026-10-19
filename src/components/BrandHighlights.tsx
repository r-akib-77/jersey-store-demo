import { MessageCircle, Ruler, Shirt, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { shopConfig } from "@/config/shop";

const highlights = [
  {
    icon: Sparkles,
    title: "Curated collections",
    body: "Club icons, national colours and retro classics hand-picked for the season.",
  },
  {
    icon: Shirt,
    title: "Multiple sizes & styles",
    body: "Home, away and retro cuts in five sizes, from S right through to XXL.",
  },
  {
    icon: MessageCircle,
    title: "Convenient ordering",
    body: "Send your order straight to WhatsApp — confirm size, stock and delivery in one chat.",
  },
  {
    icon: Ruler,
    title: "Fit you can trust",
    body: "Regular-fit cuts with a size guide on every product page before you order.",
  },
];

export default function BrandHighlights() {
  return (
    <section className="bg-mist py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
              <p className="eyebrow text-muted">Why {shopConfig.name}</p>
            </div>
            <h2 className="display-lg mt-4 text-ink">Built for supporters</h2>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, index) => (
            <Reveal key={highlight.title} delay={index * 0.08}>
              <li className="h-full rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_60px_-40px_rgba(8,8,8,0.5)]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-ink">
                  <highlight.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {highlight.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{highlight.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
