import { cn } from "@/lib/utils";
import { DishCard, type DishCardData } from "./DishCard";
import { DishCardFeatured } from "./DishCardFeatured";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Search } from "lucide-react";

interface DishGridProps {
  dishes: DishCardData[];
  isLoading?: boolean;
  /** When true, first card uses the wide featured layout */
  withFeatured?: boolean;
  className?: string;
}

/**
 * Bento-style grid: 1 col mobile → 2 col md → 3 col lg.
 * When withFeatured=true the first item spans 2 columns.
 */
export function DishGrid({
  dishes,
  isLoading,
  withFeatured = false,
  className,
}: DishGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (!dishes.length) {
    return (
      <EmptyState
        title="Không tìm thấy món ăn"
        description="Thử từ khoá khác hoặc xem tất cả danh mục."
        icon={<Search />}
      />
    );
  }

  const [featured, ...rest] = dishes;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {withFeatured && featured ? (
        <>
          <DishCardFeatured dish={featured} badge="Nổi Bật" />
          {rest.map((dish) => (
            <DishCard key={dish.slug} dish={dish} />
          ))}
        </>
      ) : (
        dishes.map((dish) => <DishCard key={dish.slug} dish={dish} />)
      )}
    </div>
  );
}
