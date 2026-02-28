import { Header, PageHero, Footer } from "@/components";
import { requireMemberAuth } from "@/lib/auth";
import { fetchPresentations } from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import { PresentationsContent } from "./PresentationsContent";

export const dynamic = "force-dynamic";

export default async function PresentationsPage() {
  await requireMemberAuth();
  const presentations = await unwrap(fetchPresentations());

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <PageHero
        image="/images/heroes/digital-library.jpg"
        imageAlt="Presentations and slides"
        label="KNOWLEDGE CENTER"
        title="Presentations"
        subtitle="Slides and materials from presentations"
        height={350}
      />
      {presentations.length > 0 ? (
        <PresentationsContent presentations={presentations} />
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
          <p className="text-foreground-muted text-center max-w-md">
            No presentations available yet. Check back soon!
          </p>
        </section>
      )}
      <Footer />
    </main>
  );
}
