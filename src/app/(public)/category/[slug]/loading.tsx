import { SkeletonCard } from "@/components/common/SkeletonCard";
import { PageContainer } from "@/components/layout/PageContainer";

export default function CategoryLoading() {
  return (
    <PageContainer>
      <SkeletonCard count={6} />
    </PageContainer>
  );
}
