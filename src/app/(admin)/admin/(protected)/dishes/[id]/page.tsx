import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DishForm } from "@/components/admin/dishes/DishForm";
import { MOCK_DISHES } from "@/components/admin/dishes/mock-data";

export const metadata: Metadata = { title: "Chỉnh sửa món ăn — Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminDishEditPage({ params }: Props) {
  const { id } = await params;
  const dish = MOCK_DISHES.find((d) => d._id === id);
  if (!dish) notFound();

  return <DishForm mode="edit" dish={dish} />;
}
