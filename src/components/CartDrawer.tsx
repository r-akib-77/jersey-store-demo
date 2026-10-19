"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { formatBDT } from "@/lib/format";
import { buildCartMessage, whatsappUrl } from "@/lib/whatsapp";
import QuantityStepper from "@/components/QuantityStepper";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isCartOpen, closeCart, removeItem, updateQuantity } = useCart();
  const { showToast } = useUI();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          key="cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[85]"
        >
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={closeCart} />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-extrabold uppercase tracking-[0.16em] text-ink">
                Your bag
                <span className="ml-2 text-sm font-semibold tracking-normal text-muted">
                  ({itemCount})
                </span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink transition-colors hover:bg-mist"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-mist">
                  <ShoppingBag className="h-6 w-6 text-muted" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-ink">
                  Your bag is empty
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Add a jersey to your bag and it will stay here — even after you close the page.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="btn-base btn-primary mt-6 h-11 rounded-full px-7 text-xs"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <Link
                        href="/shop"
                        onClick={closeCart}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-mist"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                            <p className="mt-0.5 text-xs text-muted">Size {item.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              removeItem(item.key);
                              showToast("Item removed from bag");
                            }}
                            aria-label={`Remove ${item.name} from bag`}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-mist hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <QuantityStepper
                            size="sm"
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.key, value)}
                            label={`Quantity for ${item.name}`}
                          />
                          <span className="text-sm font-bold text-ink">
                            {formatBDT(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-line bg-mist px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-muted">Subtotal</span>
                    <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                      {formatBDT(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Delivery charge is confirmed by the shop when your order is placed.
                  </p>

                  <div className="mt-4 grid gap-2.5">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="btn-base btn-primary h-12 rounded-xl text-xs"
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={whatsappUrl(buildCartMessage(items, subtotal))}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-base btn-outline h-12 rounded-xl border-ink text-xs"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Order on WhatsApp
                    </a>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
