export const siteConfig = {
  name: "Recipe AI",
  tagline: "Hôm nay ăn gì?",
  description:
    "Khám phá hàng nghìn món ăn ngon mỗi ngày. Gợi ý ngẫu nhiên, công thức từ nhiều nguồn.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og/default.jpg",
  locale: "vi_VN",
} as const;
