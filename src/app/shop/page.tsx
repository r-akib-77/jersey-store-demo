import { Suspense } from "react";
import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Shop all jerseys",
  description:
    "Browse the full collection — club jerseys, national team kits, retro classics and training wear.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page flex min-h-[60vh] items-center justify-center py-24">
          <p className="eyebrow text-muted">Loading jerseys…</p>
        </div>
      }
    >
      <ShopView />
    </Suspense>
  );
}
