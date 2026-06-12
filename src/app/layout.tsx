import type { Metadata } from "next";
import {
  Anybody,
  Hanken_Grotesk,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "700", "800", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | HomNayAnGi",
    default: "HomNayAnGi — Hôm nay ăn gì?",
  },
  description:
    "Khám phá hàng nghìn món ăn ngon mỗi ngày. Gợi ý ngẫu nhiên, công thức từ nhiều nguồn, dành cho mọi khẩu vị.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${anybody.variable} ${hankenGrotesk.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zen-cream text-on-surface">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
