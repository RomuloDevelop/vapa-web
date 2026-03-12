import { Header, PageHero, Footer } from "@/components";
import { MemberAccessGate } from "@/components/molecules";
import { getSession } from "@/lib/auth";
import { fetchPresentations } from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import { PresentationsContent } from "./PresentationsContent";

export const dynamic = "force-dynamic";

export default async function PresentationsPage() {
  const session = await getSession();

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
      {!session?.user ? (
        <MemberAccessGate description="This section is exclusive to VAPA members. Sign in to access presentations and slides, or register to see our exclusive content." />
      ) : (
        <PresentationsWithData />
      )}
      <Footer />
    </main>
  );
}

async function PresentationsWithData() {
  const presentations = await unwrap(fetchPresentations());
  if (presentations.length > 0) {
    return <PresentationsContent presentations={presentations} />;
  }
  return (
    <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
      <p className="text-foreground-muted text-center max-w-md">
        No presentations available yet. Check back soon!
      </p>
    </section>
  );
}
