import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  count?: number;
  className?: string;
}

export function SkeletonCard({ count = 1, className }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "manga-border bg-zen-paper overflow-hidden animate-pulse",
            className
          )}
        >
          {/* Image area */}
          <div className="aspect-video bg-surface-high border-b-2 border-zen-ink/10" />
          {/* Content */}
          <div className="p-6 space-y-3">
            <div className="h-2.5 bg-surface-high rounded-none w-1/3" />
            <div className="h-5 bg-surface-high rounded-none w-4/5" />
            <div className="h-3 bg-surface-high rounded-none w-full" />
            <div className="h-3 bg-surface-high rounded-none w-2/3" />
            <div className="pt-3 border-t border-dashed border-zen-gold/20 flex justify-between">
              <div className="h-3 bg-surface-high rounded-none w-16" />
              <div className="h-3 bg-surface-high rounded-none w-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
