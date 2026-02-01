import {
  Header,
  HeroSection,
  AboutSection,
  EventsSection,
  CTASection,
  Footer,
} from "@/components";
import { getRecentEvents } from "@/lib/services/events";

// Revalidate once per day (86400 seconds = 24 hours)
export const revalidate = 86400;

export default async function Home() {
  // Fetch the 3 most recent events from Supabase
  const recentEvents = await getRecentEvents(3);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header showJoinButton={false} />
      <HeroSection />
      <AboutSection />
      <EventsSection events={recentEvents} />
      <CTASection />
      <Footer />
    </main>
  );
}
