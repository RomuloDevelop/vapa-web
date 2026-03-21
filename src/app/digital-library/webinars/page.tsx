import { Header, PageHero, Footer } from "@/components";
import { LibraryContent } from "../LibraryContent";
import { getEvents, getEventYears } from "@/lib/services/events";

// Revalidate once per day (86400 seconds = 24 hours)
export const revalidate = 86400;

export default async function WebinarsPage() {
  const [events, years] = await Promise.all([getEvents(), getEventYears()]);

  const filterYears = ["All", ...years.map(String)];

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/digital-library.jpg"
        imageAlt="Digital library concept"
        label="KNOWLEDGE CENTER"
        title="Webinars"
        subtitle="Access recordings, presentations, and materials from our past webinars and events"
        height={350}
      />
      <LibraryContent events={events} filterYears={filterYears} />
      <Footer />
    </main>
  );
}
