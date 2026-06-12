import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Quản lý công thức" };

export default function AdminRecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Công thức</h1>
        <Link href="/admin/recipes/new">Thêm công thức</Link>
      </div>
      {/* FilterBar */}
      {/* DataTable */}
    </div>
  );
}
