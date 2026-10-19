import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The jerseys you have saved at Jersey House.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
