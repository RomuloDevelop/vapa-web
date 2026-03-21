import { Header, PageHero, Footer } from "@/components";
import { FormersContent } from "./FormersContent";

export default function FormersPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/formers.jpg"
        imageAlt="Industrial facility"
        label="LEGACY"
        title="Former Members"
        subtitle="Honoring our founding leaders (2020-2021)"
        height={350}
      />
      <FormersContent />
      <Footer />
    </main>
  );
}
