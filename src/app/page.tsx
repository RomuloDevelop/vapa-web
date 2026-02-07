import {
  Header,
  HeroSection,
  AboutSection,
  EventsSection,
  VisionSections,
  CTASection,
  Footer,
} from "@/components";
import { MissionSection } from "@/app/about/history/organisms";
import { getRecentEvents } from "@/lib/services/events";

const homeStats = [
  { value: "2019", label: "Founded" },
  { value: "TX", label: "Headquarters" },
];

export default async function Home() {
  const recentEvents = await getRecentEvents(3);
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header showJoinButton={false} />
      <HeroSection />
      <AboutSection stats={homeStats} />
      <section className="flex flex-col gap-8 md:gap-12 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-elevated">
        <MissionSection viewport={{ once: true, amount: 0.8 }} />
      </section>
      <VisionSections />
      <EventsSection events={recentEvents} />
      <CTASection />
      <Footer />
    </main>
  );
}
