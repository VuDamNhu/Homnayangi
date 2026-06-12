"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Khám Phá", href: "/" },
  { label: "Công Thức", href: "/search" },
  { label: "Trợ Lý Tủ Lạnh", href: "/ingredients" },
] as const;

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-zen-cream/90 backdrop-blur-md border-b-2 border-zen-ink/10 shadow-[0_4px_0px_0px_rgba(197,160,40,0.15)]">
      <div className="max-w-screen-2xl mx-auto px-5 md:px-10 flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-black italic uppercase tracking-tighter text-zen-gold shrink-0"
        >
          HomNayAnGi
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant hover:text-zen-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Inline search — desktop */}
          <form onSubmit={handleSearch} className="relative hidden sm:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món ăn..."
              className={cn(
                "manga-border bg-transparent px-4 py-1.5 w-48 lg:w-64",
                "font-label text-sm placeholder:text-on-surface-variant/40",
                "focus:outline-none focus:border-zen-gold transition-colors"
              )}
            />
            <button type="submit" className="absolute right-3 text-on-surface-variant hover:text-zen-gold transition-colors">
              <Search size={16} />
            </button>
          </form>

          {/* Search icon — mobile */}
          <button
            className="sm:hidden p-2 text-on-surface-variant hover:text-zen-gold transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Tìm kiếm"
          >
            <Search size={20} />
          </button>

          <button
            className="p-2 text-on-surface-variant hover:text-zen-gold transition-colors"
            aria-label="Thông báo"
          >
            <Bell size={20} />
          </button>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-zen-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="sm:hidden px-5 pb-3 border-t border-zen-ink/10">
          <form onSubmit={handleSearch} className="relative flex items-center mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món ăn..."
              autoFocus
              className={cn(
                "manga-border bg-transparent px-4 py-2 w-full",
                "font-label text-sm placeholder:text-on-surface-variant/40",
                "focus:outline-none focus:border-zen-gold transition-colors"
              )}
            />
            <button type="submit" className="absolute right-3 text-on-surface-variant hover:text-zen-gold transition-colors">
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t-2 border-zen-ink/10 bg-zen-cream">
          <div className="px-5 py-4 flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-label text-sm uppercase tracking-[0.15em] text-on-surface-variant hover:text-zen-gold transition-colors py-2 border-b border-zen-ink/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
