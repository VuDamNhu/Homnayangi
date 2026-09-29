"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-compile dashboard route while user is on login page
  useEffect(() => {
    router.prefetch("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      // Gọi API đăng nhập — BE sẽ set httpOnly cookie access_token & refresh_token
      await apiFetch<{ user: UserResponse }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Lấy redirect từ query param nếu có
      const params = new URLSearchParams(window.location.search);
      const next = params.get("redirect") ?? "/admin/dashboard";
      router.push(next);
      router.refresh(); // Refresh để middleware nhận cookie mới
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại, vui lòng thử lại.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@homnayangi.vn"
          className="w-full h-10 px-3 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant"
        >
          Mật khẩu *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-10 px-3 pr-10 bg-white manga-border text-sm text-zen-ink placeholder:text-zinc-400 focus:outline-none focus:border-zen-gold transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zen-gold transition-colors"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-zen-gold text-zen-ink font-label text-xs uppercase tracking-[0.2em] font-bold manga-shadow manga-shadow-hover disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Đang xác thực…
          </>
        ) : (
          "Đăng nhập"
        )}
      </button>
    </form>
  );
}
