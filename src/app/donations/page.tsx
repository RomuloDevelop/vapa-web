import { Header, PageHero, Footer } from "@/components";
import { DonationsContent } from "./DonationsContent";

export default function DonationsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Donations" />
      <PageHero
        image="https://images.unsplash.com/photo-1610894065081-fce3e6833dcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3OTIwODh8&ixlib=rb-4.1.0&q=80&w=1080"
        imageAlt="Oil refinery industrial landscape"
        label="SUPPORT OUR MISSION"
        title="Make a Difference"
        subtitle="Your generous donation helps us continue supporting Venezuelan energy professionals through education, networking, and career development programs."
        height={450}
      />
      <DonationsContent />
      <Footer />
    </main>
  );
}
