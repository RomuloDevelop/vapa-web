"use client";

import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconCard, SectionHeader } from "@/components/molecules";

export function BenefitsSection() {
  const t = useTranslations("Membership");

  const benefits = [
    {
      icon: Users,
      title: t("professionalNetwork"),
      description: t("networkDesc"),
    },
    {
      icon: BookOpen,
      title: t("educationalResources"),
      description: t("educationalDesc"),
    },
    {
      icon: Calendar,
      title: t("exclusiveEvents"),
      description: t("exclusiveEventsDesc"),
    },
    {
      icon: TrendingUp,
      title: t("careerGrowth"),
      description: t("careerGrowthDesc"),
    },
  ];

  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-section">
      <SectionHeader
        label={t("whyJoin")}
        title={t("benefits")}
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1280px]">
        {benefits.map((benefit, index) => (
          <IconCard
            key={benefit.title}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
