"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, ArrowRight } from "lucide-react";
import { dishes } from "@/data/dishes";
import { categories } from "@/data/categories";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import type { Dish } from "@/data/types";
import type { DietType } from "@/config/constants";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIET_TABS: { label: string; value: DietType }[] = [
  { label: "Thường ngày", value: "normal" },
  { label: "Ăn chay", value: "vegetarian" },
  { label: "Ăn kiêng", value: "diet" },
];

const DIFFICULTY_OPTIONS = [
  { label: "Novice Cook", value: "easy" },
  { label: "Kitchen Warrior", value: "normal" },
  { label: "Master Chef", value: "hard" },
  { label: "Expert", value: "expert" },
];

const CUISINE_OPTIONS = ["Vietnamese", "Japanese", "Korean", "Italian"];

const ITEMS_PER_PAGE = 6;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCategoryName(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.name ?? "";
}

function getFeaturedBadge(dish: Dish): string | undefined {
  if (dish.isNew) return "NEW!";
  if (dish.isTrending) return "HOT!";
  if (dish.isFeatured) return "TOP";
  return undefined;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FeaturedCard({ dish }: { dish: Dish }) {
  const badge = getFeaturedBadge(dish);
  return (
    <Link href={`/dish/${dish.slug}`} className="block group md:col-span-2">
      <article className="manga-border manga-shadow manga-shadow-hover bg-zen-paper overflow-hidden transition-all duration-200">
        <div className="relative h-72 md:h-80 overflow-hidden">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zen-ink/90 via-zen-ink/20 to-transparent" />

          {badge && (
            <div className="absolute top-4 left-4 z-10 starburst w-20 h-20 bg-zen-gold flex items-center justify-center manga-border border-white animate-pulse">
              <span className="font-display text-white text-xs font-black uppercase rotate-12 text-center leading-none">
                {badge}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-5 right-5 z-10">
            <span className="skew-badge inline-block bg-zen-gold text-zen-ink font-label text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-2">
              {dish.rank === "s-class" ? "LEGENDARY RANK" : dish.rank?.toUpperCase()}
            </span>
            <h3 className="font-display text-white text-3xl md:text-4xl font-black uppercase italic leading-tight group-hover:text-amber-200 transition-colors">
              {dish.name}
            </h3>
          </div>
        </div>

        <div className="relative p-5 flex items-center justify-between">
          <div className="halftone absolute inset-0" />
          <div className="flex items-center gap-5 relative z-10">
            <span className="flex items-center gap-1.5 font-label text-sm font-bold">
              <Clock size={15} className="text-zen-gold" />
              {dish.averageCookTime}m
            </span>
            <span className="flex items-center gap-1.5 font-label text-sm font-bold">
              <Flame size={15} className="text-zen-gold" />
              {dish.nutrition.calories} kcal
            </span>
          </div>
          <span className="manga-border px-5 py-2 font-label text-xs font-bold uppercase tracking-[0.1em] relative z-10 hover:bg-zen-gold/10 transition-colors">
            View Scroll
          </span>
        </div>
      </article>
    </Link>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const categoryName = getCategoryName(dish.categoryId);
  return (
    <Link href={`/dish/${dish.slug}`} className="block group">
      <article className="manga-border manga-shadow manga-shadow-hover bg-zen-paper overflow-hidden transition-all duration-200">
        <div className="relative h-56 overflow-hidden border-b-2 border-zen-ink">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
          />
        </div>
        <div className="p-5">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            {categoryName}
          </span>
          <h3 className="font-display text-lg font-black uppercase mt-1 group-hover:text-zen-gold transition-colors line-clamp-2 leading-tight">
            {dish.name}
          </h3>
          <p className="font-body text-sm text-on-surface-variant/80 mt-2 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
          <div className="mt-4 pt-4 border-t border-dashed border-zen-gold/25 flex items-center justify-between">
            <span className="font-label text-sm font-bold text-zen-gold">
              XP +{dish.xpReward}
            </span>
            <ArrowRight
              size={16}
              className="text-on-surface-variant group-hover:translate-x-1.5 transition-transform"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SearchView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialDiet = (searchParams.get("diet") as DietType | null) ?? "normal";

  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [activeDiet, setActiveDiet] = useState<DietType>(initialDiet);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(90);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleDifficulty = (val: string) => {
    setDifficulties((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const toggleCuisine = (val: string) => {
    setCuisines((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDifficulties([]);
    setCuisines([]);
    setMaxTime(90);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return dishes.filter((dish) => {
      if (dish.dietType !== activeDiet) return false;

      if (localQuery) {
        const q = localQuery.toLowerCase();
        const match =
          dish.name.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q) ||
          dish.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      if (difficulties.length > 0 && !difficulties.includes(dish.difficulty)) return false;
      if (cuisines.length > 0 && !cuisines.includes(dish.cuisine)) return false;
      if (dish.averageCookTime > maxTime) return false;

      return true;
    });
  }, [localQuery, activeDiet, difficulties, cuisines, maxTime]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [featured, ...rest] = paginated;

  return (
    <main className="max-w-screen-2xl mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row gap-10">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="manga-border p-6 manga-shadow bg-zen-paper md:sticky md:top-24">
          <h2 className="font-display text-2xl font-black mb-6 border-b-2 border-zen-gold/30 pb-3">
            Refine Results
          </h2>

          <div className="space-y-8">
            {/* Quest Level */}
            <section>
              <h3 className="font-label text-[11px] uppercase tracking-[0.4em] text-zen-gold mb-4">
                Quest Level
              </h3>
              <div className="space-y-3">
                {DIFFICULTY_OPTIONS.map((f) => (
                  <label
                    key={f.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={difficulties.includes(f.value)}
                      onChange={() => toggleDifficulty(f.value)}
                      className="w-4 h-4 manga-border rounded-none bg-transparent cursor-pointer accent-zen-gold"
                    />
                    <span className="font-label text-sm group-hover:text-zen-gold transition-colors">
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Cuisine Realm */}
            <section>
              <h3 className="font-label text-[11px] uppercase tracking-[0.4em] text-zen-gold mb-4">
                Cuisine Realm
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {CUISINE_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={cn(
                      "manga-border py-2 px-1 font-label text-[10px] uppercase tracking-widest transition-all manga-shadow-hover",
                      cuisines.includes(c)
                        ? "bg-zen-gold/20 text-zen-gold"
                        : "hover:bg-surface-container text-on-surface-variant"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            {/* Time Pressure */}
            <section>
              <h3 className="font-label text-[11px] uppercase tracking-[0.4em] text-zen-gold mb-4">
                Time Pressure
              </h3>
              <input
                type="range"
                min={15}
                max={90}
                value={maxTime}
                onChange={(e) => {
                  setMaxTime(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1 cursor-pointer accent-zen-gold"
              />
              <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant">
                <span>15 MIN</span>
                <span className="text-zen-gold font-bold">{maxTime} MIN</span>
                <span>90 MIN</span>
              </div>
            </section>

            <button
              onClick={resetFilters}
              className="w-full py-3 bg-zen-ink text-zen-cream font-label text-sm uppercase tracking-[0.15em] manga-border manga-shadow manga-shadow-hover transition-all active:scale-95"
            >
              RESET ALL
            </button>
          </div>
        </div>
      </aside>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="flex-grow min-w-0">
        {/* Search heading */}
        <div className="mb-8 relative pl-5">
          <div className="absolute left-0 top-0 w-1 h-full bg-zen-gold/40" />
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic leading-none">
            {localQuery ? (
              <>
                Search:{" "}
                <span className="text-zen-gold/80">{localQuery}</span>
              </>
            ) : (
              "All Quests"
            )}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="font-label text-xs text-on-surface-variant tracking-[0.2em] uppercase">
              {filtered.length} QUESTS FOUND IN THE ARCHIVES
            </p>
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery("");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 font-label text-[10px] uppercase tracking-widest text-zen-gold hover:text-zen-ink transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Inline search bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm món ăn..."
            className="w-full manga-border bg-transparent px-4 py-3 pr-12 font-label text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-zen-gold transition-colors"
          />
          <Search
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
        </div>

        {/* Diet tabs */}
        <div className="flex gap-0 md:gap-2 mb-10 border-b-2 border-zen-ink/10 overflow-x-auto">
          {DIET_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveDiet(tab.value);
                setCurrentPage(1);
              }}
              className={cn(
                "px-5 md:px-6 py-3 font-label text-xs md:text-sm uppercase tracking-[0.15em] border-b-4 -mb-px transition-all whitespace-nowrap shrink-0",
                activeDiet === tab.value
                  ? "border-zen-gold text-zen-gold"
                  : "border-transparent text-on-surface-variant hover:text-zen-gold"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        {paginated.length === 0 ? (
          <EmptyState
            title="Không tìm thấy món ăn"
            description="Thử từ khoá khác hoặc đổi bộ lọc."
            icon={<Search size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured && <FeaturedCard dish={featured} />}
            {rest.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-16"
          />
        )}
      </div>
    </main>
  );
}
