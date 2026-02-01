"use client";

import { motion } from "motion/react";
import { fadeInUp, defaultViewport, defaultTransition } from "../utils/animations";

interface BadgeProps {
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
  className?: string;
}

export function Badge({
  children,
  animate = true,
  delay = 0,
  className = "",
}: BadgeProps) {
  const baseClasses =
    "text-[10px] md:text-xs font-semibold text-gold tracking-[2px] uppercase";

  if (!animate) {
    return (
      <span className={`${baseClasses} ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={{ ...defaultTransition, delay }}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </motion.span>
  );
}
