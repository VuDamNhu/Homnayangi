import { cn } from "@/lib/utils";

interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface NutritionCardProps {
  data: NutritionData;
  className?: string;
}

const macros = [
  { key: "calories" as const, label: "Calories", unit: "kcal" },
  { key: "protein" as const, label: "Protein", unit: "g" },
  { key: "fat" as const, label: "Chất béo", unit: "g" },
  { key: "carbs" as const, label: "Carbs", unit: "g" },
];

export function NutritionCard({ data, className }: NutritionCardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 manga-border bg-zen-gold-muted",
        className
      )}
    >
      {macros.map((macro, i) => (
        <div
          key={macro.key}
          className={cn(
            "flex flex-col items-center justify-center py-5 px-3 text-center",
            i < macros.length - 1 && "border-r border-zen-ink/15"
          )}
        >
          <span className="font-mono text-xl font-bold text-zen-ink leading-none">
            {data[macro.key]}
          </span>
          <span className="font-label text-[9px] uppercase tracking-[0.1em] text-zen-gold mt-1">
            {macro.unit}
          </span>
          <span className="font-label text-[9px] uppercase tracking-[0.1em] text-on-surface-variant mt-0.5">
            {macro.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Placeholder version — shows dashes while data loads */
export function NutritionCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 manga-border bg-zen-gold-muted animate-pulse",
        className
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center justify-center py-5 px-3 gap-2",
            i < 3 && "border-r border-zen-ink/15"
          )}
        >
          <div className="h-5 w-10 bg-zen-ink/10 rounded-none" />
          <div className="h-2 w-8 bg-zen-ink/10 rounded-none" />
        </div>
      ))}
    </div>
  );
}
