"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin/dashboard" className="text-lg font-bold">
          {siteConfig.name}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {adminNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
