import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm space-y-6 bg-background rounded-xl border p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Recipe AI</h1>
          <p className="text-sm text-muted-foreground">Đăng nhập quản trị</p>
        </div>
        {/* LoginForm */}
      </div>
    </div>
  );
}
