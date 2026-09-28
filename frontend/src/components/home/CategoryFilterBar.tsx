"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";

const dietTabs = [
  { label: "Tất Cả", value: "all" },
  { label: "Thường", value: "normal" },
  { label: "Chay", value: "vegetarian" },
  { label: "Ăn Kiêng", value: "diet" },
] as const;

type DietTab = (typeof dietTabs)[number]["value"];

export function CategoryFilterBar() {
  const [activeDiet, setActiveDiet] = useState<DietTab>("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleCategories =
    activeDiet === "all"
      ? categories
      : categories.filter((c) => c.dietType === activeDiet);

  return (
    <div className="border-y-2 border-zen-ink/8 bg-zen-paper sticky top-16 z-40">
      {/* Diet type tabs */}
      <div className="max-w-screen-2xl mx-auto px-5 md:px-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {dietTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveDiet(tab.value);
                setActiveCategory(null);
              }}
              className={cn(
                "shrink-0 font-label text-xs uppercase tracking-[0.15em] px-6 py-4 border-b-2 transition-colors",
                activeDiet === tab.value
                  ? "border-zen-gold text-zen-gold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zen-ink/5" />

      {/* Category chips */}
      <div className="max-w-screen-2xl mx-auto px-5 md:px-10 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* "All" chip */}
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-4 py-1.5 font-label text-[10px] uppercase tracking-[0.12em] border transition-all",
              activeCategory === null
                ? "bg-zen-gold border-zen-gold text-white manga-shadow-sm"
                : "manga-border text-on-surface-variant hover:border-zen-gold hover:text-zen-gold"
            )}
          >
            Tất Cả
          </button>

          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(
                  cat.id === activeCategory ? null : cat.id
                )
              }
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-1.5 font-label text-[10px] uppercase tracking-[0.12em] border transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-zen-gold border-zen-gold text-white manga-shadow-sm"
                  : "manga-border text-on-surface-variant hover:border-zen-gold hover:text-zen-gold"
              )}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
