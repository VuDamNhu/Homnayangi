import type { Metadata } from "next";
import { FridgeAssistantView } from "./_components/FridgeAssistantView";

export const metadata: Metadata = {
  title: "Trợ Lý Tủ Lạnh — Gợi ý món từ nguyên liệu có sẵn",
  description:
    "Nhập nguyên liệu bạn đang có và nhận gợi ý món ăn phù hợp ngay lập tức. Mission: Fridge Raid!",
  alternates: {
    canonical: "/ingredients",
  },
};

export default function IngredientsPage() {
  return <FridgeAssistantView />;
}
