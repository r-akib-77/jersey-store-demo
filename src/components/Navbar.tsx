"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { shopConfig } from "@/config/shop";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { openSearch } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isShop = pathname === "/shop";

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-line shadow-[0_8px_30px_-24px_rgba(8,8,8,0.55)]" : "border-transparent"
      }`}
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 md:h-[76px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="-ml-2 grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-mist lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo />
          </div>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {shopConfig.navLinks.map((link) => {
                const active = link.href === "/shop" ? isShop : pathname === link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`group relative inline-block py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                        active ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-accent-strong transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search jerseys"
              className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-mist"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative hidden h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-mist sm:grid"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag, ${itemCount} items`}
              className="relative grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-mist"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
