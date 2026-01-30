import {
  Header,
  HeroSection,
  AboutSection,
  EventsSection,
  CTASection,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
