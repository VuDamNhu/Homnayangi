"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  X,
  ArrowRight,
  Clock,
  RefrigeratorIcon,
  Flame,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { dishes } from "@/data/dishes";
import { getRecipesByDishId } from "@/data/recipes";
import { cn } from "@/lib/utils";
import type { DietType } from "@/config/constants";
import type { Dish, RecipeIngredient } from "@/data/types";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIET_TABS: { label: string; value: DietType }[] = [
  { label: "Thường ngày", value: "normal" },
  { label: "Ăn chay", value: "vegetarian" },
  { label: "Ăn kiêng", value: "diet" },
];

const RANK_LABELS: Record<string, string> = {
  "s-class": "S-Class Meal",
  elite: "Elite Tier",
  master: "Master Rank",
  normal: "Standard",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeMatch(chips: string[], dish: Dish) {
  const query = chips.map((c) => c.toLowerCase().trim());
  const haystack = [
    dish.name.toLowerCase(),
    dish.description.toLowerCase(),
    ...dish.tags.map((t) => t.toLowerCase()),
  ].join(" ");
  const matched = query.filter((q) => haystack.includes(q));
  const pct = query.length > 0 ? Math.round((matched.length / query.length) * 100) : 0;
  return { matched, pct };
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FridgeAssistantView() {
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [activeDiet, setActiveDiet] = useState<DietType>("normal");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [inputShake, setInputShake] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  // Scroll to results whenever a search is triggered
  useEffect(() => {
    if (hasSearched) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [hasSearched]);

  useEffect(() => {
    if (selectedDish) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedDish]);

  const addChip = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !chips.includes(trimmed.toLowerCase())) {
      setChips((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const removeChip = (chip: string) => {
    setChips((prev) => prev.filter((c) => c !== chip));
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(inputValue);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) addChip(inputValue);
    // Require at least one chip before searching
    const effectiveChips = inputValue.trim()
      ? [...chips, inputValue.trim()]
      : chips;
    if (effectiveChips.length === 0) {
      setInputShake(true);
      setTimeout(() => setInputShake(false), 600);
      return;
    }
    setHasSearched(true);
  };

  const displayDishes = useMemo(() => {
    if (hasSearched && chips.length > 0) {
      const query = chips.map((c) => c.toLowerCase());
      return dishes
        .filter((d) => {
          if (d.dietType !== activeDiet) return false;
          const haystack = [
            d.name.toLowerCase(),
            d.description.toLowerCase(),
            ...d.tags.map((t) => t.toLowerCase()),
          ].join(" ");
          return query.some((q) => haystack.includes(q));
        })
        .sort((a, b) => {
          const aM = computeMatch(chips, a);
          const bM = computeMatch(chips, b);
          return bM.matched.length - aM.matched.length;
        })
        .slice(0, 6);
    }
    return dishes
      .filter(
        (d) =>
          d.dietType === activeDiet &&
          (d.isFeatured || d.isPopular || d.isTrending)
      )
      .slice(0, 3);
  }, [chips, activeDiet, hasSearched]);

  const sectionTitle =
    hasSearched && chips.length > 0
      ? `${displayDishes.length} Món Phù Hợp`
      : "Legendary Quests";

  const sectionLabel =
    hasSearched && chips.length > 0 ? "Kết Quả Tìm Kiếm" : "Curated Selections";

  return (
    <main className="min-h-screen">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative px-5 md:px-8 lg:px-12 py-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">

          {/* ── Left: Input Panel ───────────────────────────────────────── */}
          <div className="w-full lg:w-8/12 z-10">

            {/* Mission chip */}
            <div className="inline-flex items-center gap-2 bg-zen-gold/10 text-zen-gold border border-zen-gold/20 px-4 py-1.5 mb-8 -skew-x-3">
              <RefrigeratorIcon size={13} className="skew-x-3" />
              <span className="font-label text-[10px] font-bold uppercase tracking-widest skew-x-3">
                Mission: Fridge Raid
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-8 text-on-surface leading-[0.9] tracking-tighter">
              WHAT&rsquo;S IN <br />
              <span className="text-zen-gold italic">TỦ LẠNH BẠN?</span>
            </h1>

            <p className="font-body text-lg text-on-surface-variant max-w-md mb-10 leading-relaxed opacity-80">
              Nhập nguyên liệu bạn đang có. Tìm ngay những món ăn được tạo ra
              từ đúng thứ bạn có sẵn.
            </p>

            {/* Diet tabs */}
            <div className="flex items-center gap-6 md:gap-8 mb-6 px-1 border-b border-zen-gold/10 overflow-x-auto">
              {DIET_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveDiet(tab.value);
                    setHasSearched(false);
                  }}
                  className={cn(
                    "font-label text-[10px] font-bold uppercase tracking-widest pb-3 transition-colors shrink-0 -mb-px",
                    activeDiet === tab.value
                      ? "text-zen-gold border-b-2 border-zen-gold"
                      : "text-on-surface-variant/60 hover:text-zen-gold"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Zone */}
            <div className={cn(
              "bg-zen-paper border border-zen-gold/15 shadow-sm p-8 md:p-10 relative transition-all",
              inputShake && "animate-[shake_0.4s_ease-in-out]"
            )}>
              {/* Master Rank badge */}
              <div className="absolute -top-3 -right-3 bg-zen-gold text-white px-3 py-1 font-label text-[9px] font-bold tracking-widest uppercase">
                MASTER RANK
              </div>

              {/* Ingredient input */}
              <div className="mb-6">
                <label className="font-label text-[10px] font-bold text-on-surface-variant block mb-3 tracking-widest uppercase">
                  Thêm nguyên liệu của bạn
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="vd. Trứng, Cà chua, Hành lá..."
                    className="w-full border-b border-zen-gold/25 bg-transparent py-4 pr-12 font-body text-xl focus:ring-0 focus:border-zen-gold outline-none transition-colors placeholder:text-on-surface/20"
                  />
                  <button
                    type="button"
                    onClick={() => addChip(inputValue)}
                    aria-label="Thêm nguyên liệu"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zen-gold hover:scale-110 transition-transform"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Ingredient chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {chips.map((chip) => (
                    <div
                      key={chip}
                      className="bg-surface-container px-4 py-2 flex items-center gap-3 border border-zen-gold/15 hover:bg-zen-gold/10 transition-colors group"
                    >
                      <span className="font-label text-[10px] uppercase tracking-wider font-bold">
                        {chip}
                      </span>
                      <button
                        onClick={() => removeChip(chip)}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                        aria-label={`Xoá ${chip}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleSearch}
                className="w-full bg-zen-gold py-7 group transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zen-gold/25 active:translate-y-0 active:shadow-none"
              >
                <div className="flex items-center justify-center gap-4">
                  <span className="font-display text-xl text-white italic tracking-widest uppercase">
                    Bắt Đầu Tìm Kiếm
                  </span>
                  <ArrowRight
                    size={22}
                    className="text-white group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* ── Right: Mascot / Fridge Panel ────────────────────────────── */}
          <div className="hidden lg:flex w-full lg:w-4/12 justify-end">
            <div className="relative bg-zen-paper border border-zen-gold/15 shadow-sm p-4 w-full max-w-[300px]">
              <FridgeMascot />
              <div className="absolute -bottom-5 -left-5 bg-zen-gold text-white px-5 py-4 shadow-md">
                <p className="font-display text-base italic leading-tight">
                  TỦ LẠNH <br />ĐÃ MỞ!
                </p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-zen-gold/8 rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Results Section ───────────────────────────────────────────────── */}
      <section ref={resultsRef} className="px-5 md:px-8 lg:px-12 pb-24 max-w-7xl mx-auto">
        <header className="flex flex-col items-center mb-14 md:mb-20 text-center">
          <span className="font-label text-[10px] tracking-[0.4em] uppercase text-zen-gold font-bold mb-4">
            {sectionLabel}
          </span>
          <h2 className="font-display text-4xl uppercase italic text-on-surface">
            {sectionTitle}
          </h2>
          <div className="w-16 h-0.5 bg-zen-gold mt-6" />
          {hasSearched && chips.length > 0 && (
            <p className="font-body text-sm text-on-surface-variant/50 mt-4 max-w-sm">
              Dựa trên {chips.length} nguyên liệu — nhấn vào món để xem phân tích nguyên liệu chi tiết
            </p>
          )}
        </header>

        {displayDishes.length === 0 ? (
          <div className="text-center py-20 border border-zen-gold/15 bg-zen-paper">
            <p className="font-display text-xl uppercase italic text-on-surface-variant/50">
              Không Tìm Thấy Món Phù Hợp
            </p>
            <p className="font-body text-sm text-on-surface-variant/40 mt-3">
              Thử nguyên liệu khác hoặc đổi chế độ ăn bên trên.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {displayDishes.map((dish) =>
              hasSearched ? (
                <SearchResultCard
                  key={dish.id}
                  dish={dish}
                  chips={chips}
                  onClick={() => setSelectedDish(dish)}
                />
              ) : (
                <QuestCard key={dish.id} dish={dish} />
              )
            )}
          </div>
        )}
      </section>

      {/* ── Detail Panel ──────────────────────────────────────────────────── */}
      {selectedDish && (
        <>
          <div
            className="fixed inset-0 bg-zen-ink/50 z-40 backdrop-blur-sm"
            onClick={() => setSelectedDish(null)}
          />
          <DishDetailPanel
            dish={selectedDish}
            chips={chips}
            onClose={() => setSelectedDish(null)}
          />
        </>
      )}
    </main>
  );
}

// ── Search Result Card ────────────────────────────────────────────────────────

function SearchResultCard({
  dish,
  chips,
  onClick,
}: {
  dish: Dish;
  chips: string[];
  onClick: () => void;
}) {
  const { matched, pct } = computeMatch(chips, dish);

  return (
    <button
      type="button"
      onClick={onClick}
      className="block group text-left w-full"
    >
      <div className="bg-zen-paper border border-zen-gold/15 shadow-sm overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-zen-gold/10 h-full">
        {/* Image */}
        <div className="aspect-video overflow-hidden relative bg-surface-container shrink-0">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Match badge */}
          <div
            className={cn(
              "absolute top-3 right-3 font-label text-[10px] font-bold uppercase tracking-wider px-3 py-1.5",
              pct >= 70
                ? "bg-green-600 text-white"
                : pct >= 40
                ? "bg-zen-gold text-white"
                : "bg-zen-ink/80 text-white"
            )}
          >
            Khớp {matched.length}/{chips.length}
          </div>
          {/* Rank */}
          <div className="absolute top-3 left-3 bg-zen-paper/90 font-label text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 text-on-surface">
            {RANK_LABELS[dish.rank] ?? dish.rank}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow gap-3">
          <h3 className="font-display text-xl leading-tight text-on-surface">
            {dish.name}
          </h3>

          {/* Matched ingredient chips */}
          {matched.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matched.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 font-label text-[9px] uppercase tracking-wide px-2 py-0.5"
                >
                  <CheckCircle2 size={8} />
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-body text-xs text-on-surface-variant/50 italic">
              Phù hợp một phần dựa trên mô tả
            </p>
          )}

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-zen-gold/12 mt-auto">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock size={13} className="text-zen-gold" />
              <span className="font-label text-[10px] font-bold">
                {dish.averageCookTime} PHÚT
              </span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant group-hover:text-zen-gold transition-colors">
              <span className="font-label text-[9px] font-bold uppercase tracking-wider">
                Xem Phân Tích
              </span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Quest Card (default curated view) ─────────────────────────────────────────

function QuestCard({ dish }: { dish: (typeof dishes)[number] }) {
  return (
    <Link href={`/dish/${dish.slug}`} className="block group">
      <div className="bg-zen-paper border border-zen-gold/15 shadow-sm overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:shadow-zen-gold/10">
        <div className="aspect-video overflow-hidden relative bg-surface-container">
          <Image
            src={dish.coverImage}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="font-label text-[9px] font-bold tracking-[0.3em] uppercase text-zen-gold mb-3">
              {RANK_LABELS[dish.rank] ?? dish.rank}
            </div>
            <h3 className="font-display text-2xl mb-4 leading-tight">
              {dish.name}
            </h3>
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-zen-gold/12">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-zen-gold" />
              <span className="font-label text-[10px] font-bold">
                {dish.averageCookTime} PHÚT
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-label text-[9px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-zen-gold transition-colors">
                Xem Quest
              </span>
              <ArrowRight
                size={15}
                className="text-on-surface-variant group-hover:text-zen-gold group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Dish Detail Panel ─────────────────────────────────────────────────────────

function DishDetailPanel({
  dish,
  chips,
  onClose,
}: {
  dish: Dish;
  chips: string[];
  onClose: () => void;
}) {
  const primaryRecipe = useMemo(
    () => getRecipesByDishId(dish.id)[0] ?? null,
    [dish.id]
  );

  const { haveIngredients, missingIngredients } = useMemo<{
    haveIngredients: RecipeIngredient[];
    missingIngredients: RecipeIngredient[];
  }>(() => {
    if (!primaryRecipe) return { haveIngredients: [], missingIngredients: [] };
    const query = chips.map((c) => c.toLowerCase().trim());
    const have: RecipeIngredient[] = [];
    const missing: RecipeIngredient[] = [];
    primaryRecipe.ingredients.forEach((ing) => {
      const nameL = ing.name.toLowerCase();
      const isMatch = query.some(
        (q) => nameL.includes(q) || q.includes(nameL.split(" ")[0])
      );
      if (isMatch) have.push(ing);
      else missing.push(ing);
    });
    return { haveIngredients: have, missingIngredients: missing };
  }, [primaryRecipe, chips]);

  const { pct } = computeMatch(chips, dish);
  const havePct =
    primaryRecipe && primaryRecipe.ingredients.length > 0
      ? Math.round((haveIngredients.length / primaryRecipe.ingredients.length) * 100)
      : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] z-50 flex flex-col bg-zen-cream shadow-2xl overflow-y-auto">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 bg-zen-cream/95 backdrop-blur border-b border-zen-gold/20 px-5 py-3.5 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ChevronLeft size={17} />
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">
            Quay Lại Danh Sách
          </span>
        </button>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-sm transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* ── Hero image ── */}
      <div className="relative aspect-video bg-surface-container shrink-0">
        <Image
          src={dish.coverImage}
          alt={dish.name}
          fill
          className="object-cover"
          priority
        />
        {/* Rank badge */}
        <div
          className="absolute top-4 left-4 bg-zen-gold text-white font-label font-bold px-3 py-1.5 uppercase tracking-widest text-[10px]"
          style={{ border: "2px solid white", boxShadow: "3px 3px 0px 0px #1b1b1e" }}
        >
          {RANK_LABELS[dish.rank] ?? dish.rank}
        </div>
        {/* Match % pill */}
        <div
          className={cn(
            "absolute top-4 right-4 font-label font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider",
            pct >= 70
              ? "bg-green-600 text-white"
              : pct >= 40
              ? "bg-amber-500 text-white"
              : "bg-zen-ink/80 text-white"
          )}
        >
          {pct}% Match
        </div>
      </div>

      {/* ── Content body ── */}
      <div className="flex flex-col gap-7 px-6 md:px-8 py-8 flex-1">

        {/* Title + description */}
        <div>
          <h2 className="font-display text-3xl uppercase italic text-on-surface leading-tight mb-4">
            {dish.name}
          </h2>
          <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed border-l-2 border-zen-gold pl-4">
            {dish.description}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-zen-gold/20 bg-zen-paper py-4 flex flex-col items-center gap-2">
            <Clock size={18} className="text-zen-gold" />
            <span className="font-label text-[10px] font-bold uppercase tracking-wider text-center leading-snug">
              {dish.averageCookTime}<br />Phút
            </span>
          </div>
          <div className="border border-zen-gold/20 bg-zen-paper py-4 flex flex-col items-center gap-2">
            <Flame size={18} className="text-zen-gold" />
            <span className="font-label text-[10px] font-bold uppercase tracking-wider text-center leading-snug">
              {dish.nutrition.calories}<br />Kcal
            </span>
          </div>
          <div className="border border-zen-gold/20 bg-zen-paper py-4 flex flex-col items-center gap-2">
            <BookOpen size={18} className="text-zen-gold" />
            <span className="font-label text-[10px] font-bold uppercase tracking-wider text-center leading-snug">
              {dish.recipeCount}<br />Công Thức
            </span>
          </div>
        </div>

        {/* ── Ingredient analysis ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl uppercase italic gold-underline inline-block">
              Kiểm Tra Nguyên Liệu
            </h3>
            {primaryRecipe && (
              <span
                className={cn(
                  "font-label text-[10px] font-bold uppercase tracking-wider px-3 py-1.5",
                  havePct >= 70
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : havePct >= 40
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-surface-container text-on-surface-variant border border-zen-gold/20"
                )}
              >
                {haveIngredients.length}/{primaryRecipe.ingredients.length} nguyên liệu
              </span>
            )}
          </div>

          {primaryRecipe ? (
            <div className="space-y-4">
              {/* Have */}
              {haveIngredients.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <CheckCircle2 size={13} className="text-green-600" />
                    <span className="font-label text-[9px] uppercase tracking-widest text-green-700 font-bold">
                      Bạn đã có ({haveIngredients.length})
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {haveIngredients.map((ing) => (
                      <li
                        key={ing.ingredientId}
                        className="flex items-center justify-between px-4 py-2.5 bg-green-50 border border-green-100"
                      >
                        <span className="font-body text-sm text-green-800">
                          {ing.name}
                        </span>
                        <span className="font-label text-[10px] text-green-600 font-bold shrink-0 ml-4">
                          {ing.quantity} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing */}
              {missingIngredients.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Circle size={13} className="text-on-surface-variant/40" />
                    <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Còn thiếu ({missingIngredients.length})
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {missingIngredients.map((ing) => (
                      <li
                        key={ing.ingredientId}
                        className="flex items-center justify-between px-4 py-2.5 bg-surface-container border border-zen-gold/10"
                      >
                        <span className="font-body text-sm text-on-surface-variant">
                          {ing.name}
                          {ing.isOptional && (
                            <span className="font-label text-[9px] ml-2 text-zen-gold/60 uppercase tracking-wide">
                              tuỳ chọn
                            </span>
                          )}
                        </span>
                        <span className="font-label text-[10px] text-on-surface-variant/50 font-bold shrink-0 ml-4">
                          {ing.quantity} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-zen-gold/15 bg-zen-paper px-6 py-8 text-center">
              <p className="font-body text-sm text-on-surface-variant/60 italic">
                Công thức đang được cập nhật...
              </p>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="pt-2 pb-4">
          <Link
            href={`/dish/${dish.slug}`}
            className="block w-full bg-zen-gold py-6 text-center group transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zen-gold/25 active:translate-y-0"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="font-display text-lg text-white italic tracking-widest uppercase">
                Xem Công Thức Đầy Đủ
              </span>
              <ArrowRight
                size={20}
                className="text-white group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Fridge Mascot ─────────────────────────────────────────────────────────────

function FridgeMascot() {
  return (
    <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-b from-surface-container to-zen-cream flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 py-8">
        <div className="w-full border border-zen-gold/20 bg-white/80 rounded-sm p-4 flex items-center justify-around shadow-sm">
          <span className="text-2xl" role="img" aria-label="sữa">🥛</span>
          <span className="text-2xl" role="img" aria-label="bơ">🧈</span>
          <span className="text-2xl" role="img" aria-label="trứng">🥚</span>
        </div>
        <div className="w-full border border-zen-gold/20 bg-white/80 rounded-sm p-4 flex items-center justify-around shadow-sm flex-1">
          <span className="text-3xl" role="img" aria-label="cà rốt">🥕</span>
          <span className="text-3xl" role="img" aria-label="cải xanh">🥦</span>
          <span className="text-3xl" role="img" aria-label="cà chua">🍅</span>
        </div>
        <div className="w-full border border-zen-gold/20 bg-white/80 rounded-sm p-3 flex items-center justify-around shadow-sm">
          <span className="text-xl" role="img" aria-label="sốt">🧴</span>
          <span className="text-xl" role="img" aria-label="chanh">🍋</span>
          <span className="text-xl" role="img" aria-label="tỏi">🧄</span>
        </div>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-20 bg-zen-gold/30 rounded-full" />
    </div>
  );
}
