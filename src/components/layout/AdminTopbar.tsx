"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dishes": "Món ăn",
  "/admin/dishes/new": "Thêm món ăn",
  "/admin/recipes": "Công thức",
  "/admin/recipes/new": "Thêm công thức",
  "/admin/categories": "Danh mục",
  "/admin/ingredients": "Nguyên liệu",
  "/admin/banners": "Banner",
  "/admin/feedbacks": "Phản hồi",
  "/admin/notifications": "Thông báo",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Cài đặt",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [key, label] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key + "/")) return label;
  }
  return "Admin";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const isRoot = pathname === "/admin/dashboard";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 bg-white shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link
          href="/admin/dashboard"
          className="hover:text-zen-gold transition-colors"
        >
          Admin
        </Link>
        {!isRoot && (
          <>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-zinc-900 font-medium">{title}</span>
          </>
        )}
      </nav>

      {/* User menu */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-zinc-900 leading-none">
              Admin
            </p>
            <p className="text-[10px] text-zinc-400 leading-none mt-0.5">
              admin@homnayangi.vn
            </p>
          </div>
          <div className="w-8 h-8 bg-zen-gold flex items-center justify-center text-zen-ink text-xs font-black">
            A
          </div>
        </div>
        <Link
          href="/admin/login"
          title="Đăng xuất"
          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
        </Link>
      </div>
    </header>
  );
}
