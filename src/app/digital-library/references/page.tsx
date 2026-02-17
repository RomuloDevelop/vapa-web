import { Header, PageHero, Footer } from "@/components";
import { FileText } from "lucide-react";
import { requireMemberAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const session = await requireMemberAuth();
  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Digital Library" />
      <PageHero
        image="https://images.unsplash.com/photo-1632684140995-27b3244734af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        imageAlt="Reference documents"
        label="KNOWLEDGE CENTER"
        title="References"
        subtitle="Reference documents and technical resources"
        height={350}
      />
      <section className="flex flex-col items-center justify-center gap-4 px-5 md:px-10 lg:px-20 py-20 md:py-28 lg:py-36 bg-surface">
        <FileText className="w-12 h-12 text-foreground-faint" />
        <p className="text-foreground-muted text-center max-w-md">
          Welcome, {session.user?.name || "Member"}. Reference materials and
          documents will be available here soon.
        </p>
      </section>
      <Footer />
    </main>
  );
}
