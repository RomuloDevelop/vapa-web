import { Header, PageHero, Footer } from "@/components";
import { MemberAccessGate } from "@/components/molecules";
import { getSession } from "@/lib/auth";
import { fetchPresentations } from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import { getTranslations } from "next-intl/server";
import { PresentationsContent } from "./PresentationsContent";

export const dynamic = "force-dynamic";

export default async function PresentationsPage() {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations("DigitalLibrary"),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/digital-library.jpg"
        imageAlt="Presentations and slides"
        label={t("digitalLibrary")}
        title={t("presentationsTitle")}
        subtitle={t("presentationsDesc")}
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
  const [presentations, t] = await Promise.all([
    unwrap(fetchPresentations()),
    getTranslations("DigitalLibrary"),
  ]);
  if (presentations.length > 0) {
    return <PresentationsContent presentations={presentations} />;
  }
  return (
    <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
      <p className="text-foreground-muted text-center max-w-md">
        {t("noResults")}
      </p>
    </section>
  );
}
