"use client";

import { motion } from "motion/react";
import { Heart, HandHelping, Award, Trophy, Star, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  fadeInUp,
  defaultViewport,
  defaultTransition,
  staggerDelay,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

interface DonationTier {
  id: string;
  icon: typeof Heart;
  nameKey: string;
  amountKey: string;
  stripeAmount: number;
  popular: boolean;
  height: string;
}

const donationTierDefs: DonationTier[] = [
  {
    id: "friend",
    icon: Heart,
    nameKey: "friend",
    amountKey: "friendRange",
    stripeAmount: 25000,
    popular: false,
    height: "h-[280px]",
  },
  {
    id: "supporter",
    icon: HandHelping,
    nameKey: "supporter",
    amountKey: "supporterRange",
    stripeAmount: 50000,
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "advocate",
    icon: Award,
    nameKey: "advocate",
    amountKey: "advocateRange",
    stripeAmount: 100000,
    popular: true,
    height: "h-[370px]",
  },
  {
    id: "champion",
    icon: Trophy,
    nameKey: "champion",
    amountKey: "championRange",
    stripeAmount: 200000,
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "visionary",
    icon: Star,
    nameKey: "visionary",
    amountKey: "visionaryRange",
    stripeAmount: 400000,
    popular: false,
    height: "h-[280px]",
  },
];

function TierCard({
  tier,
  index,
  t,
  tc,
}: {
  tier: DonationTier;
  index: number;
  t: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
}) {
  const Icon = tier.icon;
  const stripeUrl = `${process.env.NEXT_PUBLIC_STRIPE_BASE_URL!}?__prefilled_amount=${tier.stripeAmount}`;
  const tierName = t(tier.nameKey);
  const tierAmount = t(tier.amountKey);

  return (
    <motion.article
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={staggerDelay(index)}
      aria-label={`${tierName} donation tier — ${tierAmount}`}
      className={`flex flex-col items-center justify-end gap-4 p-7 rounded-t-xl rounded-b-xl sm:rounded-b-none ${tier.height} ${
        tier.popular
          ? "bg-surface border-2 border-accent"
          : index % 2 === 1
            ? "bg-surface-sunken"
            : "bg-surface"
      }`}
    >
      {tier.popular && (
        <span className="px-3 py-1.5 text-xs font-bold tracking-wider text-surface bg-accent rounded-full">
          {t("makeADifferenceLabel")}
        </span>
      )}

      <div
        className={`flex items-center justify-center rounded-full ${
          tier.popular
            ? "w-14 h-14 bg-accent"
            : "w-12 h-12 bg-accent-20"
        }`}
      >
        <Icon
          className={`${tier.popular ? "w-[26px] h-[26px]" : "w-[22px] h-[22px]"} ${
            tier.popular
              ? "text-surface"
              : "text-accent"
          }`}
        />
      </div>

      <h3
        className={`font-bold text-white ${tier.popular ? "text-[22px]" : "text-xl"}`}
      >
        {tierName}
      </h3>

      <span
        className={`font-bold text-accent ${tier.popular ? "text-[32px]" : "text-[28px]"}`}
      >
        {tierAmount}
      </span>

      <a
        href={stripeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-2.5 text-sm font-semibold text-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          tier.popular
            ? "bg-accent text-surface hover:opacity-90"
            : "border border-border-interactive text-accent hover:bg-accent-10"
        }`}
      >
        {tier.popular ? tc("donateNow") : tc("donate")}
      </a>
    </motion.article>
  );
}

export function DonationTiersSection() {
  const t = useTranslations("Donations");
  const tc = useTranslations("Common");

  return (
    <section id="donate" className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-elevated">
      <SectionHeader
        label={t("givingLevels")}
        title={t("selectImpact")}
        subtitle={t("selectImpactDesc")}
        align="center"
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...defaultTransition, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-5 py-4 px-5 sm:px-8 rounded-xl bg-accent-20 w-full sm:w-auto"
      >
        <Mail className="w-6 h-6 text-accent" />
        <p className="text-base text-foreground font-bold text-center sm:text-left">
          {t("certificateNote")}{" "}
          <a
            href="mailto:donations@vapa-us.org"
            className="text-accent hover:underline"
          >
            donations@vapa-us.org
          </a>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-0 items-end w-full max-w-[1280px]">
        {donationTierDefs.map((tier, index) => (
          <TierCard
            key={tier.id}
            tier={tier}
            index={index}
            t={t}
            tc={tc}
          />
        ))}
      </div>
    </section>
  );
}
