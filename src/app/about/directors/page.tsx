import { Header, PageHero, Footer, PersonCard } from "@/components";
import { DirectorsContent } from "./DirectorsContent";

export default function DirectorsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="/images/heroes/directors.jpg"
        imageAlt="Professional team"
        label="LEADERSHIP"
        title="Board of Directors"
        subtitle="2025 - 2027 Term"
        height={350}
      />
      <DirectorsContent />
      <Footer />
    </main>
  );
}
