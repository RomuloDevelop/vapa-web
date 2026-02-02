"use client";

import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { IconCard, SectionHeader } from "@/components/molecules";

const benefits = [
  {
    icon: Users,
    title: "Professional Network",
    description:
      "Connect with Venezuelan energy professionals in the Houston area and beyond",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description:
      "Access courses, seminars, and lunch-and-learn sessions on state-of-the-art technologies",
  },
  {
    icon: Calendar,
    title: "Exclusive Events",
    description:
      "Participate in exclusive events and assist in organizing association activities",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Advance your career through mentorship programs and professional development",
  },
];

export function BenefitsSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-raised">
      <SectionHeader
        label="WHY JOIN VAPA"
        title="Membership Benefits"
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
