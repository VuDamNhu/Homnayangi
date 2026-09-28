import type { Metadata } from "next";
import { ChefHat } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập — HomNayAnGi Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zen-cream flex items-center justify-center p-4 speed-lines">
      {/* Decorative corner marks */}
      <div className="fixed top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-zen-gold/30 pointer-events-none" />
      <div className="fixed top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-zen-gold/30 pointer-events-none" />
      <div className="fixed bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-zen-gold/30 pointer-events-none" />
      <div className="fixed bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-zen-gold/30 pointer-events-none" />

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white manga-border manga-shadow p-8 space-y-7">
          {/* Brand */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-zen-gold mx-auto flex items-center justify-center">
              <ChefHat size={22} className="text-zen-ink" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black italic uppercase tracking-tighter text-zen-ink leading-none">
                HomNayAnGi
              </h1>
              <p className="font-label text-[10px] uppercase tracking-[0.35em] text-on-surface-variant mt-1">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zen-ink/10" />
            <span className="font-label text-[9px] uppercase tracking-[0.3em] text-zinc-400">
              Xác thực
            </span>
            <div className="flex-1 h-px bg-zen-ink/10" />
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer note */}
        <p className="text-center font-label text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-5">
          © {new Date().getFullYear()} HomNayAnGi · Chỉ dành cho quản trị viên
        </p>
      </div>
    </div>
  );
}
