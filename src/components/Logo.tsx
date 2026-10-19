import Link from "next/link";

export function Logo({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Jersey House — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
          inverted ? "bg-white" : "border border-line bg-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="" className="h-8 w-8 object-contain" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[15px] font-extrabold uppercase leading-none tracking-[0.2em] ${
            inverted ? "text-white" : "text-ink"
          }`}
        >
          Jersey
        </span>
        <span
          className={`font-display text-[15px] font-extrabold uppercase leading-none tracking-[0.2em] ${
            inverted ? "text-accent" : "text-muted"
          }`}
        >
          House
        </span>
      </span>
    </Link>
  );
}

export default Logo;
