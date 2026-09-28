import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Nhà hàng gần bạn",
  robots: { index: false, follow: true },
};

export default function RestaurantsPage() {
  return (
    <PageContainer>
      <div className="py-10">
        {/* GeolocationPrompt */}
        {/* NearbyMap */}
        {/* RestaurantList */}
      </div>
    </PageContainer>
  );
}
