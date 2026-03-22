"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  fadeInUp,
  defaultViewport,
  slowTransition,
  staggerDelay,
} from "@/components/utils/animations";

export function TimelineSection() {
  const t = useTranslations("About");

  const timeline = [
    {
      year: "2019",
      title: t("founded"),
      description: t("foundedDesc"),
    },
    {
      year: "2020",
      title: t("firstBoard"),
      description: t("firstBoardDesc"),
    },
    {
      year: "2025",
      title: t("growingStrong"),
      description: t("growingStrongDesc"),
    },
  ];

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
        {t("ourJourney")}
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
            <h3 className="text-base md:text-lg font-semibold text-white">
              {item.title}
            </h3>
            <p className="text-sm text-foreground-subtle text-center leading-[1.5] max-w-[220px]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
