"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  UtensilsCrossed,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_DISHES, type Dish } from "./mock-data";

const PAGE_SIZE = 10;

const TYPE_LABELS: Record<Dish["type"], string> = {
  normal: "Thường",
  vegetarian: "Chay",
  diet: "Ăn kiêng",
};

const DIFF_LABELS: Record<Dish["difficulty"], string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

function TypeBadge({ type }: { type: Dish["type"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-label text-[9px] uppercase tracking-[0.1em]",
        type === "vegetarian" && "bg-green-50 text-green-700",
        type === "diet" && "bg-blue-50 text-blue-700",
        type === "normal" && "bg-zinc-100 text-zinc-500"
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

function DiffBadge({ diff }: { diff: Dish["difficulty"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-label text-[9px] uppercase tracking-[0.1em]",
        diff === "easy" && "bg-emerald-50 text-emerald-700",
        diff === "medium" && "bg-amber-50 text-amber-700",
        diff === "hard" && "bg-red-50 text-red-600"
      )}
    >
      {DIFF_LABELS[diff]}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-label text-[9px] uppercase tracking-[0.1em] px-2 py-0.5",
        active ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          active ? "bg-green-500" : "bg-zinc-400"
        )}
      />
      {active ? "Hoạt động" : "Nháp"}
    </span>
  );
}

export function DishesClient() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_DISHES.filter((d) => {
      if (
        search &&
        !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.slug.includes(search.toLowerCase())
      )
        return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (statusFilter === "active" && !d.isActive) return false;
      if (statusFilter === "draft" && d.isActive) return false;
      if (diffFilter !== "all" && d.difficulty !== diffFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter, diffFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  const activeCount = MOCK_DISHES.filter((d) => d.isActive).length;

  return (
    <div className="space-y-4 max-w-screen-xl pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-zen-ink leading-none">
            Món ăn
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {MOCK_DISHES.length} món · {activeCount} đang hoạt động
          </p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="flex items-center gap-2 px-4 h-9 bg-zen-gold text-zen-ink font-label text-xs uppercase tracking-[0.15em] font-bold manga-shadow manga-shadow-hover transition-all"
        >
          <Plus size={14} />
          Thêm món
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white manga-border p-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm theo tên, slug…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="w-full h-8 pl-8 pr-8 bg-zinc-50 border border-zinc-200 text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zen-ink"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter chips */}
        <div className="flex items-center gap-1">
          {(["all", "normal", "vegetarian", "diet"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                resetPage();
              }}
              className={cn(
                "px-3 h-8 font-label text-[11px] uppercase tracking-[0.1em] transition-colors border",
                typeFilter === t
                  ? "bg-zen-ink text-white border-zen-ink"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
              )}
            >
              {t === "all" ? "Tất cả" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            resetPage();
          }}
          className="h-8 px-3 bg-white border border-zinc-200 text-sm text-zinc-600 focus:outline-none focus:border-zen-gold"
        >
          <option value="all">Mọi trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="draft">Nháp</option>
        </select>

        {/* Difficulty filter */}
        <select
          value={diffFilter}
          onChange={(e) => {
            setDiffFilter(e.target.value);
            resetPage();
          }}
          className="h-8 px-3 bg-white border border-zinc-200 text-sm text-zinc-600 focus:outline-none focus:border-zen-gold"
        >
          <option value="all">Mọi độ khó</option>
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white manga-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              {[
                "Món ăn",
                "Danh mục",
                "Loại",
                "Độ khó",
                "Thời gian",
                "Lượt xem",
                "Trạng thái",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-4 py-3 font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant",
                    i >= 4 ? "text-right" : "text-left",
                    i === 7 && "w-16"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-16 text-center text-sm text-zinc-400"
                >
                  Không tìm thấy món ăn nào.
                </td>
              </tr>
            ) : (
              paged.map((dish, i) => (
                <tr
                  key={dish._id}
                  className={cn(
                    "hover:bg-zen-gold/5 transition-colors",
                    i < paged.length - 1 && "border-b border-zinc-50"
                  )}
                >
                  {/* Name + image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 bg-zinc-100 overflow-hidden">
                        {dish.image ? (
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <UtensilsCrossed size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-zen-ink leading-snug truncate max-w-48">
                          {dish.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-mono leading-snug">
                          {dish.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                    {dish.category.name}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <TypeBadge type={dish.type} />
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-3">
                    <DiffBadge diff={dish.difficulty} />
                  </td>

                  {/* Cook time */}
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-on-surface-variant">
                      <Clock size={11} className="text-zinc-300" />
                      {dish.cookingTime} ph
                    </span>
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">
                    {dish.viewCount.toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-right">
                    <StatusBadge active={dish.isActive} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/dishes/${dish._id}`}
                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zen-gold hover:bg-zen-gold/10 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa món "${dish.name}"?`)) {
                            alert(`(Mock) Đã xóa: ${dish.name}`);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
            <p className="text-xs text-zinc-400">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} /{" "}
              {filtered.length} món
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center border border-zinc-200 text-zinc-500 hover:border-zen-gold hover:text-zen-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center border text-xs font-label transition-colors",
                    p === page
                      ? "bg-zen-gold border-zen-gold text-zen-ink font-bold"
                      : "border-zinc-200 text-zinc-500 hover:border-zen-gold hover:text-zen-gold"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center border border-zinc-200 text-zinc-500 hover:border-zen-gold hover:text-zen-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
