import Link from "next/link";
import { brandWordmark, shopConfig } from "@/config/shop";

export function Logo({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  const [primary, secondary] = brandWordmark();

  return (
    <Link
      href="/"
      aria-label={`${shopConfig.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105 ${
          inverted ? "bg-white" : "border border-line bg-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shopConfig.logo}
          alt=""
          className="h-8 w-8 object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        {/* Under 400px the lockup collapses to the mark only — 3x44px icon taps
            plus the full stacked wordmark cannot share 360px. The brand name
            remains visible in the mobile menu, footer and page title. */}
        <span
          className={`hidden min-[400px]:block font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.18em] sm:tracking-[0.2em] sm:text-[15px] ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          {primary}
        </span>
        {secondary && (
          <span
            className={`hidden min-[400px]:mt-1 min-[400px]:block sm:mt-0.5 font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.18em] sm:tracking-[0.2em] sm:text-[15px] ${
              inverted ? "text-accent" : "text-muted"
            }`}
          >
            {secondary}
          </span>
        )}
      </span>
    </Link>
  );
}

export default Logo;
