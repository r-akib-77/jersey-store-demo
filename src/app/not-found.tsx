import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="display-lg mt-4 text-ink">Off target</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        That page has been substituted. Let&apos;s get you back to the jerseys.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-base btn-primary h-12 rounded-full px-8 text-xs">
          Back home
        </Link>
        <Link href="/shop" className="btn-base btn-outline h-12 rounded-full border-ink px-8 text-xs">
          Shop jerseys
        </Link>
      </div>
    </div>
  );
}
