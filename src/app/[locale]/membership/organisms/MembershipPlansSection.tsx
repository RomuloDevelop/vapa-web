"use client";

import { motion } from "motion/react";
import { GraduationCap, Briefcase, RefreshCw, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  fadeInUp,
  defaultViewport,
  staggerDelay,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

interface MembershipPlan {
  id: string;
  icon: typeof GraduationCap;
  titleKey: string;
  price: number;
  descriptionKey: string;
  featureKeys: string[];
  buttonTextKey: string;
}

const membershipPlanDefs: MembershipPlan[] = [
  {
    id: "student",
    icon: GraduationCap,
    titleKey: "student",
    price: 5,
    descriptionKey: "studentDesc",
    featureKeys: ["studentFeature1", "studentFeature2", "studentFeature3"],
    buttonTextKey: "joinStudent",
  },
  {
    id: "active",
    icon: Briefcase,
    titleKey: "active",
    price: 60,
    descriptionKey: "activeDesc",
    featureKeys: ["activeFeature1", "activeFeature2", "activeFeature3", "activeFeature4"],
    buttonTextKey: "joinActive",
  },
  {
    id: "transition",
    icon: RefreshCw,
    titleKey: "inTransition",
    price: 30,
    descriptionKey: "inTransitionDesc",
    featureKeys: ["activeFeature1", "activeFeature2", "activeFeature3", "activeFeature4"],
    buttonTextKey: "joinTransition",
  },
];

function MembershipCard({
  plan,
  index,
  t,
}: {
  plan: MembershipPlan;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const Icon = plan.icon;

  return (
    <motion.article
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={staggerDelay(index)}
      aria-label={`${t(plan.titleKey)} membership — $${plan.price}${t("perYear")}`}
      className="flex flex-col items-center gap-6 p-10 rounded-2xl bg-surface h-full"
      style={{ width: "100%", maxWidth: 380 }}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-20">
        <Icon className="w-7 h-7 text-accent" />
      </div>

      <h3 className="text-2xl font-bold text-white">{t(plan.titleKey)}</h3>

      <div className="flex items-end gap-1">
        <span className="text-2xl font-semibold text-accent">
          $
        </span>
        <span className="text-[56px] font-bold text-white leading-none">
          {plan.price}
        </span>
        <span className="text-lg text-foreground-subtle mb-1">{t("perYear")}</span>
      </div>

      <p className="text-base md:text-[17px] text-foreground-muted text-center leading-relaxed max-w-[280px]">
        {t(plan.descriptionKey)}
      </p>

      <div className="flex flex-col gap-4 w-full flex-grow">
        {plan.featureKeys.map((featureKey, i) => (
          <div key={i} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-accent" />
            <span className="text-base md:text-[17px] text-foreground-muted">
              {t(featureKey)}
            </span>
          </div>
        ))}
      </div>

      <a
        href={MEMBERSHIP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 text-base font-semibold text-center rounded-lg transition-colors border border-border-interactive text-accent hover:bg-accent-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t(plan.buttonTextKey)}
      </a>
    </motion.article>
  );
}

export function MembershipPlansSection() {
  const t = useTranslations("Membership");

  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-elevated">
      <SectionHeader
        label={t("plans")}
        title={t("joinRenew")}
        subtitle={t("joinRenewDesc")}
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-[1240px]">
        {membershipPlanDefs.map((plan, index) => (
          <MembershipCard key={plan.id} plan={plan} index={index} t={t} />
        ))}
      </div>
    </section>
  );
}
