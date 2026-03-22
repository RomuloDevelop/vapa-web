import { Header, PageHero, Footer } from "@/components";
import { EventCard } from "@/app/[locale]/digital-library/organisms/EventCard";
import { getRecentEvents } from "@/lib/services/events";
import { getTranslations } from "next-intl/server";

export const revalidate = 86400;

export default async function WebinarsPage() {
  const [events, t, tNav] = await Promise.all([
    getRecentEvents(5),
    getTranslations("Events"),
    getTranslations("Navigation"),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Events" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/webinars.jpg"
        imageAlt="Webinar presentation"
        label={tNav("events")}
        title={tNav("webinars")}
        subtitle={tNav("webinarsDesc")}
        height={350}
      />

      <section className="flex flex-col items-center gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20 bg-surface-section">
        <div className="w-full lg:w-[60vw] lg:min-w-[600px] lg:max-w-[1000px] flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-2 md:gap-4">
            <span className="text-xs md:text-sm font-semibold text-accent tracking-[2px]">
              {t("recentWebinars")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white">
              {t("latestSessions")}
            </h2>
            <p className="text-sm md:text-base text-foreground-muted max-w-2xl">
              {t("latestSessionsDesc")}
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
              {t("noWebinars")}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
