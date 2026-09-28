import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { categories } from "@/data/categories";
import type { Dish } from "@/data/types";

interface RelatedDishesProps {
  dishes: Dish[];
}

export function RelatedDishes({ dishes }: RelatedDishesProps) {
  if (dishes.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-10">
        <h3 className="font-display text-2xl font-black text-on-surface uppercase italic">
          Related Quests
        </h3>
        <Link
          href="/search"
          className="font-label text-xs font-bold uppercase tracking-widest text-zen-gold hover:opacity-75 transition-opacity"
        >
          Xem Tất Cả
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dishes.map((dish) => {
          const cat = categories.find((c) => c.id === dish.categoryId);
          const badge = dish.isNew
            ? "Mới"
            : dish.isTrending
            ? "Hot"
            : cat?.name ?? dish.cuisine;

          return (
            <Link
              key={dish.id}
              href={`/dish/${dish.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden relative border border-zen-gold/20 mb-4">
                <Image
                  src={dish.coverImage}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {badge && (
                  <div className="absolute top-4 left-4 bg-zen-gold text-white px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider">
                    {badge}
                  </div>
                )}
              </div>

              <h4 className="font-display text-lg text-on-surface uppercase group-hover:text-zen-gold transition-colors leading-tight">
                {dish.name}
              </h4>

              <div className="flex items-center gap-2 mt-1.5">
                <Clock size={14} className="text-zen-gold" />
                <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase">
                  {dish.averageCookTime} Phút
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
