import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Tìm hiểu về Recipe AI — sứ mệnh, cách hoạt động và đội ngũ phía sau.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="py-10">
        {/* HeroBanner */}
        {/* AboutText */}
        {/* HowItWorksList */}
        {/* CallToActionBanner */}
      </div>
    </PageContainer>
  );
}
