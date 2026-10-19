"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
}: QuantityStepperProps) {
  const buttonClass =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : "h-10 w-10 rounded-xl";

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-line bg-white ${
        size === "sm" ? "gap-0.5 p-0.5" : "gap-1 p-1"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${buttonClass} grid place-items-center text-ink transition-colors duration-200 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        aria-live="polite"
        aria-label={label}
        className={`min-w-7 text-center font-display font-bold tabular-nums text-ink ${
          size === "sm" ? "text-xs" : "text-sm"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${buttonClass} grid place-items-center text-ink transition-colors duration-200 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
