import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
    alternates: {
      canonical: `/recipe/${slug}`,
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  return (
    <PageContainer>
      <div className="space-y-10">
        {/* RecipeHero */}
        {/* RecipeMeta */}
        {/* NutritionPanel */}
        {/* RecipeIngredientList */}
        {/* RecipeStepList */}
        {/* RecipeSourceLink */}
      </div>
    </PageContainer>
  );
}
