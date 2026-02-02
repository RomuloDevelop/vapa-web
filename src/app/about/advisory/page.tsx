import { Header, PageHero, Footer } from "@/components";
import { AdvisoryContent } from "./AdvisoryContent";

export default function AdvisoryPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="https://images.unsplash.com/photo-1600822190943-af1721bbaa13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzkxNTN8&ixlib=rb-4.1.0&q=80&w=1080"
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
