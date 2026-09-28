import type { RecipeStep } from "@/data/types";

interface CookingPathProps {
  steps: RecipeStep[];
}

export function CookingPath({ steps }: CookingPathProps) {
  return (
    <div>
      <h3 className="font-display text-2xl font-black text-on-surface uppercase italic mb-10">
        The Cooking Path
      </h3>

      {steps.length === 0 ? (
        <p className="font-body text-sm text-on-surface-variant/60 italic">
          Các bước nấu đang được cập nhật...
        </p>
      ) : (
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.stepNumber} className="flex gap-6 md:gap-8 group">
              {/* Step number circle */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zen-paper flex items-center justify-center font-display text-xl md:text-2xl text-zen-gold border border-zen-gold/30 group-hover:bg-zen-gold group-hover:text-white transition-all duration-200">
                  {String(step.stepNumber).padStart(2, "0")}
                </div>
              </div>

              {/* Step content */}
              <div className="pt-2 min-w-0">
                <h4 className="font-label text-sm font-bold uppercase tracking-widest text-on-surface mb-3">
                  {step.title}
                </h4>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {step.body}
                </p>
                {step.tip && (
                  <p className="font-body text-[13px] italic mt-3 border-l-2 border-zen-gold/40 pl-4 text-zen-gold/80">
                    {step.tip}
                  </p>
                )}
                {step.durationMinutes && (
                  <span className="inline-block mt-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                    ~{step.durationMinutes} phút
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
