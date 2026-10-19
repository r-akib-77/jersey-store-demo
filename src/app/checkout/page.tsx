import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and send it to the shop on WhatsApp.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
