import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Quản lý món ăn" };

export default function AdminDishesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Món ăn</h1>
        <Link href="/admin/dishes/new">Thêm món</Link>
      </div>
      {/* FilterBar */}
      {/* DataTable */}
    </div>
  );
}
