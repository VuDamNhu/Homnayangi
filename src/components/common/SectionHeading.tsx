import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  /** Renders the title with a gold highlight underline */
  goldUnderline?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionHref,
  goldUnderline = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h2
          className={cn(
            "font-display text-2xl font-black uppercase italic text-on-surface",
            goldUnderline && "gold-underline inline-block"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="font-label text-xs uppercase tracking-[0.15em] text-zen-gold hover:opacity-75 transition-opacity shrink-0"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
