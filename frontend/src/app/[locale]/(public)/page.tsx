import { getTranslations } from "next-intl/server";
import { LuckyWheelSection } from "@/components/home/LuckyWheelSection";

export async function generateMetadata({ params }: any) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export const revalidate = 300;

export default async function HomePage({ params }: any) {
  return (
    <div className="flex flex-col items-center w-full">
      <LuckyWheelSection />
    </div>
  );
}
