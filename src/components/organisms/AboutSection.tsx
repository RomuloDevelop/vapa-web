"use client";

import { Users, GraduationCap, Globe } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeader } from "../molecules/SectionHeader";
import { IconWrapper } from "../atoms/IconWrapper";
import {
  fadeInRight,
  fadeInUp,
  defaultViewport,
  smallViewport,
  slowTransition,
  staggerDelay,
} from "../utils/animations";

const defaultStats = [
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

interface AboutSectionProps {
  stats?: { value: string; label: string }[];
}

export function AboutSection({ stats = defaultStats }: AboutSectionProps) {
  return (
    <section className="flex flex-col gap-10 md:gap-16 lg:gap-20 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-section">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
        <motion.span
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={slowTransition}
          className="text-[10px] md:text-xs font-semibold text-accent tracking-[2px]"
        >
          ABOUT VAPA
        </motion.span>
        <motion.h2
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ ...slowTransition, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center"
        >
          United for Energy Excellence
        </motion.h2>
        <motion.p
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ ...slowTransition, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.6] text-center max-w-full md:max-w-[600px] lg:max-w-[800px]"
        >
          Venezuelan-American Petroleum Association aims to establish
          relationships with organizations and institutions that can provide
          technical support, education and training for the sustainable
          development of the energy sector.
        </motion.p>
      </div>
    </section>
  );
}
