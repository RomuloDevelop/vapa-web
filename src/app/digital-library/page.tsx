import { Header, PageHero, Footer } from "@/components";
import { LibraryContent } from "./LibraryContent";
import { getEvents, getEventYears } from "@/lib/services/events";

// Revalidate once per day (86400 seconds = 24 hours)
export const revalidate = 86400;

export default async function DigitalLibraryPage() {
  // Fetch data server-side
  const [events, years] = await Promise.all([getEvents(), getEventYears()]);

  // Format years for filter (add "All" option)
  const filterYears = ["All", ...years.map(String)];

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-dark)]">
      <Header variant="gradient" activeNav="Digital Library" />
      <PageHero
        image="https://images.unsplash.com/photo-1632684140995-27b3244734af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        imageAlt="Digital library concept"
        label="KNOWLEDGE CENTER"
        title="Digital Library"
        subtitle="Access recordings, presentations, and materials from our past webinars and events"
        height={350}
      />
      <LibraryContent events={events} filterYears={filterYears} />
      <Footer />
    </main>
  );
}
