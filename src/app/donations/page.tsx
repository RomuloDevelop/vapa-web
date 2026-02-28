import { Header, PageHero, Footer } from "@/components";
import { DonationsContent } from "./DonationsContent";

export default function DonationsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Donations" />
      <PageHero
        image="/images/heroes/donations.jpg"
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
