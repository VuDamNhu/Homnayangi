import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Chỉnh sửa nguyên liệu" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminIngredientEditPage({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chỉnh sửa nguyên liệu</h1>
      {/* IngredientForm */}
    </div>
  );
}
