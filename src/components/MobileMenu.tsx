"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { shopConfig } from "@/config/shop";

const socialIcons = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "TikTok", icon: TikTokIcon },
  { label: "YouTube", icon: YoutubeIcon },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[70] lg:hidden"
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto rounded-b-3xl bg-white pb-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="container-page flex h-16 items-center justify-between">
              <span className="eyebrow text-muted">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-mist"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="container-page" aria-label="Mobile">
              <ul className="border-t border-line">
                {shopConfig.navLinks.map((link) => (
                  <li key={link.label} className="border-b border-line">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 font-display text-2xl font-extrabold uppercase tracking-tight text-ink transition-colors hover:text-accent-strong"
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="container-page mt-8">
              <p className="eyebrow mb-4 text-muted">Shop by category</p>
              <ul className="grid grid-cols-2 gap-3">
                {shopConfig.categoryLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-xl border border-line bg-mist px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="container-page mt-8 flex items-center gap-3">
              {socialIcons.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href={shopConfig.socials.find((social) => social.label === label)?.href ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="container-page mt-8 rounded-2xl bg-ink p-5 text-white">
              <p className="eyebrow text-accent">Order on WhatsApp</p>
              <p className="mt-2 text-sm text-white/70">
                Message us with your jersey, size and quantity — we&apos;ll confirm stock and delivery.
              </p>
              <a
                href={`https://wa.me/${shopConfig.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-accent mt-4 h-11 w-full rounded-full text-xs"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
