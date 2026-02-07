import { Header, PageHero, Footer } from "@/components";
import { SlideEmbed } from "@/components/molecules";

export default function VapaLinksPage() {
  const embedUrl = process.env.VAPA_LINKS_SLIDES_URL ?? "";

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
        imageAlt="Business connections and partnerships"
        label="RESOURCES"
        title="VAPA Links"
        subtitle="Useful resources and partner connections"
        height={350}
      />
      <section className="flex flex-col gap-8 md:gap-12 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
        <SlideEmbed embedUrl={embedUrl} title="VAPA Links Presentation" />
      </section>
      <Footer />
    </main>
  );
}
