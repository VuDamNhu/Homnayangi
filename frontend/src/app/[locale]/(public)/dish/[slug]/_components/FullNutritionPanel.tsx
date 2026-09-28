import { NutritionCard } from "@/components/common/NutritionCard";
import type { NutritionInfo } from "@/data/types";

interface FullNutritionPanelProps {
  nutrition: NutritionInfo;
}

export function FullNutritionPanel({ nutrition }: FullNutritionPanelProps) {
  return (
    <div className="manga-border manga-shadow bg-zen-paper">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-zen-ink/8">
        <div className="flex items-center gap-3 mb-0.5">
          <span className="font-label text-[9px] uppercase tracking-[0.4em] text-zen-gold">
            Mỗi khẩu phần
          </span>
          <div className="h-px flex-1 bg-zen-gold/20" />
        </div>
        <h3 className="font-display text-base font-black italic uppercase text-on-surface">
          Dinh Dưỡng
        </h3>
      </div>

      {/* Main macros */}
      <div className="p-5">
        <NutritionCard data={nutrition} />

        {/* Extra nutrients */}
        <div className="mt-4 space-y-2.5 pt-4 border-t border-dashed border-zen-gold/20">
          <ExtraRow label="Chất xơ" value={nutrition.fiber} unit="g" />
          <ExtraRow label="Natri" value={nutrition.sodium} unit="mg" highlight={nutrition.sodium > 800} />
        </div>

        {/* Disclaimer */}
        <p className="mt-4 font-label text-[9px] uppercase tracking-[0.12em] text-on-surface-variant/40 text-center leading-relaxed">
          Ước tính trung bình · Giá trị có thể thay đổi theo công thức
        </p>
      </div>
    </div>
  );
}

function ExtraRow({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </span>
      <span
        className={`font-mono text-[13px] font-bold leading-none ${
          highlight ? "text-orange-500" : "text-on-surface"
        }`}
      >
        {value}
        <span className="font-label text-[9px] font-normal ml-0.5 text-on-surface-variant">
          {unit}
        </span>
      </span>
    </div>
  );
}
