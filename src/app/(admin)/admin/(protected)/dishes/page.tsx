import type { Metadata } from "next";
import { DishesClient } from "@/components/admin/dishes/DishesClient";

export const metadata: Metadata = { title: "Quản lý món ăn — Admin" };

export default function AdminDishesPage() {
  return <DishesClient />;
}
