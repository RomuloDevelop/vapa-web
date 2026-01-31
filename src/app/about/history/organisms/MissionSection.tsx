"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  fadeInLeft,
  fadeInRight,
  defaultViewport,
  slowTransition,
} from "@/components/utils/animations";

const missionPoints = [
  "Unite Venezuelan talent with American expertise",
  "Facilitate key partnerships across the energy industry",
  "Contribute to the knowledge transfer and growth in the sector",
];

export function MissionSection() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      {/* Mission Column */}
      <motion.div
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={slowTransition}
        className="flex flex-col gap-6 md:gap-8 flex-1"
      >
        <span className="inline-flex px-4 py-2 rounded-full bg-[#D4A85320] text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[1.5px] w-fit">
          OUR MISSION
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white leading-[1.2]">
          Connecting Venezuelan Talent with Global Opportunities
        </h2>
        <div className="flex flex-col gap-5">
          {missionPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-[var(--color-bg-dark)]" />
              </div>
              <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-[1.6]">
                {point}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Vision Column */}
      <motion.div
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...slowTransition, delay: 0.1 }}
        className="flex flex-col gap-6 md:gap-8 flex-1"
      >
        <span className="inline-flex px-4 py-2 rounded-full bg-[#D4A85320] text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[1.5px] w-fit">
          OUR VISION
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white leading-[1.2]">
          Leading the Global Energy Network
        </h2>
        <p className="text-sm md:text-base lg:text-[16px] text-[var(--color-text-muted)] leading-[1.7]">
          To be the leading Global Network that unites Venezuelan and American
          energy expertise – catalyzing projects that shape a resilient,
          sustainable and competitive energy future.
        </p>
        <div className="p-6 rounded-xl bg-[#D4A85315] border border-[#D4A85330]">
          <p className="text-base md:text-lg text-[var(--color-primary)] italic font-medium leading-[1.5]">
            &quot;Shaping a resilient, sustainable and competitive energy future
            together.&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}
