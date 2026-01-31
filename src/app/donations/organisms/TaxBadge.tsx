"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { fadeInUp, defaultViewport, defaultTransition } from "@/components/utils/animations";

export function TaxBadge() {
  return (
    <div className="flex justify-center -mt-16 relative z-10 px-5">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={defaultTransition}
        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D4A85320]"
      >
        <ShieldCheck className="w-[18px] h-[18px] text-[var(--color-primary)]" />
        <span className="text-sm font-medium text-[var(--color-primary)]">
          501(c)(3) Tax-Deductible Organization
        </span>
      </motion.div>
    </div>
  );
}
