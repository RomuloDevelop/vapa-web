import { Header, PageHero, Footer } from "@/components";
import { AdvisoryContent } from "./AdvisoryContent";

export default function AdvisoryPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="/images/heroes/advisory.jpg"
        imageAlt="Business meeting"
        label="LEADERSHIP"
        title="Advisory Board"
        subtitle="Expert guidance shaping our vision"
        height={350}
      />
      <AdvisoryContent />
      <Footer />
    </main>
  );
}
