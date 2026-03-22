"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { fadeInUp, defaultViewport, defaultTransition } from "@/components/utils/animations";

export function TaxBadge() {
  const t = useTranslations("Donations");

  return (
    <div className="flex justify-center -mt-16 relative z-10 px-5">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={defaultTransition}
        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-surface border border-border-accent"
      >
        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-accent" />
        <span className="text-base md:text-lg font-semibold text-accent">
          {t("taxDeductible")}
        </span>
      </motion.div>
    </div>
  );
}
