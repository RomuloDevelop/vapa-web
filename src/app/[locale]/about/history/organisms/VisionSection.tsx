"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  fadeInUp,
  defaultViewport,
  slowTransition,
} from "@/components/utils/animations";

export function VisionSection() {
  const t = useTranslations("About");

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={slowTransition}
      className="flex flex-col lg:flex-row overflow-hidden rounded-xl bg-surface"
    >
      <div className="relative h-[250px] md:h-[300px] lg:h-auto lg:w-[500px] flex-shrink-0">
        <Image
          src="/images/sections/history-vision.jpg"
          alt="Power transmission lines"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 md:gap-5 p-8 md:p-10 lg:p-12">
        <span className="text-xs md:text-sm font-semibold text-accent tracking-[2px]">
          {t("coreValue")}
        </span>
        <h3 className="text-xl md:text-2xl lg:text-[32px] font-bold text-white">
          {t("professionalNetworking")}
        </h3>
        <p className="text-sm md:text-base text-foreground-muted leading-[1.7]">
          {t("networkingDesc")}
        </p>
      </div>
    </motion.div>
  );
}
