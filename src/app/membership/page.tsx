import { Header, PageHero, Footer } from "@/components";
import { MembershipContent } from "./MembershipContent";

export default function MembershipPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header variant="gradient" activeNav="Membership" />
      <PageHero
        image="https://images.unsplash.com/photo-1758518727820-28491c194bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3ODkyNTd8&ixlib=rb-4.1.0&q=80&w=1080"
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
