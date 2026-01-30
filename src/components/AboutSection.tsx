"use client";

import { Users, GraduationCap, Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

const stats = [
  { value: "2019", label: "Founded" },
  { value: "5+", label: "Years of Impact" },
  { value: "TX", label: "Headquarters" },
];

const pillars = [
  {
    icon: Users,
    title: "Professional Unity",
    description:
      "Unite Venezuelan energy professionals while promoting technical advancement in upstream, midstream, and downstream operations.",
  },
  {
    icon: GraduationCap,
    title: "Education & Training",
    description:
      "Provide technical support, education and training resources for sustainable industry development and professional growth.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Establish relationships with organizations and institutions worldwide to support the Venezuelan energy sector development.",
  },
];

const delayClasses = ["delay-100", "delay-200", "delay-300"];

export function AboutSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const { ref: pillarsRef, isVisible: pillarsVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="flex flex-col gap-20 px-20 py-[100px] bg-[var(--color-bg-section)]">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-5 w-full"
      >
        <span
          className={`text-xs font-semibold text-[var(--color-primary)] tracking-[2px] animate-on-scroll fade-in-right ${
            headerVisible ? "visible" : ""
          }`}
        >
          ABOUT VAPA
        </span>
        <h2
          className={`text-5xl font-bold text-white text-center animate-on-scroll fade-in-right delay-100 ${
            headerVisible ? "visible" : ""
          }`}
        >
          United for Energy Excellence
        </h2>
        <p
          className={`text-lg text-[var(--color-text-muted)] leading-[1.6] text-center max-w-[800px] animate-on-scroll fade-in-right delay-200 ${
            headerVisible ? "visible" : ""
          }`}
        >
          Venezuelan-American Petroleum Association aims to establish
          relationships with organizations and institutions that can provide
          technical support, education and training for the sustainable
          development of the energy sector.
        </p>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="flex justify-center gap-10 w-full">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center gap-2 px-[60px] py-10 rounded border border-[var(--color-border-gold-light)] animate-on-scroll fade-in-up ${
              delayClasses[index]
            } ${statsVisible ? "visible" : ""}`}
          >
            <span className="text-5xl font-bold text-[var(--color-primary)]">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div ref={pillarsRef} className="flex gap-6 w-full">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className={`flex flex-col gap-5 flex-1 p-10 rounded-lg bg-[var(--color-bg-dark)] animate-on-scroll fade-in-up ${
              delayClasses[index]
            } ${pillarsVisible ? "visible" : ""}`}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#D4A85315]">
              <pillar.icon className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-[22px] font-semibold text-white">
              {pillar.title}
            </h3>
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-[1.6]">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
