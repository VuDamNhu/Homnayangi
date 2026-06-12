import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./_components/SearchView";
import { SkeletonCard } from "@/components/common/SkeletonCard";

export const metadata: Metadata = {
  title: "Tìm kiếm món ăn",
  robots: { index: false, follow: true },
};

function SearchSkeleton() {
  return (
    <main className="max-w-screen-2xl mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-72 shrink-0">
        <div className="manga-border p-6 manga-shadow bg-zen-paper animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 w-3/4" />
          <div className="h-4 bg-zinc-100 w-full" />
          <div className="h-4 bg-zinc-100 w-5/6" />
          <div className="h-4 bg-zinc-100 w-4/6" />
        </div>
      </aside>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard count={6} />
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchView />
    </Suspense>
  );
}
