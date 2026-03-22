import { Header, PageHero, Footer } from "@/components";
import { DirectorsContent } from "./DirectorsContent";
import { getTranslations } from "next-intl/server";

export default async function DirectorsPage() {
  const t = await getTranslations("About");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/directors.jpg"
        imageAlt="Professional team"
        label={t("leadership")}
        title={t("boardTitle")}
        subtitle="2025 - 2027 Term"
        height={350}
      />
      <DirectorsContent />
      <Footer />
    </main>
  );
}
