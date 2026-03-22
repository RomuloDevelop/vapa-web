import { Header, PageHero, Footer } from "@/components";
import { AdvisoryContent } from "./AdvisoryContent";
import { getTranslations } from "next-intl/server";

export default async function AdvisoryPage() {
  const t = await getTranslations("About");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/advisory.jpg"
        imageAlt="Business meeting"
        label={t("leadership")}
        title={t("advisoryTitle")}
        subtitle={t("advisorySubtitle")}
        height={350}
      />
      <AdvisoryContent />
      <Footer />
    </main>
  );
}
