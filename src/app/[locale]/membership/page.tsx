import { Header, PageHero, Footer } from "@/components";
import { MembershipContent } from "./MembershipContent";
import { getTranslations } from "next-intl/server";

export default async function MembershipPage() {
  const t = await getTranslations("Membership");

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      <Header variant="gradient" activeNav="Membership" />
      <div id="main-content" tabIndex={-1} />
      <PageHero
        image="/images/heroes/membership.jpg"
        imageAlt="Professional business meeting"
        label={t("joinCommunity")}
        title={t("membershipSponsors")}
        subtitle={t("heroSubtitle")}
        height={400}
      />
      <MembershipContent />
      <Footer />
    </main>
  );
}
