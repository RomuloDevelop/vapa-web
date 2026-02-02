"use client";

import { motion } from "motion/react";
import {
  fadeInUp,
  defaultViewport,
  slowTransition,
  staggerDelay,
} from "@/components/utils/animations";

const timeline = [
  {
    year: "2019",
    title: "Founded",
    description: "VAPA established in Texas, USA during July 2019",
  },
  {
    year: "2020",
    title: "First Board",
    description: "Inaugural Board of Directors and Advisory Council formed",
  },
  {
    year: "2025",
    title: "Growing Strong",
    description: "New Board elected for 2025-2027 term, expanding global reach",
  },
];

export function TimelineSection() {
  return (
    <div className="flex flex-col items-center gap-8 md:gap-10">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={slowTransition}
        className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white"
      >
        Our Journey
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 w-full">
        {timeline.map((item, index) => (
          <motion.div
            key={item.year}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={staggerDelay(index)}
            className="flex flex-col items-center gap-3 md:gap-4 p-8 md:p-10 lg:p-12 border border-accent-30 rounded-lg flex-1 max-w-[320px] mx-auto md:mx-0"
          >
            <span className="text-4xl md:text-5xl lg:text-[48px] font-bold text-accent">
              {item.year}
            </span>
            <span className="text-base md:text-lg font-semibold text-white">
              {item.title}
            </span>
            <p className="text-sm text-foreground-subtle text-center leading-[1.5] max-w-[220px]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
