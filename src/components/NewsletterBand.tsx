"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { shopConfig } from "@/config/shop";

export default function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white md:px-14 md:py-16">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-accent">Stay in the loop</p>
              <h2 className="display-md mt-4 text-white">New drops, first look</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Join the list for new arrivals, restocks and the occasional bundle deal.
              </p>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-ink">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <p className="text-sm text-white/80">
                  Thanks — you&apos;re on the list. We&apos;ll be in touch on{" "}
                  <span className="font-semibold text-white">{email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-13 flex-1 rounded-full border border-white/15 bg-white/5 px-6 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent"
                />
                <button
                  type="submit"
                  className="btn-base btn-accent h-13 rounded-full px-8 text-xs"
                >
                  Join the list
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <p className="relative mt-6 text-xs text-white/35">
            Demo form — nothing is sent or stored. Prefer to order?{" "}
            <a
              href={`https://wa.me/${shopConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              Message us on WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
