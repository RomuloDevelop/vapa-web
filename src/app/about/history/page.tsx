import { Header, PageHero, Footer } from "@/components";
import { HistoryContent } from "./HistoryContent";

export default function HistoryPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1694521373033-9c4aa609c358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzgyMzd8&ixlib=rb-4.1.0&q=80&w=1080"
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
