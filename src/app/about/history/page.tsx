import { Header, PageHero, Footer } from "@/components";
import { HistoryContent } from "./HistoryContent";

export default function HistoryPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/history.jpg"
        imageAlt="Oil industry landscape"
        label="ABOUT VAPA"
        title="Our History"
        subtitle="Building bridges in the energy industry since 2019"
        height={400}
      />
      <HistoryContent />
      <Footer />
    </main>
  );
}
