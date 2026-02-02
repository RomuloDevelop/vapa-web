"use client";

import { BookOpen, Users, Calendar, Globe } from "lucide-react";
import { IconCard, SectionHeader } from "@/components/molecules";

const impactAreas = [
  {
    icon: BookOpen,
    title: "Educational Programs",
    description:
      "Fund webinars, seminars, and technical courses for energy professionals",
  },
  {
    icon: Users,
    title: "Mentorship Programs",
    description:
      "Support the next generation through VAPA Links mentoring initiatives",
  },
  {
    icon: Calendar,
    title: "Community Events",
    description:
      "Enable networking events and professional gatherings for members",
  },
  {
    icon: Globe,
    title: "Community Growth",
    description:
      "Expand our reach and support more Venezuelan energy professionals",
  },
];

export function ImpactSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-raised">
      <SectionHeader
        label="YOUR IMPACT"
        title="Where Your Donation Goes"
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
