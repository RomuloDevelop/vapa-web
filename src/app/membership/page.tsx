import { Header, PageHero, Footer } from "@/components";
import { MembershipContent } from "./MembershipContent";

export default function MembershipPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Membership" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/membership.jpg"
        imageAlt="Professional business meeting"
        label="JOIN OUR COMMUNITY"
        title="Membership & Sponsors"
        subtitle="A unique opportunity to interchange expertise and build strong professional connections in the energy industry"
        height={400}
      />
      <MembershipContent />
      <Footer />
    </main>
  );
}
