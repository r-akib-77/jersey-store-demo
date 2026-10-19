interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: React.ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  action,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`flex flex-col gap-6 ${
        align === "center" ? "items-center text-center" : "items-start"
      } md:flex-row md:items-end md:justify-between`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-accent-strong" aria-hidden="true" />
          <p className={`eyebrow ${isDark ? "text-accent" : "text-muted"}`}>{eyebrow}</p>
        </div>
        <h2
          className={`display-lg mt-4 ${isDark ? "text-white" : "text-ink"}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-xl text-sm leading-relaxed md:text-base ${
              isDark ? "text-white/60" : "text-muted"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
