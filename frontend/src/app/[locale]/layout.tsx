import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import { Providers } from "@/providers";
import PageTransition from "@/components/common/PageTransition";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-zen-cream text-on-surface">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="absolute top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            <PageTransition>{children}</PageTransition>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
