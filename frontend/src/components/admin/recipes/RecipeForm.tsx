"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_INGREDIENTS,
  MOCK_DISHES_SELECT,
  type Recipe,
} from "./mock-data";

/* ─── Slug helper ────────────────────────────────────────────────────────── */
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

/* ─── Types ──────────────────────────────────────────────────────────────── */
type IngRow = { key: string; ingredientId: string; amount: string; unit: string; note: string };
type StepRow = { key: string; description: string; image: string };

type FormState = {
  title: string;
  slug: string;
  dishId: string;
  source: string;
  sourceUrl: string;
  description: string;
  image: string;
  videoUrl: string;
  servings: string;
  cookingTime: string;
  difficulty: Recipe["difficulty"];
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
  isActive: boolean;
};

let _key = 0;
function newKey() {
  return String(++_key);
}

function initForm(recipe?: Recipe): FormState {
  if (!recipe) {
    return {
      title: "",
      slug: "",
      dishId: MOCK_DISHES_SELECT[0]._id,
      source: "",
      sourceUrl: "",
      description: "",
      image: "",
      videoUrl: "",
      servings: "2",
      cookingTime: "30",
      difficulty: "easy",
      calories: "0",
      protein: "0",
      fat: "0",
      carbohydrates: "0",
      isActive: true,
    };
  }
  return {
    title: recipe.title,
    slug: recipe.slug,
    dishId: recipe.dishId,
    source: recipe.source,
    sourceUrl: recipe.sourceUrl,
    description: recipe.description,
    image: recipe.image,
    videoUrl: recipe.videoUrl,
    servings: String(recipe.servings),
    cookingTime: String(recipe.cookingTime),
    difficulty: recipe.difficulty,
    calories: String(recipe.calories),
    protein: String(recipe.protein),
    fat: String(recipe.fat),
    carbohydrates: String(recipe.carbohydrates),
    isActive: recipe.isActive,
  };
}

function initIngredients(recipe?: Recipe): IngRow[] {
  if (!recipe || recipe.ingredients.length === 0) return [];
  return recipe.ingredients.map((ing) => ({
    key: newKey(),
    ingredientId: ing.ingredientId,
    amount: String(ing.amount),
    unit: ing.unit,
    note: ing.note,
  }));
}

function initSteps(recipe?: Recipe): StepRow[] {
  if (!recipe || recipe.instructions.length === 0) return [];
  return recipe.instructions.map((inst) => ({
    key: newKey(),
    description: inst.description,
    image: inst.image,
  }));
}

/* ─── Shared UI ──────────────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white manga-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

const UNITS = ["g", "kg", "ml", "l", "tbsp", "tsp", "cup", "cái", "quả", "tép", "cây", "lát", "bó"];

/* ─── Ingredient editor ──────────────────────────────────────────────────── */
function IngredientEditor({
  rows,
  onChange,
}: {
  rows: IngRow[];
  onChange: (rows: IngRow[]) => void;
}) {
  function addRow() {
    onChange([
      ...rows,
      {
        key: newKey(),
        ingredientId: MOCK_INGREDIENTS[0]._id,
        amount: "100",
        unit: MOCK_INGREDIENTS[0].defaultUnit,
        note: "",
      },
    ]);
  }

  function removeRow(key: string) {
    onChange(rows.filter((r) => r.key !== key));
  }

  function updateRow(key: string, field: keyof Omit<IngRow, "key">, value: string) {
    onChange(
      rows.map((r) => {
        if (r.key !== key) return r;
        if (field === "ingredientId") {
          const ing = MOCK_INGREDIENTS.find((i) => i._id === value);
          return { ...r, ingredientId: value, unit: ing?.defaultUnit ?? r.unit };
        }
        return { ...r, [field]: value };
      })
    );
  }

  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left pb-2 font-label text-[9px] uppercase tracking-[0.12em] text-zinc-400 pr-3 w-5/12">
                  Nguyên liệu
                </th>
                <th className="text-left pb-2 font-label text-[9px] uppercase tracking-[0.12em] text-zinc-400 pr-3 w-1/12">
                  Số lượng
                </th>
                <th className="text-left pb-2 font-label text-[9px] uppercase tracking-[0.12em] text-zinc-400 pr-3 w-1/12">
                  Đơn vị
                </th>
                <th className="text-left pb-2 font-label text-[9px] uppercase tracking-[0.12em] text-zinc-400 w-4/12">
                  Ghi chú
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="space-y-2">
              {rows.map((row) => (
                <tr key={row.key} className="group">
                  <td className="pb-2 pr-3">
                    <select
                      value={row.ingredientId}
                      onChange={(e) => updateRow(row.key, "ingredientId", e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-zinc-200 text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                    >
                      {MOCK_INGREDIENTS.map((ing) => (
                        <option key={ing._id} value={ing._id}>
                          {ing.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pb-2 pr-3">
                    <input
                      type="number"
                      min={0}
                      value={row.amount}
                      onChange={(e) => updateRow(row.key, "amount", e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-zinc-200 text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors text-right"
                    />
                  </td>
                  <td className="pb-2 pr-3">
                    <select
                      value={row.unit}
                      onChange={(e) => updateRow(row.key, "unit", e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-zinc-200 text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </td>
                  <td className="pb-2">
                    <input
                      type="text"
                      value={row.note}
                      onChange={(e) => updateRow(row.key, "note", e.target.value)}
                      placeholder="thái lát, băm nhỏ…"
                      className="w-full h-9 px-2 bg-white border border-zinc-200 text-sm text-zen-ink placeholder:text-zinc-300 focus:outline-none focus:border-zen-gold transition-colors"
                    />
                  </td>
                  <td className="pb-2 pl-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      className="w-7 h-9 flex items-center justify-center text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && (
        <p className="text-sm text-zinc-400 py-3">
          Chưa có nguyên liệu. Nhấn "+ Thêm" để bắt đầu.
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 px-3 h-8 border border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-zen-gold hover:text-zen-gold transition-colors font-label uppercase tracking-[0.1em]"
      >
        <Plus size={12} />
        Thêm nguyên liệu
      </button>
    </div>
  );
}

/* ─── Steps editor ───────────────────────────────────────────────────────── */
function StepsEditor({
  rows,
  onChange,
}: {
  rows: StepRow[];
  onChange: (rows: StepRow[]) => void;
}) {
  function addStep() {
    onChange([...rows, { key: newKey(), description: "", image: "" }]);
  }

  function removeStep(key: string) {
    onChange(rows.filter((r) => r.key !== key));
  }

  function updateStep(key: string, field: "description" | "image", value: string) {
    onChange(rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  function moveStep(index: number, dir: -1 | 1) {
    const next = [...rows];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="text-sm text-zinc-400 py-3">
          Chưa có bước nào. Nhấn "+ Thêm bước" để bắt đầu.
        </p>
      )}

      {rows.map((row, i) => (
        <div key={row.key} className="border border-zinc-200 p-4 space-y-3 hover:border-zinc-300 transition-colors">
          {/* Step header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-zen-gold/10 flex items-center justify-center font-display text-sm font-black text-zen-gold leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-label text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                Bước {i + 1}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveStep(i, -1)}
                disabled={i === 0}
                className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zen-ink disabled:opacity-30 transition-colors"
                title="Lên"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => moveStep(i, 1)}
                disabled={i === rows.length - 1}
                className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zen-ink disabled:opacity-30 transition-colors"
                title="Xuống"
              >
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => removeStep(row.key)}
                className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                title="Xóa bước"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Description */}
          <textarea
            value={row.description}
            onChange={(e) => updateStep(row.key, "description", e.target.value)}
            placeholder="Mô tả chi tiết bước này…"
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-zinc-200 text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors resize-none"
          />

          {/* Optional step image */}
          <div className="flex items-center gap-2">
            <ImageIcon size={12} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              value={row.image}
              onChange={(e) => updateStep(row.key, "image", e.target.value)}
              placeholder="URL ảnh bước này (tuỳ chọn)"
              className="flex-1 h-8 px-2 bg-white border border-zinc-200 text-sm text-zen-ink placeholder:text-zinc-300 focus:outline-none focus:border-zen-gold transition-colors"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-1.5 px-3 h-8 border border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-zen-gold hover:text-zen-gold transition-colors font-label uppercase tracking-[0.1em]"
      >
        <Plus size={12} />
        Thêm bước
      </button>
    </div>
  );
}

/* ─── Main form ──────────────────────────────────────────────────────────── */
type Props = { mode: "create" } | { mode: "edit"; recipe: Recipe };

export function RecipeForm(props: Props) {
  const recipe = props.mode === "edit" ? props.recipe : undefined;
  const [form, setForm] = useState<FormState>(() => initForm(recipe));
  const [ingredients, setIngredients] = useState<IngRow[]>(() => initIngredients(recipe));
  const [steps, setSteps] = useState<StepRow[]>(() => initSteps(recipe));
  const [slugManual, setSlugManual] = useState(props.mode === "edit");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!slugManual) set("slug", toSlug(v));
  }

  function handleSubmit(e: React.FormEvent, draft = false) {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Vui lòng nhập tiêu đề công thức.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(
        `(Mock) ${props.mode === "edit" ? "Đã cập nhật" : "Đã tạo"}: ${form.title}${draft ? " (nháp)" : ""}`
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
            href="/admin/recipes"
            className="w-8 h-8 flex items-center justify-center manga-border text-zinc-500 hover:border-zen-gold hover:text-zen-gold transition-colors"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-black uppercase tracking-tight text-zen-ink leading-none">
              {isEdit ? "Chỉnh sửa công thức" : "Thêm công thức mới"}
            </h1>
            {isEdit && (
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {recipe!.slug}
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
              {/* Title */}
              <div>
                <FieldLabel required>Tiêu đề công thức</FieldLabel>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Phở bò truyền thống kiểu Hà Nội…"
                  className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <FieldLabel>Slug (URL)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none select-none">
                    /cong-thuc/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      set("slug", e.target.value);
                    }}
                    placeholder="pho-bo-truyen-thong..."
                    className="w-full h-10 pl-[82px] pr-3 bg-white manga-border text-sm font-mono text-zen-ink placeholder:text-zinc-300 focus:outline-none focus:border-zen-gold transition-colors"
                  />
                </div>
              </div>

              {/* Dish */}
              <div>
                <FieldLabel required>Món ăn</FieldLabel>
                <select
                  value={form.dishId}
                  onChange={(e) => set("dishId", e.target.value)}
                  className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                >
                  {MOCK_DISHES_SELECT.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Source */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Nguồn tham khảo</FieldLabel>
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => set("source", e.target.value)}
                    placeholder="Cookpad, YouTube…"
                    className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
                  />
                </div>
                <div>
                  <FieldLabel>URL nguồn</FieldLabel>
                  <input
                    type="text"
                    value={form.sourceUrl}
                    onChange={(e) => set("sourceUrl", e.target.value)}
                    placeholder="https://…"
                    className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Mô tả ngắn</FieldLabel>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  placeholder="Giới thiệu ngắn về công thức…"
                  className="w-full px-3 py-2.5 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors resize-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Ingredients */}
          <SectionCard title={`Nguyên liệu (${ingredients.length})`}>
            <IngredientEditor rows={ingredients} onChange={setIngredients} />
          </SectionCard>

          {/* Instructions */}
          <SectionCard title={`Các bước thực hiện (${steps.length})`}>
            <StepsEditor rows={steps} onChange={setSteps} />
          </SectionCard>
        </div>

        {/* ── Right (1/3) ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Media */}
          <div className="bg-white manga-border p-5 space-y-4">
            <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
              Hình ảnh & Video
            </h2>

            {/* Image preview */}
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
              <FieldLabel>URL ảnh đại diện</FieldLabel>
              <input
                type="text"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://…"
                className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
              />
            </div>

            <div>
              <FieldLabel>URL video YouTube</FieldLabel>
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/embed/…"
                className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
              />
              {form.videoUrl && (
                <div className="mt-2 aspect-video overflow-hidden">
                  <iframe
                    src={form.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Recipe video"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cooking details */}
          <div className="bg-white manga-border p-5 space-y-4">
            <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
              Chi tiết nấu
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Thời gian</FieldLabel>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={form.cookingTime}
                      onChange={(e) => set("cookingTime", e.target.value)}
                      className="w-full h-10 px-3 pr-10 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                      ph
                    </span>
                  </div>
                </div>
                <div>
                  <FieldLabel>Khẩu phần</FieldLabel>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={form.servings}
                      onChange={(e) => set("servings", e.target.value)}
                      className="w-full h-10 px-3 pr-14 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                      người
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Độ khó</FieldLabel>
                <div className="flex gap-1 h-10">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("difficulty", d)}
                      className={cn(
                        "flex-1 font-label text-[10px] uppercase tracking-[0.08em] border transition-colors",
                        form.difficulty === d
                          ? d === "easy"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : d === "medium"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-red-500 text-white border-red-500"
                          : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
                      )}
                    >
                      {d === "easy" ? "Dễ" : d === "medium" ? "TB" : "Khó"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-white manga-border p-5 space-y-3">
            <h2 className="font-display text-xs font-black uppercase tracking-[0.15em] text-zen-ink pb-3 border-b border-zinc-100">
              Dinh dưỡng / khẩu phần
            </h2>
            <div className="grid grid-cols-2 gap-3">
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
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className="w-full h-9 px-2 pr-10 bg-white manga-border text-sm text-zen-ink focus:outline-none focus:border-zen-gold transition-colors"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none">
                      {suffix}
                    </span>
                  </div>
                </div>
              ))}
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
                    <p className="text-sm font-medium text-zen-ink leading-none">{opt.label}</p>
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
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">Món ăn</span>
                  <span className="text-zen-ink font-medium">{recipe!.dishName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">Nguyên liệu</span>
                  <span className="font-mono text-zen-ink">{recipe!.ingredients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">Bước thực hiện</span>
                  <span className="font-mono text-zen-ink">{recipe!.instructions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label uppercase tracking-[0.1em] text-[10px]">Ngày tạo</span>
                  <span className="font-mono text-zinc-500">{recipe!.createdAt}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
