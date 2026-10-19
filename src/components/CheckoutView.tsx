"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Info, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { formatBDT } from "@/lib/format";
import { buildCartMessage, whatsappUrl } from "@/lib/whatsapp";
import type { CustomerDetails } from "@/types";

const paymentOptions = [
  { value: "cod", label: "Cash on delivery" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
];

/** Shared input styling — 16px text on mobile stops iOS from zooming on focus. */
const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white sm:text-sm";

const labelClass = "eyebrow text-muted";

export default function CheckoutView() {
  const { items, subtotal, itemCount } = useCart();
  const { showToast } = useUI();
  const [details, setDetails] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [payment, setPayment] = useState("cod");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof CustomerDetails, value: string) =>
    setDetails((current) => ({ ...current, [key]: value }));

  const isValid = details.name.trim().length > 1 && details.phone.trim().length > 5;

  const orderHref = useMemo(() => {
    const paymentNote = paymentOptions.find((option) => option.value === payment)?.label;
    const note = paymentNote
      ? `${details.note}${details.note ? " | " : ""}Payment preference: ${paymentNote}`
      : details.note;

    return whatsappUrl(
      buildCartMessage(
        items,
        subtotal,
        payment === "cod" ? details : { ...details, note },
      ),
    );
  }, [items, subtotal, details, payment]);

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-mist">
          <ShoppingBag className="h-6 w-6 text-muted" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
          Nothing to check out
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Your bag is empty. Add a jersey and come back to place your order.
        </p>
        <Link href="/shop" className="btn-base btn-primary mt-8 h-12 rounded-full px-8 text-xs">
          Browse jerseys
        </Link>
      </div>
    );
  }

  const lineItems = items.map((item) => (
    <li key={item.key} className="flex items-center gap-3 py-3 sm:gap-4 sm:py-4">
      <span className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-mist sm:h-20 sm:w-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{item.name}</span>
        <span className="mt-0.5 block text-xs text-muted">
          Size {item.size} · Qty {item.quantity}
        </span>
      </span>
      <span className="shrink-0 text-sm font-bold text-ink">
        {formatBDT(item.price * item.quantity)}
      </span>
    </li>
  ));

  return (
    <div className="bg-mist py-8 pb-32 md:py-16 lg:pb-16">
      <div className="container-page">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Continue shopping
        </Link>

        {/* Mobile: collapsible summary above the form */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((open) => !open)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Order summary · {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="mt-1 block font-display text-xl font-extrabold tracking-tight text-ink">
                {formatBDT(subtotal)}
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-ink transition-transform duration-300 ${
                summaryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {summaryOpen && (
            <ul className="divide-y divide-line border-t border-line px-5">{lineItems}</ul>
          )}
        </div>

        <div className="mt-5 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-line bg-white p-5 md:p-8"
            >
              <h1 className="display-md text-ink">Checkout</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Fill in your details, review the summary, then send the whole order to us on
                WhatsApp to confirm stock and delivery.
              </p>

              <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Full name</span>
                  <input
                    ref={nameRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    enterKeyHint="next"
                    required
                    value={details.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="e.g. Rakib Hasan"
                    className={fieldClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>Phone number</span>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    required
                    value={details.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="01XXX-XXXXXX"
                    className={fieldClass}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Delivery address</span>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    enterKeyHint="next"
                    value={details.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="House, road, area"
                    className={fieldClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>City / district</span>
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={details.city}
                    onChange={(event) => update("city", event.target.value)}
                    placeholder="e.g. Dhaka"
                    className={fieldClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>Payment preference</span>
                  <select
                    name="payment"
                    value={payment}
                    onChange={(event) => setPayment(event.target.value)}
                    className={fieldClass}
                  >
                    {paymentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Note for the shop (optional)</span>
                  <textarea
                    name="note"
                    rows={3}
                    value={details.note}
                    onChange={(event) => update("note", event.target.value)}
                    placeholder="Delivery timing, gift note, special request…"
                    className="mt-2 w-full resize-none rounded-xl border border-line bg-mist px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white sm:text-sm"
                  />
                </label>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-mist px-4 py-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                <p className="text-xs leading-relaxed text-muted">
                  This is a demo checkout. Nothing is submitted to a server and no payment is
                  processed here — the order is completed in a WhatsApp conversation with the shop.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-24 rounded-3xl border border-line bg-white p-6 md:p-8"
            >
              <h2 className="eyebrow text-muted">Order summary</h2>

              <ul className="mt-5 divide-y divide-line">{lineItems}</ul>

              <dl className="mt-4 space-y-2.5 border-t border-line pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Items</dt>
                  <dd className="font-semibold text-ink">{itemCount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold text-ink">{formatBDT(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-semibold text-ink">Confirmed by shop</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <dt className="eyebrow text-ink">Total</dt>
                  <dd className="font-display text-2xl font-extrabold tracking-tight text-ink">
                    {formatBDT(subtotal)}
                  </dd>
                </div>
              </dl>

              <a
                href={orderHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => showToast("Opening WhatsApp with your order")}
                className="btn-base btn-accent mt-6 h-13 w-full rounded-xl text-xs"
              >
                <MessageCircle className="h-4 w-4" />
                Send order on WhatsApp
              </a>

              {!isValid && (
                <p className="mt-3 text-center text-xs text-muted">
                  Add your name and phone number so the shop can confirm the order.
                </p>
              )}

              <p className="mt-4 text-center text-[11px] leading-relaxed text-muted/80">
                No payment is taken on this page. The shop confirms availability, delivery charge
                and payment directly with you.
              </p>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Mobile: sticky order bar keeps the total and CTA reachable */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <p className="eyebrow text-muted">Total</p>
            <p className="font-display text-lg font-extrabold tracking-tight text-ink">
              {formatBDT(subtotal)}
            </p>
          </div>
          {isValid ? (
            <a
              href={orderHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => showToast("Opening WhatsApp with your order")}
              className="btn-base btn-accent h-12 flex-1 rounded-xl text-xs"
            >
              <MessageCircle className="h-4 w-4" />
              Send on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                nameRef.current?.focus();
                nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="btn-base btn-primary h-12 flex-1 rounded-xl text-xs"
            >
              Add your details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
