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
import { getRecentEvents, getRecentSpecialEvents } from "@/lib/services/events";
import { getInstagramPosts } from "@/lib/services/instagram";

export const revalidate = 43200; // 12 hours

export default async function Home() {
  const [recentEvents, specialEvents, instagramPosts] = await Promise.all([
    getRecentEvents(3),
    getRecentSpecialEvents(3),
    getInstagramPosts(),
  ]);
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" showJoinButton={false} />
      <HeroSection />
      <AboutSection posts={instagramPosts} />
      <section className="flex flex-col gap-8 md:gap-12 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-elevated">
        <MissionSection viewport={{ once: true, amount: 0.8 }} />
      </section>
      <VisionSections />
      <EventsSection events={recentEvents} specialEvents={specialEvents} />
      <CTASection />
      <Footer />
    </main>
  );
}
