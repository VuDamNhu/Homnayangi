import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} — Công thức & Món ăn`,
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* CategoryHero */}
        {/* SortBar */}
        {/* DishGrid */}
        {/* Pagination */}
      </div>
    </PageContainer>
  );
}
