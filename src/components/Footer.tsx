import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { shopConfig } from "@/config/shop";

const socialIcons = [
  { label: "Facebook", icon: FacebookIcon, href: shopConfig.socials[0].href },
  { label: "Instagram", icon: InstagramIcon, href: shopConfig.socials[1].href },
  { label: "TikTok", icon: TikTokIcon, href: shopConfig.socials[2].href },
  { label: "YouTube", icon: YoutubeIcon, href: shopConfig.socials[3].href },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shopConfig.logo}
                  alt={`${shopConfig.name} logo`}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="font-display text-lg font-extrabold uppercase leading-none tracking-[0.2em] text-white">
                {shopConfig.name}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {shopConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialIcons.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow text-accent">Shop</h3>
            <ul className="mt-5 space-y-3">
              {shopConfig.shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-accent">Categories</h3>
            <ul className="mt-5 space-y-3">
              {shopConfig.categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-accent">Get in touch</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{shopConfig.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`https://wa.me/${shopConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {shopConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${shopConfig.email}`}
                  className="transition-colors hover:text-white"
                >
                  {shopConfig.email}
                </a>
              </li>
            </ul>
            <a
              href={`https://wa.me/${shopConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-accent mt-6 h-11 w-full rounded-full text-xs"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {shopConfig.policyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/50 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/40">
            © {year} {shopConfig.name}. Demo storefront — product details and contact numbers are
            placeholders.
          </p>
        </div>
      </div>
    </footer>
  );
}
