import type { RecipeIngredient } from "@/data/types";

interface IngredientsLootProps {
  ingredients: RecipeIngredient[];
}

export function IngredientsLoot({ ingredients }: IngredientsLootProps) {
  return (
    <div className="bg-zen-paper px-8 py-10 md:px-10 md:py-12 border border-zen-gold/20 relative overflow-hidden">
      {/* Background decoration bubble */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-zen-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <h3 className="font-display text-2xl font-black text-on-surface uppercase italic mb-8 inline-block gold-underline">
        The Loot
      </h3>

      {ingredients.length === 0 ? (
        <p className="font-body text-sm text-on-surface-variant/60 italic">
          Nguyên liệu đang được cập nhật...
        </p>
      ) : (
        <ul className="space-y-5">
          {ingredients.map((ing) => (
            <li
              key={`${ing.ingredientId}-${ing.name}`}
              className="flex justify-between items-center group"
            >
              <span className="font-body text-on-surface-variant group-hover:text-zen-gold transition-colors">
                {ing.name}
                {ing.note && (
                  <span className="text-xs opacity-60 ml-1">({ing.note})</span>
                )}
                {ing.isOptional && (
                  <span className="text-[10px] ml-1.5 font-label uppercase tracking-wide text-zen-gold/60">
                    tuỳ chọn
                  </span>
                )}
              </span>
              <span className="text-zen-gold font-label text-[10px] font-bold border-b border-zen-gold/30 ml-4 whitespace-nowrap shrink-0">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
