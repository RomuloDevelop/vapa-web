"use client";

import { BookOpen, Users, Calendar, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconCard, SectionHeader } from "@/components/molecules";

export function ImpactSection() {
  const t = useTranslations("Donations");

  const impactAreas = [
    {
      icon: BookOpen,
      title: t("educationalPrograms"),
      description: t("educationalDesc"),
    },
    {
      icon: Users,
      title: t("mentorshipPrograms"),
      description: t("mentorshipDesc"),
    },
    {
      icon: Calendar,
      title: t("communityEvents"),
      description: t("communityEventsDesc"),
    },
    {
      icon: Globe,
      title: t("communityGrowth"),
      description: t("communityGrowthDesc"),
    },
  ];

  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-section">
      <SectionHeader
        label={t("yourImpact")}
        title={t("whereGoesTitle")}
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1280px]">
        {impactAreas.map((item, index) => (
          <IconCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
