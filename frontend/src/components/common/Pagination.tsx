"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <nav
      aria-label="Phân trang"
      className={cn("flex justify-center items-center gap-3", className)}
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
        className={cn(
          "p-3 manga-border manga-shadow-hover transition-all",
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:border-zen-gold hover:text-zen-gold"
        )}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page numbers */}
      <div className="flex gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "w-12 h-12 manga-border font-display text-base font-bold transition-all",
              page === currentPage
                ? "bg-zen-gold text-white border-zen-gold"
                : "bg-transparent hover:bg-surface-high manga-shadow-hover"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
        className={cn(
          "p-3 manga-border manga-shadow-hover transition-all",
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:border-zen-gold hover:text-zen-gold"
        )}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
