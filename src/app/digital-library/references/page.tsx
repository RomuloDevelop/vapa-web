import { Header, PageHero, Footer } from "@/components";
import { MemberAccessGate } from "@/components/molecules";
import { FileText } from "lucide-react";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const session = await getSession();
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/digital-library.jpg"
        imageAlt="Reference documents"
        label="KNOWLEDGE CENTER"
        title="References"
        subtitle="Reference documents and technical resources"
        height={350}
      />
      {!session?.user ? (
        <MemberAccessGate description="This section is exclusive to VAPA members. Sign in to access reference documents, or join VAPA to become a member." />
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
          <FileText className="w-12 h-12 text-foreground-faint" />
          <p className="text-foreground-muted text-center max-w-md">
            Welcome, {session.user?.name || "Member"}. Reference materials and
            documents will be available here soon.
          </p>
        </section>
      )}
      <Footer />
    </main>
  );
}
