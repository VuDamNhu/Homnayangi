import type { Metadata } from "next";
import { RecipeForm } from "@/components/admin/recipes/RecipeForm";

export const metadata: Metadata = { title: "Thêm công thức — Admin" };

export default function AdminRecipeNewPage() {
  return <RecipeForm mode="create" />;
}
