import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dishes } from "@/data/dishes";
import { categories } from "@/data/categories";
import { getRecipesByDishId } from "@/data/recipes";
import { DishHero } from "./_components/DishHero";
import { IngredientsLoot } from "./_components/IngredientsLoot";
import { CookingPath } from "./_components/CookingPath";
import { VideoEpisode } from "./_components/VideoEpisode";
import { RelatedDishes } from "./_components/RelatedDishes";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return dishes.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dish = dishes.find((d) => d.slug === slug);
  if (!dish) return { title: "Không tìm thấy" };
  return {
    title: `${dish.name} — Công Thức Nấu Ăn`,
    description: dish.description,
    alternates: { canonical: `/dish/${slug}` },
    openGraph: {
      title: dish.name,
      description: dish.description,
      images: [{ url: dish.coverImage, width: 800, height: 600, alt: dish.name }],
    },
  };
}

export default async function DishDetailPage({ params }: Props) {
  const { slug } = await params;
  const dish = dishes.find((d) => d.slug === slug);
  if (!dish) notFound();

  const category = categories.find((c) => c.id === dish.categoryId);
  const dishRecipes = getRecipesByDishId(dish.id);
  const primaryRecipe = dishRecipes[0];

  const related = dishes
    .filter((d) => d.categoryId === dish.categoryId && d.id !== dish.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zen-cream">
      <main className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12">

        {/* ── Hero: image left / title right ──────────────────────────────── */}
        <DishHero
          dish={dish}
          categoryName={category?.name}
          categorySlug={category?.slug}
        />

        {/* ── Ingredients + Steps ──────────────────────────────────────────── */}
        {primaryRecipe ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 mb-20">
            <div className="lg:col-span-4">
              <IngredientsLoot ingredients={primaryRecipe.ingredients} />
            </div>
            <div className="lg:col-span-8">
              <CookingPath steps={primaryRecipe.steps} />
            </div>
          </section>
        ) : (
          <section className="mb-20 border border-zen-gold/20 bg-zen-paper px-8 py-12 text-center">
            <p className="font-display text-base font-black uppercase italic text-on-surface-variant">
              Đang Cập Nhật
            </p>
            <p className="font-body text-sm text-on-surface-variant/60 mt-2">
              Công thức chi tiết đang được các đầu bếp cộng đồng chuẩn bị. Ghé lại sớm nhé!
            </p>
          </section>
        )}

        {/* ── Video Episode ────────────────────────────────────────────────── */}
        {primaryRecipe && (
          <VideoEpisode
            recipeName={primaryRecipe.title}
            episodeLabel="Tập mới nhất từ HomNayAnGi..."
            coverImage={primaryRecipe.coverImage}
          />
        )}

        {/* ── Related Quests ───────────────────────────────────────────────── */}
        <RelatedDishes dishes={related} />

      </main>
    </div>
  );
}
