import Image from "next/image";
import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DishCardData } from "./DishCard";

interface DishCardFeaturedProps {
  dish: DishCardData;
  badge?: string;
  className?: string;
}

/**
 * Wide "bento" featured card — image with gradient overlay and title on top.
 * Spans 2 columns in the bento grid.
 */
export function DishCardFeatured({
  dish,
  badge,
  className,
}: DishCardFeaturedProps) {
  return (
    <Link href={`/dish/${dish.slug}`} className="block group md:col-span-2">
      <article
        className={cn(
          "manga-border manga-shadow manga-shadow-hover bg-zen-paper overflow-hidden transition-all duration-200",
          className
        )}
      >
        {/* Hero Image */}
        <div className="relative h-72 md:h-80 overflow-hidden">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zen-ink/90 via-zen-ink/20 to-transparent" />

          {/* Starburst badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-10 starburst w-16 h-16 bg-zen-gold flex items-center justify-center manga-border border-white animate-pulse">
              <span className="font-display text-white text-[10px] font-black uppercase rotate-12 text-center leading-none">
                {badge}
              </span>
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <span className="skew-badge inline-block bg-zen-gold text-zen-ink font-label text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-2">
              {dish.categoryName ?? "Featured"}
            </span>
            <h3 className="font-display text-white text-3xl md:text-4xl font-black uppercase italic leading-tight group-hover:text-zen-gold-light transition-colors">
              {dish.name}
            </h3>
          </div>
        </div>

        {/* Meta bar */}
        <div className="relative p-5 flex items-center justify-between">
          <div className="halftone absolute inset-0" />
          <div className="flex items-center gap-5 relative z-10">
            <span className="flex items-center gap-1.5 font-label text-sm font-bold">
              <Clock size={15} className="text-zen-gold" />
              {dish.averageCookTime}m
            </span>
            <span className="flex items-center gap-1.5 font-label text-sm font-bold">
              <Flame size={15} className="text-zen-gold" />
              {dish.calories} kcal
            </span>
          </div>
          <span className="manga-border px-5 py-2 font-label text-xs font-bold uppercase tracking-[0.1em] relative z-10 hover:bg-zen-gold/10 transition-colors">
            Xem Công Thức
          </span>
        </div>
      </article>
    </Link>
  );
}
