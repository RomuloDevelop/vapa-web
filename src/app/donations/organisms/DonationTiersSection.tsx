"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Heart, HandHelping, Award, Trophy, Star } from "lucide-react";
import {
  fadeInUp,
  defaultViewport,
  staggerDelay,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const DonationModal = dynamic(
  () => import("@/components/molecules/DonationModal").then((mod) => mod.DonationModal),
  { ssr: false }
);

const donationTiers = [
  {
    id: "friend",
    icon: Heart,
    name: "Friend",
    amount: "$250+",
    popular: false,
    height: "h-[280px]",
  },
  {
    id: "supporter",
    icon: HandHelping,
    name: "Supporter",
    amount: "$500+",
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "advocate",
    icon: Award,
    name: "Advocate",
    amount: "$1,000+",
    popular: true,
    height: "h-[370px]",
  },
  {
    id: "champion",
    icon: Trophy,
    name: "Champion",
    amount: "$2,000+",
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "visionary",
    icon: Star,
    name: "Visionary",
    amount: "$4,000+",
    popular: false,
    height: "h-[280px]",
  },
];

function TierCard({
  tier,
  index,
  onDonateClick,
}: {
  tier: (typeof donationTiers)[0];
  index: number;
  onDonateClick: () => void;
}) {
  const Icon = tier.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={staggerDelay(index)}
      className={`flex flex-col items-center justify-end gap-4 p-7 rounded-t-xl ${tier.height} ${
        tier.popular
          ? "bg-surface border-2 border-accent"
          : index % 2 === 1
            ? "bg-surface-section"
            : "bg-surface"
      }`}
    >
      {tier.popular && (
        <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-surface bg-accent rounded-full">
          MAKE A DIFFERENCE
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
        {tier.name}
      </h3>

      <span
        className={`font-bold text-accent ${tier.popular ? "text-[32px]" : "text-[28px]"}`}
      >
        {tier.amount}
      </span>

      <button
        onClick={onDonateClick}
        className={`w-full py-2.5 text-sm font-semibold text-center rounded-md transition-colors ${
          tier.popular
            ? "bg-accent text-surface hover:opacity-90"
            : "border border-border-accent text-accent hover:bg-accent-10"
        }`}
      >
        {tier.popular ? "Donate Now" : "Donate"}
      </button>
    </motion.div>
  );
}

export function DonationTiersSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-elevated">
        <SectionHeader
          label="GIVING LEVELS"
          title="Choose Your Impact Level"
          subtitle="Every contribution makes a difference. Select a giving level that works for you."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 items-end w-full max-w-[1280px]">
          {donationTiers.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={index}
              onDonateClick={() => setIsModalOpen(true)}
            />
          ))}
        </div>
      </section>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
