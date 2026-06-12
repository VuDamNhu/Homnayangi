import { SkeletonCard } from "@/components/common/SkeletonCard";
import { PageContainer } from "@/components/layout/PageContainer";

export default function RecipeDetailLoading() {
  return (
    <PageContainer>
      <SkeletonCard />
    </PageContainer>
  );
}
