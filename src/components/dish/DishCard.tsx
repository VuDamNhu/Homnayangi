import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DishCardData {
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  categoryName?: string;
  averageCookTime: number;
  calories: number;
  xpReward: number;
  rank?: string;
  tags?: string[];
}

interface DishCardProps {
  dish: DishCardData;
  className?: string;
}

/**
 * Standard dish card — manga border + hard shadow.
 * Used in grids, search results, related sections.
 */
export function DishCard({ dish, className }: DishCardProps) {
  return (
    <Link href={`/dish/${dish.slug}`} className="block group">
      <article
        className={cn(
          "manga-border manga-shadow manga-shadow-hover bg-zen-paper overflow-hidden transition-all duration-200",
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative h-56 overflow-hidden border-b-2 border-zen-ink">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
          />
          {dish.rank && dish.rank !== "normal" && (
            <div className="absolute top-3 left-3 z-10 bg-zen-gold text-white font-label text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 manga-border border-white">
              {rankLabel(dish.rank)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {dish.categoryName && (
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              {dish.categoryName}
            </span>
          )}

          {/* Title */}
          <h3 className="font-display text-lg font-black uppercase mt-1 group-hover:text-zen-gold transition-colors line-clamp-2 leading-tight">
            {dish.name}
          </h3>

          {/* Description */}
          <p className="font-body text-sm text-on-surface-variant/80 mt-2 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Meta footer */}
          <div className="mt-4 pt-4 border-t border-dashed border-zen-gold/25 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-label text-[11px] text-on-surface-variant">
                <Clock size={13} className="text-zen-gold" />
                {dish.averageCookTime}m
              </span>
              <span className="flex items-center gap-1.5 font-label text-[11px] text-on-surface-variant">
                <Flame size={13} className="text-zen-gold" />
                {dish.calories} kcal
              </span>
            </div>
            <span className="font-label text-xs font-bold text-zen-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              XP +{dish.xpReward}
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function rankLabel(rank: string) {
  const map: Record<string, string> = {
    master: "Master",
    elite: "Elite",
    "s-class": "S-Class",
  };
  return map[rank] ?? rank;
}
