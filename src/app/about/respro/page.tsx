import { Header, PageHero, Footer } from "@/components";
import { SlideEmbed } from "@/components/molecules";

export default function VapaResProPage() {
  const embedUrl = process.env.VAPA_RESPRO_SLIDES_URL ?? "";

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
        imageAlt="Professional responsibility and ethics"
        label="PROGRAM"
        title="VAPA ResPro"
        subtitle="Our professional responsibility and ethics program"
        height={350}
      />
      <section className="flex flex-col gap-8 md:gap-12 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
        <SlideEmbed embedUrl={embedUrl} title="VAPA ResPro Presentation" />
      </section>
      <Footer />
    </main>
  );
}
