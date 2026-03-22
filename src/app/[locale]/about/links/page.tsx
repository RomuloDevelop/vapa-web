import { Header, PageHero, Footer } from "@/components";
import { SlideEmbed } from "@/components/molecules";
import { getTranslations } from "next-intl/server";

export default async function VapaLinksPage() {
  const t = await getTranslations("About");
  const embedUrl = process.env.VAPA_LINKS_SLIDES_URL ?? "";

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/links.jpg"
        imageAlt="Business connections and partnerships"
        label={t("resources")}
        title="VAPA Links"
        subtitle={t("linksSubtitle")}
        height={350}
      />
      <section className="flex flex-col gap-8 md:gap-12 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
        <SlideEmbed embedUrl={embedUrl} title="VAPA Links Presentation" />
      </section>
      <Footer />
    </main>
  );
}
