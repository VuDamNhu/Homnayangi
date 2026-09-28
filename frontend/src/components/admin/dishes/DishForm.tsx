"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, X, ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_CATEGORIES, type Dish } from "./mock-data";

/* ─── slug helper ────────────────────────────────────────────────────────── */
const VI_MAP: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
  ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
  ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
  ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
  ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  đ: "d",
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((c) => VI_MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ─── Form state type ────────────────────────────────────────────────────── */
type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  categoryId: string;
  type: Dish["type"];
  difficulty: Dish["difficulty"];
  cookingTime: string;
  servings: string;
  tags: string[];
  isActive: boolean;
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
  seoTitle: string;
  seoDesc: string;
  seoUrl: string;
};

function initialState(dish?: Dish): FormState {
  if (!dish) {
    return {
      name: "",
      slug: "",
      description: "",
      image: "",
      categoryId: MOCK_CATEGORIES[0]._id,
      type: "normal",
      difficulty: "easy",
      cookingTime: "30",
      servings: "2",
      tags: [],
      isActive: true,
      calories: "0",
      protein: "0",
      fat: "0",
      carbohydrates: "0",
      seoTitle: "",
      seoDesc: "",
      seoUrl: "",
    };
  }
  return {
    name: dish.name,
    slug: dish.slug,
    description: dish.description,
    image: dish.image,
    categoryId: dish.category._id,
    type: dish.type,
    difficulty: dish.difficulty,
    cookingTime: String(dish.cookingTime),
    servings: String(dish.servings),
    tags: [...dish.tags],
    isActive: dish.isActive,
    calories: String(dish.calories),
    protein: String(dish.protein),
    fat: String(dish.fat),
    carbohydrates: String(dish.carbohydrates),
    seoTitle: dish.seo.metaTitle,
    seoDesc: dish.seo.metaDescription,
    seoUrl: dish.seo.canonicalUrl,
  };
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors",
        className
      )}
    />
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors",
          suffix && "pr-10"
        )}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white manga-border p-5 space-y-4">
      <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ─── Tag input ──────────────────────────────────────────────────────────── */
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const t = raw.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className="min-h-10 px-2 py-1.5 bg-white manga-border flex flex-wrap gap-1.5 cursor-text focus-within:border-zen-gold transition-colors"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-zen-gold/10 text-zen-ink font-label text-[11px] uppercase tracking-[0.08em]"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(tags.filter((t) => t !== tag));
            }}
            className="text-zinc-400 hover:text-zen-ink"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Nhập tag, Enter để thêm…" : ""}
        className="flex-1 min-w-24 h-7 text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none bg-transparent"
      />
    </div>
  );
}

/* ─── Main form ──────────────────────────────────────────────────────────── */
type Props =
  | { mode: "create" }
  | { mode: "edit"; dish: Dish };

export function DishForm(props: Props) {
  const [form, setForm] = useState<FormState>(() =>
    props.mode === "edit" ? initialState(props.dish) : initialState()
  );
  const [slugManual, setSlugManual] = useState(props.mode === "edit");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(v: string) {
    set("name", v);
    if (!slugManual) set("slug", toSlug(v));
  }

  function handleSlugChange(v: string) {
    setSlugManual(true);
    set("slug", v);
  }

  function handleSubmit(e: React.FormEvent, draft = false) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên món ăn.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(
        `(Mock) ${props.mode === "edit" ? "Đã cập nhật" : "Đã tạo"}: ${form.name}${draft ? " (nháp)" : ""}`
      );
    }, 800);
  }

  const isEdit = props.mode === "edit";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-screen-xl pb-8">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dishes"
            className="w-8 h-8 flex items-center justify-center manga-border text-zinc-500 hover:border-zen-gold hover:text-zen-gold transition-colors"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-black uppercase tracking-tight text-zen-ink leading-none">
              {isEdit ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
            </h1>
            {isEdit && (
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {(props as { mode: "edit"; dish: Dish }).dish.slug}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="px-4 h-9 manga-border text-sm font-label uppercase tracking-[0.1em] text-zinc-600 hover:border-zinc-400 disabled:opacity-60 transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 h-9 bg-zen-gold text-zen-ink font-label text-xs uppercase tracking-[0.15em] font-bold manga-shadow manga-shadow-hover disabled:opacity-60 transition-all"
          >
            {saving ? "Đang lưu…" : isEdit ? "Cập nhật" : "Xuất bản"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left (2/3) ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic info */}
          <SectionCard title="Thông tin cơ bản">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <FieldLabel required>Tên món</FieldLabel>
                <TextInput
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Phở bò tái chín…"
                />
              </div>

              {/* Slug */}
              <div>
                <FieldLabel>Slug (URL)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                    /mon-an/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="pho-bo-tai-chin"
                    className="w-full h-10 pl-[72px] pr-3 bg-white manga-border text-sm font-mono text-zen-ink placeholder:text-zinc-300 focus:outline-none focus:border-zen-gold transition-colors"
                  />
                </div>
              </div>

              {/* Category + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Danh mục</FieldLabel>
                  <select
                    value={form.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                    className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                  >
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Loại món</FieldLabel>
                  <div className="flex gap-1 h-10">
                    {(["normal", "vegetarian", "diet"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("type", t)}
                        className={cn(
                          "flex-1 font-label text-[10px] uppercase tracking-[0.08em] border transition-colors",
                          form.type === t
                            ? "bg-zen-ink text-white border-zen-ink"
                            : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
                        )}
                      >
                        {t === "normal" ? "Thường" : t === "vegetarian" ? "Chay" : "Ăn kiêng"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Mô tả</FieldLabel>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  placeholder="Mô tả ngắn về món ăn…"
                  className="w-full px-3 py-2.5 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors resize-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Cooking details */}
          <SectionCard title="Chi tiết nấu">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel>Thời gian</FieldLabel>
                <NumberInput
                  value={form.cookingTime}
                  onChange={(v) => set("cookingTime", v)}
                  min={1}
                  suffix="phút"
                />
              </div>
              <div>
                <FieldLabel>Khẩu phần</FieldLabel>
                <NumberInput
                  value={form.servings}
                  onChange={(v) => set("servings", v)}
                  min={1}
                  suffix="người"
                />
              </div>
              <div>
                <FieldLabel>Độ khó</FieldLabel>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    set("difficulty", e.target.value as Dish["difficulty"])
                  }
                  className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Tags */}
          <SectionCard title="Tags">
            <TagInput
              tags={form.tags}
              onChange={(t) => set("tags", t)}
            />
            <p className="text-[11px] text-zinc-400 -mt-1">
              Nhập tag rồi nhấn Enter hoặc dấu phẩy để thêm.
            </p>
          </SectionCard>

          {/* Nutrition */}
          <SectionCard title="Dinh dưỡng (mỗi khẩu phần)">
            <div className="grid grid-cols-4 gap-4">
              {(
                [
                  { key: "calories", label: "Calories", suffix: "kcal" },
                  { key: "protein", label: "Protein", suffix: "g" },
                  { key: "fat", label: "Chất béo", suffix: "g" },
                  { key: "carbohydrates", label: "Carbs", suffix: "g" },
                ] as const
              ).map(({ key, label, suffix }) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <NumberInput
                    value={form[key]}
                    onChange={(v) => set(key, v)}
                    suffix={suffix}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* SEO */}
          <SectionCard title="SEO">
            <div className="space-y-4">
              <div>
                <FieldLabel>Meta title</FieldLabel>
                <TextInput
                  value={form.seoTitle}
                  onChange={(v) => set("seoTitle", v)}
                  placeholder={form.name || "Tên hiển thị trên Google…"}
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  {form.seoTitle.length}/60 ký tự
                </p>
              </div>
              <div>
                <FieldLabel>Meta description</FieldLabel>
                <textarea
                  value={form.seoDesc}
                  onChange={(e) => set("seoDesc", e.target.value)}
                  rows={2}
                  placeholder="Mô tả ngắn cho Google…"
                  className="w-full px-3 py-2.5 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors resize-none"
                />
                <p className="text-[11px] text-zinc-400 -mt-1">
                  {form.seoDesc.length}/160 ký tự
                </p>
              </div>
              <div>
                <FieldLabel>Canonical URL</FieldLabel>
                <TextInput
                  value={form.seoUrl}
                  onChange={(v) => set("seoUrl", v)}
                  placeholder="https://homnayangi.vn/mon-an/…"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Right (1/3) ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Image */}
          <div className="bg-white manga-border p-5 space-y-4">
            <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
              Ảnh đại diện
            </h2>
            <div className="aspect-video bg-zinc-50 manga-border flex items-center justify-center overflow-hidden">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-300">
                  <ImageIcon size={28} />
                  <span className="text-[11px] font-label uppercase tracking-[0.1em]">
                    Chưa có ảnh
                  </span>
                </div>
              )}
            </div>
            <div>
              <FieldLabel>URL ảnh</FieldLabel>
              <TextInput
                value={form.image}
                onChange={(v) => set("image", v)}
                placeholder="https://…"
              />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white manga-border p-5 space-y-4">
            <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
              Trạng thái
            </h2>
            <div className="space-y-2">
              {[
                { value: true, label: "Hoạt động", desc: "Hiển thị trên site" },
                { value: false, label: "Nháp", desc: "Ẩn khỏi site" },
              ].map((opt) => (
                <label
                  key={String(opt.value)}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer border transition-colors",
                    form.isActive === opt.value
                      ? "border-zen-gold bg-zen-gold/5"
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={form.isActive === opt.value}
                    onChange={() => set("isActive", opt.value)}
                    className="mt-0.5 accent-zen-gold"
                  />
                  <div>
                    <p className="text-sm font-medium text-zen-ink leading-none">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Edit info */}
          {isEdit && (
            <div className="bg-white manga-border p-5 space-y-3">
              <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
                Thông tin
              </h2>
              <div className="space-y-2 text-xs text-zinc-500">
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">
                    Lượt xem
                  </span>
                  <span className="font-mono text-zen-ink font-medium">
                    {(props as { mode: "edit"; dish: Dish }).dish.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">
                    Yêu thích
                  </span>
                  <span className="font-mono text-zen-ink font-medium">
                    {(props as { mode: "edit"; dish: Dish }).dish.favoriteCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">
                    Ngày tạo
                  </span>
                  <span className="font-mono text-zinc-500">
                    {(props as { mode: "edit"; dish: Dish }).dish.createdAt}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
