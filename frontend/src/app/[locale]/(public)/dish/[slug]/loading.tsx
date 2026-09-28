export default function DishDetailLoading() {
  return (
    <div className="min-h-screen bg-zen-cream animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[55vh] min-h-[440px] max-h-[680px] bg-zen-ink/10" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">

          {/* Left column */}
          <div className="space-y-10">
            {/* DishMeta skeleton */}
            <div className="manga-border bg-zen-paper">
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y divide-zen-ink/8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-5 space-y-2">
                    <div className="h-4 w-4 bg-zen-ink/10 rounded-none" />
                    <div className="h-4 w-16 bg-zen-ink/10 rounded-none" />
                    <div className="h-2.5 w-12 bg-zen-ink/8 rounded-none" />
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-dashed border-zen-gold/20 flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-zen-ink/8 rounded-none" />
                ))}
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-3">
              <div className="h-2.5 w-20 bg-zen-ink/10 rounded-none" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-zen-ink/8 rounded-none" />
                <div className="h-4 w-5/6 bg-zen-ink/8 rounded-none" />
                <div className="h-4 w-4/6 bg-zen-ink/8 rounded-none" />
              </div>
            </div>

            {/* Recipe cards skeleton */}
            <div className="space-y-7">
              <div className="h-2.5 w-24 bg-zen-ink/10 rounded-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="manga-border bg-zen-paper overflow-hidden">
                    <div className="h-56 bg-zen-ink/10" />
                    <div className="p-5 space-y-3">
                      <div className="h-2 w-16 bg-zen-ink/8 rounded-none" />
                      <div className="h-5 w-3/4 bg-zen-ink/10 rounded-none" />
                      <div className="h-3 w-full bg-zen-ink/8 rounded-none" />
                      <div className="h-3 w-2/3 bg-zen-ink/8 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar skeleton */}
          <aside className="space-y-5">
            <div className="manga-border bg-zen-paper overflow-hidden">
              <div className="px-5 pt-5 pb-3 border-b border-zen-ink/8 space-y-2">
                <div className="h-2 w-20 bg-zen-ink/8 rounded-none" />
                <div className="h-5 w-24 bg-zen-ink/10 rounded-none" />
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-4 gap-px bg-zen-ink/8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-zen-paper py-5 flex flex-col items-center gap-2">
                      <div className="h-5 w-10 bg-zen-ink/10 rounded-none" />
                      <div className="h-2 w-8 bg-zen-ink/8 rounded-none" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full bg-zen-ink/8 rounded-none" />
                  <div className="h-3 w-full bg-zen-ink/8 rounded-none" />
                </div>
              </div>
            </div>
            <div className="manga-border bg-zen-paper h-14" />
            <div className="manga-border bg-zen-paper h-12" />
          </aside>
        </div>
      </div>
    </div>
  );
}
