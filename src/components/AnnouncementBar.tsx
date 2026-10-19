export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] bg-ink text-white">
      <div className="container-page flex h-9 items-center justify-center gap-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <p className="truncate text-center text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-[11px]">
          Your club. Your colors. Your jersey.
        </p>
        <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:block" aria-hidden="true" />
      </div>
    </div>
  );
}
