import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "ink" | "skewed";
  className?: string;
}

/**
 * Manga-style badge/chip — sharp-edged, no border-radius.
 * variant="skewed" applies a -12deg transform for the diagonal effect seen in design.
 */
export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block font-label text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1",
        variant === "default" &&
          "bg-surface-container text-on-surface-variant manga-border",
        variant === "gold" && "bg-zen-gold text-white manga-border-gold",
        variant === "ink" && "bg-zen-ink text-zen-cream manga-border",
        variant === "skewed" && "-skew-x-12 bg-zen-gold text-zen-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
