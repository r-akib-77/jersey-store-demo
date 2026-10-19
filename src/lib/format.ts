import { shopConfig } from "@/config/shop";

/** Formats a number as Bangladeshi taka, e.g. 2450 -> "৳2,450" */
export function formatBDT(amount: number): string {
  return `${shopConfig.currency}${Math.round(amount).toLocaleString(shopConfig.locale)}`;
}

/** Formats a discount percentage, e.g. 13 -> "-13%" */
export function formatDiscount(price: number, compareAtPrice?: number): string | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  const percent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return percent > 0 ? `-${percent}%` : null;
}

/** "3 days" style relative label used on demo content */
export function formatQuantityLabel(quantity: number): string {
  return `${quantity} ${quantity === 1 ? "item" : "items"}`;
}
