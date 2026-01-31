"use client";

import { motion } from "motion/react";
import {
  fadeInUp,
  defaultViewport,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const partners = [
  "Partner 1",
  "Partner 2",
  "Partner 3",
  "Partner 4",
  "Partner 5",
  "Partner 6",
  "Partner 7",
  "Partner 8",
  "Partner 9",
];

export function SponsorsSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-[var(--color-bg-dark)]">
      <SectionHeader
        label="OUR PARTNERS"
        title="Trusted by Industry Leaders"
        subtitle="We are proud to partner with leading organizations in the energy sector"
        align="center"
      />

      <div className="flex flex-col gap-10 w-full max-w-[1100px]">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
          {partners.slice(0, 5).map((partner, index) => (
            <motion.div
              key={partner}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex items-center justify-center w-[160px] lg:w-[180px] h-20 rounded-lg bg-[#152D45]"
            >
              <span className="text-base font-medium text-[#6B7A8A]">
                {partner}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
          {partners.slice(5).map((partner, index) => (
            <motion.div
              key={partner}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: (index + 5) * 0.05 }}
              className="flex items-center justify-center w-[160px] lg:w-[180px] h-20 rounded-lg bg-[#152D45]"
            >
              <span className="text-base font-medium text-[#6B7A8A]">
                {partner}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
