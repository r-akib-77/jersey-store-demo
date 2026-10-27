"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useUIActions } from "@/context/UIContext";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
  variant?: "icon" | "icon-light";
}

export default function WishlistButton({
  productId,
  productName,
  className = "",
  variant = "icon",
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const { showToast } = useUIActions();
  const active = has(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
        showToast(active ? "Removed from wishlist" : "Saved to wishlist");
      }}
      className={`grid place-items-center rounded-full transition-all duration-200 ${
        variant === "icon-light"
          ? "h-9 w-9 bg-white/85 text-ink backdrop-blur hover:bg-white"
          : "h-9 w-9 bg-white/85 text-ink backdrop-blur hover:bg-white"
      } ${active ? "text-ink" : "text-ink/70"} ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${active ? "fill-accent-strong" : ""}`}
        strokeWidth={2}
      />
    </button>
  );
}
