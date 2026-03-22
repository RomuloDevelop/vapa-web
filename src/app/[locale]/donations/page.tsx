import { Header, PageHero, Footer } from "@/components";
import { DonationsContent } from "./DonationsContent";
import { getTranslations } from "next-intl/server";

export default async function DonationsPage() {
  const t = await getTranslations("Donations");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Donations" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/donations.jpg"
        imageAlt="Oil refinery industrial landscape"
        label={t("supportMission")}
        title={t("makeADifference")}
        subtitle={t("heroSubtitle")}
        height={450}
      />
      <DonationsContent />
      <Footer />
    </main>
  );
}
