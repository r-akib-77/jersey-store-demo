"use client";

interface SizeSelectorProps {
  sizes: string[];
  value: string;
  onChange: (size: string) => void;
  size?: "sm" | "md";
  idPrefix?: string;
}

export default function SizeSelector({
  sizes,
  value,
  onChange,
  size = "md",
  idPrefix = "size",
}: SizeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select a size"
      className="flex flex-wrap items-center gap-1.5"
    >
      {sizes.map((sizeOption) => {
        const active = sizeOption === value;
        return (
          <button
            key={sizeOption}
            id={`${idPrefix}-${sizeOption}`}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(sizeOption)}
            className={`rounded-lg border font-semibold transition-all duration-200 ${
              size === "sm" ? "h-8 min-w-8 px-2 text-[11px]" : "h-10 min-w-10 px-3 text-xs"
            } ${
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink/70 hover:border-ink hover:text-ink"
            }`}
          >
            {sizeOption}
          </button>
        );
      })}
    </div>
  );
}
