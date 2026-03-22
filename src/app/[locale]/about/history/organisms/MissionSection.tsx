"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  fadeInLeft,
  fadeInRight,
  defaultViewport,
  slowTransition,
} from "@/components/utils/animations";

interface MissionSectionProps {
  viewport?: { once: boolean; amount: number };
}

export function MissionSection({ viewport = defaultViewport }: MissionSectionProps) {
  const t = useTranslations("About");

  const missionPoints = [
    t("mission1"),
    t("mission2"),
    t("mission3"),
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      {/* Mission Column */}
      <motion.div
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={slowTransition}
        className="flex flex-col gap-6 md:gap-8 flex-1"
      >
        <span className="inline-flex px-4 py-2 rounded-full bg-accent-20 text-xs md:text-sm font-semibold text-accent tracking-[1.5px] w-fit">
          {t("opportunities")}
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white leading-[1.2]">
          {t("connectingTalent")}
        </h2>
        <div className="flex flex-col gap-5">
          {missionPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-surface" />
              </div>
              <p className="text-sm md:text-base text-foreground-muted leading-[1.6]">
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
        viewport={viewport}
        transition={{ ...slowTransition, delay: 0.1 }}
        className="flex flex-col gap-6 md:gap-8 flex-1"
      >
        <span className="inline-flex px-4 py-2 rounded-full bg-accent-20 text-xs md:text-sm font-semibold text-accent tracking-[1.5px] w-fit">
          {t("ourVision")}
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white leading-[1.2]">
          {t("leadingNetwork")}
        </h2>
        <p className="text-sm md:text-base lg:text-[16px] text-foreground-muted leading-[1.7]">
          {t("visionDesc")}
        </p>
        <div className="p-6 rounded-xl bg-accent-15 border border-accent-30">
          <p className="text-base md:text-lg text-accent italic font-medium leading-[1.5]">
            &quot;{t("visionQuote")}&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}
