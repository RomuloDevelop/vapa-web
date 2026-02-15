import { Header, PageHero, Footer } from "@/components";
import { Presentation } from "lucide-react";

export default function PresentationsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <PageHero
        image="https://images.unsplash.com/photo-1632684140995-27b3244734af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        imageAlt="Presentations and slides"
        label="KNOWLEDGE CENTER"
        title="Presentations"
        subtitle="Slides and materials from presentations"
        height={350}
      />
      <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
        <Presentation className="w-12 h-12 text-foreground-faint" />
        <p className="text-foreground-muted text-center max-w-md">
          Presentation slides and materials will be available here soon.
        </p>
      </section>
      <Footer />
    </main>
  );
}
