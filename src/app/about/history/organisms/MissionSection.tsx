"use client";

import { motion } from "motion/react";
import {
  fadeInLeft,
  fadeInRight,
  defaultViewport,
  slowTransition,
} from "@/components/utils/animations";

export function MissionSection() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
      {/* Left Column */}
      <motion.div
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={slowTransition}
        className="flex flex-col gap-5 md:gap-6 flex-1"
      >
        <span className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]">
          OUR MISSION
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.2]">
          A Nonprofit Professional Organization
        </h2>
        <p className="text-sm md:text-base lg:text-[17px] text-[var(--color-text-muted)] leading-[1.7]">
          VAPA is a nonprofit professional organization in the Hydrocarbon
          industry and other related energies. Established in Texas during July
          2019, we are dedicated to uniting Venezuelan energy professionals
          across the globe.
        </p>
      </motion.div>

      {/* Right Column */}
      <motion.div
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...slowTransition, delay: 0.1 }}
        className="flex flex-col gap-5 md:gap-6 flex-1"
      >
        <span className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]">
          OUR PURPOSE
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.2]">
          Technical Support & Education
        </h2>
        <p className="text-sm md:text-base lg:text-[17px] text-[var(--color-text-muted)] leading-[1.7]">
          VAPA aims to establish connections with organizations and institutions
          that provide technical support, education, and training benefiting
          Venezuela&apos;s energy sector development. We organize technical events
          spanning upstream, midstream, and downstream operations.
        </p>
      </motion.div>
    </div>
  );
}
