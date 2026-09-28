import { cn } from "@/lib/utils";

export interface IngredientItem {
  name: string;
  quantity: number;
  unit: string;
  note?: string;
  isOptional?: boolean;
}

interface RecipeIngredientListProps {
  ingredients: IngredientItem[];
  servings?: number;
  className?: string;
}

/**
 * "The Loot" panel from Stitch design.
 * White panel, zen-border, gold title underline, ingredient rows.
 */
export function RecipeIngredientList({
  ingredients,
  servings,
  className,
}: RecipeIngredientListProps) {
  return (
    <div
      className={cn(
        "relative bg-zen-paper p-8 manga-border overflow-hidden",
        className
      )}
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-zen-gold/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Title */}
      <h3 className="font-display text-xl font-black uppercase italic text-on-surface mb-8 inline-block gold-underline">
        Nguyên Liệu
      </h3>

      {/* Servings note */}
      {servings && (
        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-6 -mt-4">
          {servings} khẩu phần
        </p>
      )}

      {/* Ingredient rows */}
      <ul className="space-y-5">
        {ingredients.map((item, i) => (
          <li
            key={i}
            className="flex items-baseline justify-between gap-4 group"
          >
            <span className="font-body text-on-surface-variant group-hover:text-zen-gold transition-colors text-sm">
              {item.name}
              {item.isOptional && (
                <span className="font-label text-[9px] text-on-surface-variant/50 ml-1 uppercase">
                  (tuỳ chọn)
                </span>
              )}
            </span>
            <span className="font-label text-xs font-bold text-zen-gold border-b border-zen-gold/30 uppercase tracking-[0.1em] shrink-0">
              {item.quantity} {item.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
