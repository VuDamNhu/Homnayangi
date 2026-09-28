import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Vòng quay may mắn",
  robots: { index: false, follow: true },
};

export default function LuckyWheelPage() {
  return (
    <PageContainer>
      <div className="py-10">
        {/* DietModeSelector */}
        {/* LuckyWheel */}
        {/* RandomResultCard */}
      </div>
    </PageContainer>
  );
}
