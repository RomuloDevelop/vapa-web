"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { fadeInUp, defaultViewport } from "@/components/utils/animations";

const PARAGRAPHS = ["p1", "p2", "p3"];

export function EarthquakeReliefContent() {
  const t = useTranslations("EarthquakeRelief");

  return (
    <section className="flex justify-center px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-24 bg-surface">
      <div className="flex flex-col gap-6 md:gap-7 max-w-[760px]">
        {PARAGRAPHS.map((key, index) => (
          <motion.p
            key={key}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-base md:text-lg leading-relaxed text-foreground-muted text-justify"
          >
            {t(key)}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
