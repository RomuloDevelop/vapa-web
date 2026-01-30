import { Header, PageHero, Footer } from "@/components";
import { LibraryContent } from "./LibraryContent";

export default function DigitalLibraryPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header variant="gradient" activeNav="Digital Library" />
      <PageHero
        image="https://images.unsplash.com/photo-1632684140995-27b3244734af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        imageAlt="Digital library concept"
        label="KNOWLEDGE CENTER"
        title="Digital Library"
        subtitle="Access recordings, presentations, and materials from our past webinars and events"
        height={350}
      />
      <LibraryContent />
      <Footer />
    </main>
  );
}
