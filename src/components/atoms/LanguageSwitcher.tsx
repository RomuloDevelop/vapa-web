"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={() => switchLocale(locale === "en" ? "es" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-foreground-muted hover:text-accent border border-border-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={locale === "en" ? "Cambiar a español" : "Switch to English"}
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
