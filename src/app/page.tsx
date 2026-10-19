import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import PromoBanner from "@/components/PromoBanner";
import BrandHighlights from "@/components/BrandHighlights";
import NewsletterBand from "@/components/NewsletterBand";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { bestSellers } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <CategorySection />

      <section className="bg-white pb-16 md:pb-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Most wanted"
              title="Best sellers"
              description="The shirts our supporters keep coming back for — club icons, national colours and the classics."
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

          <div className="mt-10">
            <ProductGrid products={bestSellers} />
          </div>
        </div>
      </section>

      <PromoBanner />

      <NewArrivalsSection />

      <BrandHighlights />

      <NewsletterBand />
    </>
  );
}
