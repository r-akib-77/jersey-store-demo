import { shopConfig } from "@/config/shop";
import type { CartItem, CustomerDetails, Product } from "@/types";
import { formatBDT } from "@/lib/format";

/** Builds a WhatsApp message for a single product (quick view / product card). */
export function buildProductMessage(product: Product, size: string, quantity: number): string {
  const lines = [
    `Hi ${shopConfig.name}! I'd like to order:`,
    "",
    `• ${product.name}`,
    `• Category: ${product.categoryLabel}`,
    `• Size: ${size}`,
    `• Quantity: ${quantity}`,
    `• Price: ${formatBDT(product.price)} each`,
    `• Line total: ${formatBDT(product.price * quantity)}`,
    "",
    `Total: ${formatBDT(product.price * quantity)}`,
  ];
  return lines.join("\n");
}

/** Builds a WhatsApp message for the whole basket. */
export function buildCartMessage(
  items: CartItem[],
  subtotal: number,
  customer?: CustomerDetails,
): string {
  const lines: string[] = [`Hi ${shopConfig.name}! I'd like to place an order:`];

  if (customer?.name) lines.push(`Name: ${customer.name}`);
  if (customer?.phone) lines.push(`Phone: ${customer.phone}`);
  if (customer?.address) lines.push(`Address: ${customer.address}`);
  if (customer?.city) lines.push(`City: ${customer.city}`);

  lines.push("", "Order details:");

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} — Size ${item.size} × ${item.quantity} — ${formatBDT(
        item.price * item.quantity,
      )}`,
    );
  });

  lines.push("", `Subtotal: ${formatBDT(subtotal)}`);
  lines.push("Delivery charge to be confirmed by the shop.");

  if (customer?.note) {
    lines.push("", `Note: ${customer.note}`);
  }

  lines.push("", "Please confirm availability and delivery. Thank you!");
  return lines.join("\n");
}

/** Builds the WhatsApp deep link for a given message. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${shopConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
