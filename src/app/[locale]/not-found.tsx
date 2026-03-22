import { Header, Footer } from "@/components";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("Errors");
  const tc = await getTranslations("Common");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="solid" />
      <div id="main-content" tabIndex={-1} />
      <div className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="max-w-md text-center flex flex-col gap-6">
          <span className="text-xs font-semibold text-accent tracking-[2px]">
            {t("notFound")}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("pageNotFound")}
          </h1>
          <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
            {t("pageNotFoundDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="px-8 py-4 bg-accent text-surface text-sm font-semibold rounded hover:opacity-90 transition-opacity text-center"
            >
              {tc("backToHome")}
            </a>
            <a
              href="/about/history"
              className="px-8 py-4 text-foreground-muted text-sm font-medium rounded border border-border-accent-strong hover:bg-white/5 transition-colors text-center"
            >
              {t("aboutVapa")}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
