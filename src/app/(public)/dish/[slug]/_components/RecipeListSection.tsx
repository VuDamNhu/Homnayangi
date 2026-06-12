import { BookOpen } from "lucide-react";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import type { Recipe } from "@/data/types";

interface RecipeListSectionProps {
  recipes: Recipe[];
  dishSlug: string;
}

export function RecipeListSection({ recipes }: RecipeListSectionProps) {
  return (
    <section>
      {/* Section heading */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3 mb-0.5">
            <span className="font-label text-[9px] uppercase tracking-[0.4em] text-zen-gold">
              {recipes.length > 0 ? `${recipes.length} công thức` : "Chưa có công thức"}
            </span>
            <div className="h-px w-10 bg-zen-gold/30" />
          </div>
          <h2 className="font-display text-2xl font-black italic uppercase text-on-surface tracking-tight">
            Công Thức Chế Biến
          </h2>
        </div>
      </div>

      {recipes.length === 0 ? (
        <EmptyRecipes />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                slug: recipe.slug,
                title: recipe.title,
                description: recipe.description,
                coverImage: recipe.coverImage,
                dishName: recipe.dishName,
                totalTime: recipe.totalTime,
                calories: recipe.nutrition.calories,
                xpReward: recipe.xpReward,
                difficulty: recipe.difficulty,
                source: recipe.source,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyRecipes() {
  return (
    <div className="manga-border bg-zen-paper px-8 py-14 flex flex-col items-center text-center gap-5">
      <div className="w-12 h-12 border border-zen-gold/20 flex items-center justify-center">
        <BookOpen size={22} className="text-zen-gold/40" />
      </div>
      <div className="space-y-2">
        <p className="font-display text-base font-black uppercase italic text-on-surface-variant">
          Đang Cập Nhật
        </p>
        <p className="font-body text-sm text-on-surface-variant/60 leading-relaxed max-w-xs">
          Công thức cho món này đang được các đầu bếp cộng đồng chuẩn bị. Ghé lại sớm nhé!
        </p>
      </div>
    </div>
  );
}
