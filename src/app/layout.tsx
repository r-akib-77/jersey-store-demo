import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickView from "@/components/ProductQuickView";
import SearchOverlay from "@/components/SearchOverlay";
import Toast from "@/components/Toast";
import { UIProvider } from "@/context/UIContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { shopConfig } from "@/config/shop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jersey-house.pages.dev"),
  title: {
    default: `${shopConfig.name} — Premium Football Jerseys`,
    template: `%s | ${shopConfig.name}`,
  },
  description: shopConfig.description,
  keywords: [
    "football jerseys",
    "club jerseys",
    "national team jerseys",
    "retro jerseys",
    "Jersey House",
  ],
  openGraph: {
    title: `${shopConfig.name} — Premium Football Jerseys`,
    description: shopConfig.description,
    type: "website",
    images: ["/images/photos/hero.jpg"],
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-white"
        >
          Skip to content
        </a>

        <UIProvider>
          <WishlistProvider>
            <CartProvider>
              <AnnouncementBar />
              <Navbar />
              <main id="main">{children}</main>
              <Footer />
              <CartDrawer />
              <ProductQuickView />
              <SearchOverlay />
              <Toast />
            </CartProvider>
          </WishlistProvider>
        </UIProvider>
      </body>
    </html>
  );
}
