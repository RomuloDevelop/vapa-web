import { Header, PageHero, Footer } from "@/components";
import { EventCard } from "@/app/digital-library/organisms/EventCard";
import { getEvents } from "@/lib/services/events";

export const revalidate = 86400;

export default async function SpecialEventsPage() {
  const events = await getEvents({ type: "special_event" });

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Events" />
      <PageHero
        image="https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        imageAlt="Special event venue"
        label="EVENTS"
        title="Special Events"
        subtitle="Conferences, galas, and landmark occasions hosted by VAPA"
        height={350}
      />

      <section className="flex flex-col items-center gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20 bg-surface-raised">
        <div className="w-full lg:w-[60vw] lg:min-w-[600px] lg:max-w-[1000px] flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-2 md:gap-4">
            <span className="text-[10px] md:text-xs font-semibold text-accent tracking-[2px]">
              ALL SPECIAL EVENTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white">
              Special Events
            </h2>
            <p className="text-sm md:text-base text-foreground-muted max-w-2xl">
              Browse all of our special events, from conferences and galas to milestone celebrations.
            </p>
          </div>

          {events.length > 0 ? (
            <div className="flex flex-col gap-6 md:gap-8">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-foreground-muted text-center py-12">
              No special events available at the moment. Check back soon!
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
