"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "recipe-ai:favorites";

interface FavoriteButtonProps {
  dishId: string;
  dishName: string;
}

export function FavoriteButton({ dishId, dishName }: FavoriteButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setIsSaved(saved.includes(dishId));
    } catch {
      // localStorage unavailable
    }
  }, [dishId]);

  const toggle = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const next = saved.includes(dishId)
        ? saved.filter((id) => id !== dishId)
        : [...saved, dishId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsSaved(!isSaved);
    } catch {
      // localStorage unavailable
    }
  };

  if (!mounted) {
    return (
      <div className="manga-border bg-zen-paper h-14 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isSaved ? `Bỏ lưu ${dishName}` : `Lưu ${dishName} vào bộ sưu tập`}
      className={cn(
        "w-full manga-border flex items-center justify-center gap-2.5 py-4 font-label text-[10px] uppercase tracking-[0.25em] transition-all duration-150 active:scale-[0.98]",
        isSaved
          ? "bg-zen-ink text-zen-gold manga-shadow-gold"
          : "bg-zen-paper text-on-surface hover:bg-zen-gold/5 manga-shadow manga-shadow-hover"
      )}
    >
      <Heart
        size={13}
        className={cn(
          "transition-all",
          isSaved ? "fill-zen-gold text-zen-gold" : "text-on-surface-variant"
        )}
      />
      {isSaved ? "Đã Lưu" : "Lưu Vào Bộ Sưu Tập"}
    </button>
  );
}
