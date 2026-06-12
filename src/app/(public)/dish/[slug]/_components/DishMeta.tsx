import { Clock, ChefHat, Zap, BookOpen, Flame, Leaf, Scale } from "lucide-react";
import type { Dish } from "@/data/types";
import { DIET_TYPE_LABELS } from "@/config/constants";

interface DishMetaProps {
  dish: Dish;
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Dễ", color: "text-green-600" },
  normal: { label: "Vừa", color: "text-zen-gold" },
  hard: { label: "Khó", color: "text-orange-500" },
  expert: { label: "Chuyên gia", color: "text-red-600" },
};

export function DishMeta({ dish }: DishMetaProps) {
  const diff = difficultyConfig[dish.difficulty] ?? { label: dish.difficulty, color: "text-zen-gold" };
  const dietLabel = DIET_TYPE_LABELS[dish.dietType];

  return (
    <div className="manga-border bg-zen-paper">
      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-y divide-zen-ink/8">
        <StatCell
          icon={<Clock size={15} className="text-zen-gold" />}
          value={`${dish.averageCookTime} phút`}
          label="Thời gian nấu"
        />
        <StatCell
          icon={<ChefHat size={15} className={diff.color} />}
          value={diff.label}
          label="Độ khó"
          valueClass={diff.color}
        />
        <StatCell
          icon={<Zap size={15} className="text-zen-gold" />}
          value={`+${dish.xpReward} XP`}
          label="Phần thưởng"
          valueClass="text-zen-gold"
        />
        <StatCell
          icon={<BookOpen size={15} className="text-zen-gold" />}
          value={`${dish.recipeCount} công thức`}
          label="Có sẵn"
        />
        <StatCell
          icon={<Flame size={15} className="text-orange-400" />}
          value={`${dish.nutrition.calories} kcal`}
          label="Năng lượng"
        />
      </div>

      {/* Bottom: diet + tags */}
      <div className="px-5 py-4 border-t border-dashed border-zen-gold/20 flex flex-wrap items-center gap-3">
        {/* Diet badge */}
        <DietBadge type={dish.dietType} label={dietLabel} />

        {/* Divider */}
        <span className="w-px h-4 bg-zen-ink/10" />

        {/* Tags */}
        {dish.tags.map((tag) => (
          <span
            key={tag}
            className="font-label text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 border border-zen-ink/12 text-on-surface-variant hover:border-zen-gold hover:text-zen-gold transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCell({
  icon,
  value,
  label,
  valueClass = "text-on-surface",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1.5 px-5 py-5">
      <div className="flex items-center gap-1.5">{icon}</div>
      <span className={`font-label text-[13px] font-bold leading-tight ${valueClass}`}>
        {value}
      </span>
      <span className="font-label text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

function DietBadge({ type, label }: { type: string; label: string }) {
  const configs: Record<string, { icon: React.ReactNode; color: string }> = {
    normal: {
      icon: <Scale size={11} />,
      color: "border-zen-ink/15 text-on-surface-variant",
    },
    vegetarian: {
      icon: <Leaf size={11} />,
      color: "border-green-400/50 text-green-700 bg-green-50",
    },
    diet: {
      icon: <Zap size={11} />,
      color: "border-blue-400/50 text-blue-700 bg-blue-50",
    },
  };

  const cfg = configs[type] ?? configs.normal;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-label text-[9px] uppercase tracking-[0.18em] border px-2.5 py-1 ${cfg.color}`}
    >
      {cfg.icon}
      {label}
    </span>
  );
}
