"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Info, MessageCircle, ShoppingBag } from "lucide-react";
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

  const update = (key: keyof CustomerDetails, value: string) =>
    setDetails((current) => ({ ...current, [key]: value }));

  const isValid = details.name.trim().length > 1 && details.phone.trim().length > 5;

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

  return (
    <div className="bg-mist py-10 md:py-16">
      <div className="container-page">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Continue shopping
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-line bg-white p-6 md:p-8"
            >
              <h1 className="display-md text-ink">Checkout</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Fill in your details, review the summary, then send the whole order to us on
                WhatsApp to confirm stock and delivery.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow text-muted">Full name</span>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="e.g. Rakib Hasan"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow text-muted">Phone number</span>
                  <input
                    type="tel"
                    required
                    value={details.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="01XXX-XXXXXX"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="eyebrow text-muted">Delivery address</span>
                  <input
                    type="text"
                    value={details.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="House, road, area"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow text-muted">City / district</span>
                  <input
                    type="text"
                    value={details.city}
                    onChange={(event) => update("city", event.target.value)}
                    placeholder="e.g. Dhaka"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow text-muted">Payment preference</span>
                  <select
                    value={payment}
                    onChange={(event) => setPayment(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-colors focus:border-ink focus:bg-white"
                  >
                    {paymentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="eyebrow text-muted">Note for the shop (optional)</span>
                  <textarea
                    rows={3}
                    value={details.note}
                    onChange={(event) => update("note", event.target.value)}
                    placeholder="Delivery timing, gift note, special request…"
                    className="mt-2 w-full resize-none rounded-xl border border-line bg-mist px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink focus:bg-white"
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

          <div className="lg:col-span-5">
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-24 rounded-3xl border border-line bg-white p-6 md:p-8"
            >
              <h2 className="eyebrow text-muted">Order summary</h2>

              <ul className="mt-5 divide-y divide-line">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-4">
                    <span className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Size {item.size} · Qty {item.quantity}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-ink">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

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
                href={whatsappUrl(
                  buildCartMessage(
                    items,
                    subtotal,
                    payment === "cod" ? details : { ...details, note: `${details.note}${details.note ? " | " : ""}Payment: ${paymentOptions.find((option) => option.value === payment)?.label}` },
                  ),
                )}
                target="_blank"
                rel="noreferrer"
                onClick={() => showToast("Opening WhatsApp with your order")}
                aria-disabled={!isValid}
                className={`btn-base mt-6 h-13 w-full rounded-xl text-xs ${
                  isValid ? "btn-accent" : "btn-primary opacity-60"
                }`}
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
    </div>
  );
}
