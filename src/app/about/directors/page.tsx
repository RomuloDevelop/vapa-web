import { Header, PageHero, Footer, PersonCard } from "@/components";
import { DirectorsContent } from "./DirectorsContent";

export default function DirectorsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1547565933-13a49bfa933d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzgzMjd8&ixlib=rb-4.1.0&q=80&w=1080"
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
