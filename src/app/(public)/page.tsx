import type { Metadata } from "next";
import { LuckyWheelSection } from "@/components/home/LuckyWheelSection";

export const metadata: Metadata = {
  title: "Hôm Nay Ăn Gì?",
  description:
    "Khám phá hàng nghìn món ăn ngon mỗi ngày. Gợi ý ngẫu nhiên, công thức từ nhiều nguồn, dành cho mọi khẩu vị.",
};

export const revalidate = 300;

export default function HomePage() {
  return <LuckyWheelSection />;
}
