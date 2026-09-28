"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: "en" | "vi") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2 text-sm font-semibold">
      <button
        onClick={() => switchLanguage("vi")}
        className={`px-2 py-1 rounded transition-colors ${locale === "vi" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
      >
        VI
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
      >
        EN
      </button>
    </div>
  );
}
