import { Header, PageHero, Footer } from "@/components";
import { FormersContent } from "./FormersContent";
import { getTranslations } from "next-intl/server";

export default async function FormersPage() {
  const t = await getTranslations("About");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/formers.jpg"
        imageAlt="Industrial facility"
        label={t("formerLabel")}
        title={t("formerTitle")}
        subtitle={t("formerSubtitle")}
        height={350}
      />
      <FormersContent />
      <Footer />
    </main>
  );
}
