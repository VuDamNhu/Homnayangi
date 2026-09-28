"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  Tag,
  Leaf,
  Image,
  MessageSquare,
  Bell,
  BarChart2,
  Settings,
  LogOut,
  ChefHat,
} from "lucide-react";

const navGroups = [
  {
    label: "CONTENT",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Món ăn", href: "/admin/dishes", icon: UtensilsCrossed },
      { label: "Công thức", href: "/admin/recipes", icon: BookOpen },
      { label: "Danh mục", href: "/admin/categories", icon: Tag },
      { label: "Nguyên liệu", href: "/admin/ingredients", icon: Leaf },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { label: "Banner", href: "/admin/banners", icon: Image },
      { label: "Phản hồi", href: "/admin/feedbacks", icon: MessageSquare },
      { label: "Thông báo", href: "/admin/notifications", icon: Bell },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-zen-ink text-zinc-300 h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-8 h-8 bg-zen-gold flex items-center justify-center">
          <ChefHat size={16} className="text-zen-ink" />
        </div>
        <div>
          <p className="font-display text-sm font-black uppercase tracking-tighter text-white leading-none">
            HomNayAnGi
          </p>
          <p className="font-label text-[9px] uppercase tracking-[0.25em] text-zinc-500 leading-none mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-zinc-500 px-3 mb-1.5">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-zen-gold text-zen-ink"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: user + logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 bg-zen-gold flex items-center justify-center text-zen-ink text-xs font-black shrink-0">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate leading-none">
              Admin
            </p>
            <p className="text-[10px] text-zinc-500 truncate leading-none mt-0.5">
              admin@homnayangi.vn
            </p>
          </div>
        </div>
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={14} />
          Đăng xuất
        </Link>
      </div>
    </aside>
  );
}
