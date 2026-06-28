import { Header, PageHero, Footer } from "@/components";
import { getTranslations } from "next-intl/server";
import { EarthquakeReliefContent } from "./EarthquakeReliefContent";
import { WaysToGiveSection } from "./WaysToGiveSection";

export default async function VenezuelaEarthquakePage() {
  const t = await getTranslations("EarthquakeRelief");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Venezuela Earthquake Support" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/donations.jpg"
        imageAlt="Venezuela earthquake humanitarian relief"
        label={t("label")}
        title={t("title")}
        subtitle={t("subtitle")}
        height={450}
      />
      <EarthquakeReliefContent />
      <WaysToGiveSection />
      <Footer />
    </main>
  );
}
