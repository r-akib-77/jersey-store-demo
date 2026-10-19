import type { Metadata } from "next";
import Link from "next/link";
import { shopConfig } from "@/config/shop";

export const metadata: Metadata = {
  title: "Policies",
  description: "Privacy, terms, shipping and size guide for the demo storefront.",
};

const sections = [
  {
    id: "privacy",
    title: "Privacy Policy",
    body: [
      `${shopConfig.name} is a demonstration storefront. The shopping bag and wishlist you create are stored only in your own browser using local storage — nothing is sent to a server, and no account is created.`,
      "The customer details you type on the checkout screen are used only to pre-fill the WhatsApp message you choose to send. They are not transmitted anywhere else, and they disappear when you refresh the page.",
      "We never ask for card or bank details on this site. Any payment arrangement happens directly in the WhatsApp conversation with the shop, under the shop's own terms.",
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    body: [
      "All product names, images, prices and descriptions shown here are sample content prepared for demonstration purposes. Prices are shown in Bangladeshi taka and are indicative only.",
      "Orders are not processed automatically. Placing an order means sending a WhatsApp message, which the shop then confirms — including stock, delivery charge and payment method — before anything is agreed.",
      "Brand and club names are the property of their respective owners. This demo is not affiliated with, endorsed by, or sponsored by any club, federation or manufacturer.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Returns",
    body: [
      "Delivery is arranged case by case with the shop over WhatsApp. The shop confirms the delivery charge, the expected handover time and the courier or pickup option for your district before the order is finalised.",
      "Because every shirt is inspected before dispatch, please check the size and details in the order message carefully. If something is not right, contact the shop on WhatsApp and the shop will let you know what can be arranged.",
    ],
  },
  {
    id: "size-guide",
    title: "Size Guide",
    body: [
      "All jerseys in this collection use a regular fit. Sizes run from S to XXL with a relaxed cut through the body, so if you prefer a roomier feel or are between two sizes, size up.",
      "S — chest 34–36 in / 86–91 cm. M — chest 36–38 in / 91–96 cm. L — chest 38–40 in / 96–101 cm. XL — chest 40–42 in / 101–107 cm. XXL — chest 42–44 in / 107–112 cm.",
      "Measurements are chest width across the underarm area, laid flat. Sleeve and body lengths vary slightly between designs, so check the product details on each jersey before ordering.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <div className="bg-white pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
            <p className="eyebrow text-muted">The small print</p>
          </div>
          <h1 className="display-lg mt-4 text-ink">Policies</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            Plain-language policies for this demo storefront. They describe how the demo behaves —
            not a verified legal framework.
          </p>

          <nav aria-label="Policy sections" className="mt-8 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-line bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="display-md text-ink">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-mist p-6 md:p-8">
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-ink">
            Need something else?
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Sizing, delivery or stock questions are quickest to settle in a message. Reach the shop on{" "}
            <a
              href={`https://wa.me/${shopConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink underline decoration-accent-strong decoration-2 underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${shopConfig.email}`}
              className="font-semibold text-ink underline decoration-accent-strong decoration-2 underline-offset-4"
            >
              {shopConfig.email}
            </a>
            .
          </p>
          <Link
            href="/shop"
            className="btn-base btn-primary mt-6 h-11 rounded-full px-6 text-xs"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
