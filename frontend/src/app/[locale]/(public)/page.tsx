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
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8 mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8 text-center px-4 max-w-xl">{t("description")}</p>
      <LuckyWheelSection />
    </div>
  );
}
