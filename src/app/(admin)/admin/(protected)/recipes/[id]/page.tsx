import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/admin/recipes/RecipeForm";
import { MOCK_RECIPES } from "@/components/admin/recipes/mock-data";

export const metadata: Metadata = { title: "Chỉnh sửa công thức — Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminRecipeEditPage({ params }: Props) {
  const { id } = await params;
  const recipe = MOCK_RECIPES.find((r) => r._id === id);
  if (!recipe) notFound();

  return <RecipeForm mode="edit" recipe={recipe} />;
}
