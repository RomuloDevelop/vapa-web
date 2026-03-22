"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components";
import { captureError } from "@/lib/error-tracking";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");
  const tc = useTranslations("Common");

  useEffect(() => {
    captureError(error);
  }, [error]);

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="solid" />
      <div id="main-content" tabIndex={-1} />
      <div className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="max-w-md text-center flex flex-col gap-6">
          <span className="text-xs font-semibold text-accent tracking-[2px]">
            {t("error")}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("somethingWentWrong")}
          </h1>
          <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
            {t("unexpectedError")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 bg-accent text-surface text-sm font-semibold rounded hover:opacity-90 transition-opacity"
            >
              {tc("tryAgain")}
            </button>
            <a
              href="/"
              className="px-8 py-4 text-foreground-muted text-sm font-medium rounded border border-border-accent-strong hover:bg-white/5 transition-colors text-center"
            >
              {tc("goHome")}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
