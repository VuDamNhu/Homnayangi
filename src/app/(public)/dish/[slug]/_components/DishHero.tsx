import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import type { Dish } from "@/data/types";

const rankMap: Record<string, { badge: string; level: number }> = {
  "s-class": { badge: "S-Class Meal", level: 42 },
  elite: { badge: "Elite Meal", level: 28 },
  master: { badge: "Master Meal", level: 15 },
  normal: { badge: "Standard Meal", level: 5 },
};

interface DishHeroProps {
  dish: Dish;
  categoryName?: string;
  categorySlug?: string;
}

export function DishHero({ dish }: DishHeroProps) {
  const rm = rankMap[dish.rank] ?? { badge: dish.rank, level: 10 };

  return (
    <section className="relative mb-20 md:mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* ── Left: Image Panel ────────────────────────────────────────────── */}
        <div className="lg:col-span-7 relative group">
          <div className="relative overflow-hidden manga-border-gold manga-shadow bg-surface-container">
            <Image
              src={dish.coverImage}
              alt={dish.name}
              width={900}
              height={600}
              priority
              className="w-full h-[360px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Sparkle particles */}
            <div className="sparkle-particle absolute w-6 h-6 top-1/4 left-1/4 pointer-events-none" />
            <div
              className="sparkle-particle absolute w-4 h-4 top-1/3 left-1/2 pointer-events-none"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="sparkle-particle absolute w-8 h-8 bottom-1/3 right-1/3 pointer-events-none"
              style={{ animationDelay: "1.2s" }}
            />

            {/* Rank badge */}
            <div
              className="absolute top-5 left-5 -rotate-2 bg-zen-gold text-white font-label font-bold px-4 py-1.5 uppercase tracking-widest text-[10px]"
              style={{ border: "2px solid white", boxShadow: "3px 3px 0px 0px #1b1b1e" }}
            >
              Rank: {rm.badge}
            </div>
          </div>
        </div>

        {/* ── Right: Title & Meta ──────────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-7">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-zen-gold font-bold mb-2 block">
              Level {rm.level} Mastery
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-on-surface uppercase italic leading-none mb-5">
              {dish.name}
            </h1>
            <p className="font-body text-on-surface-variant text-[15px] leading-relaxed italic border-l-2 border-zen-gold pl-5">
              &ldquo;{dish.description}&rdquo;
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-zen-gold/30 p-5 bg-zen-paper flex flex-col items-center justify-center gap-1.5 shadow-sm">
              <Clock size={20} className="text-zen-gold" />
              <span className="font-label text-xs font-bold uppercase tracking-widest">
                {dish.averageCookTime} Phút
              </span>
            </div>
            <div className="border border-zen-gold/30 p-5 bg-zen-paper flex flex-col items-center justify-center gap-1.5 shadow-sm">
              <Flame size={20} className="text-zen-gold" />
              <span className="font-label text-xs font-bold uppercase tracking-widest">
                {dish.nutrition.calories} Kcal
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full py-5 bg-zen-gold text-white font-display text-xl uppercase italic tracking-wider manga-border manga-shadow transition-all active:scale-95 cursor-pointer hover:brightness-105"
          >
            Bắt Đầu Nấu!
          </button>
        </div>
      </div>
    </section>
  );
}
