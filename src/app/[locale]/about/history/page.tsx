import { Header, PageHero, Footer } from "@/components";
import { HistoryContent } from "./HistoryContent";
import { getTranslations } from "next-intl/server";

export default async function HistoryPage() {
  const t = await getTranslations("About");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/history.jpg"
        imageAlt="Oil industry landscape"
        label={t("opportunities")}
        title={t("ourJourney")}
        subtitle={t("connectingTalent")}
        height={400}
      />
      <HistoryContent />
      <Footer />
    </main>
  );
}
