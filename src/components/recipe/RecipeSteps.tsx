import { cn } from "@/lib/utils";
import Image from "next/image";

export interface RecipeStep {
  stepNumber: number;
  title: string;
  body: string;
  imageUrl?: string;
  tip?: string;
  durationMinutes?: number;
}

interface RecipeStepsProps {
  steps: RecipeStep[];
  className?: string;
}

/**
 * "The Cooking Path" from Stitch design.
 * Numbered circle steps — hover fills the circle with gold.
 */
export function RecipeSteps({ steps, className }: RecipeStepsProps) {
  return (
    <div className={cn("space-y-10", className)}>
      <h3 className="font-display text-xl font-black uppercase italic text-on-surface">
        Cách Thực Hiện
      </h3>

      <ol className="space-y-10">
        {steps.map((step) => (
          <li key={step.stepNumber} className="flex gap-7 group">
            {/* Step circle */}
            <div className="shrink-0">
              <div
                className={cn(
                  "w-14 h-14 rounded-full bg-zen-paper flex items-center justify-center",
                  "font-display text-xl font-black text-zen-gold",
                  "border border-zen-gold/30",
                  "group-hover:bg-zen-gold group-hover:text-white",
                  "transition-all duration-200"
                )}
              >
                {String(step.stepNumber).padStart(2, "0")}
              </div>
            </div>

            {/* Step content */}
            <div className="pt-1 flex-1">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h4 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
                  {step.title}
                </h4>
                {step.durationMinutes && (
                  <span className="font-label text-[10px] text-zen-gold uppercase tracking-[0.1em] shrink-0">
                    ~{step.durationMinutes} phút
                  </span>
                )}
              </div>

              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {step.body}
              </p>

              {/* Optional tip */}
              {step.tip && (
                <div className="mt-3 pl-4 border-l-2 border-zen-gold/40">
                  <p className="font-label text-[10px] uppercase tracking-[0.1em] text-zen-gold mb-0.5">
                    Mẹo
                  </p>
                  <p className="font-body text-xs text-on-surface-variant italic">
                    {step.tip}
                  </p>
                </div>
              )}

              {/* Optional step image */}
              {step.imageUrl && (
                <div className="mt-4 relative h-44 manga-border overflow-hidden">
                  <Image
                    src={step.imageUrl}
                    alt={`Bước ${step.stepNumber}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
