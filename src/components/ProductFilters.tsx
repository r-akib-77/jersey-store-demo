"use client";

import { motion } from "framer-motion";

export interface FilterOption {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  options: readonly FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ProductFilters({
  options,
  value,
  onChange,
  className = "",
}: ProductFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter products by category"
      className={`hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-ink"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
