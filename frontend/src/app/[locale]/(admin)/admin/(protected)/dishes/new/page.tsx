import type { Metadata } from "next";
import { DishForm } from "@/components/admin/dishes/DishForm";

export const metadata: Metadata = { title: "Thêm món ăn — Admin" };

export default function AdminDishNewPage() {
  return <DishForm mode="create" />;
}
