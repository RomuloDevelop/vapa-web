import { Header, PageHero, Footer } from "@/components";
import { FormersContent } from "./FormersContent";

export default function FormersPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1632385820047-f7cc1dbc7051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzkyNzJ8&ixlib=rb-4.1.0&q=80&w=1080"
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
