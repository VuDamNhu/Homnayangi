import type { Metadata } from "next";
import { RecipesClient } from "@/components/admin/recipes/RecipesClient";

export const metadata: Metadata = { title: "Quản lý công thức — Admin" };

export default function AdminRecipesPage() {
  return <RecipesClient />;
}
