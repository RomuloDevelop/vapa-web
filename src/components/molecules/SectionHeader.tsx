"use client";

import { motion } from "motion/react";
import { fadeInUp, fadeInRight, defaultViewport, defaultTransition } from "../utils/animations";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  animate?: boolean;
  variant?: "up" | "right";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "center",
  animate = true,
  variant = "up",
  className = "",
}: SectionHeaderProps) {
  const alignClasses = align === "center" ? "items-center text-center" : "items-start text-left";
  const animationVariant = variant === "right" ? fadeInRight : fadeInUp;

  const content = (
    <>
      {label && (
        <motion.span
          variants={animate ? animationVariant : undefined}
          initial={animate ? "hidden" : undefined}
          whileInView={animate ? "visible" : undefined}
          viewport={animate ? defaultViewport : undefined}
          transition={animate ? defaultTransition : undefined}
          className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px] uppercase"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        variants={animate ? animationVariant : undefined}
        initial={animate ? "hidden" : undefined}
        whileInView={animate ? "visible" : undefined}
        viewport={animate ? defaultViewport : undefined}
        transition={animate ? { ...defaultTransition, delay: 0.1 } : undefined}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={animate ? animationVariant : undefined}
          initial={animate ? "hidden" : undefined}
          whileInView={animate ? "visible" : undefined}
          viewport={animate ? defaultViewport : undefined}
          transition={animate ? { ...defaultTransition, delay: 0.2 } : undefined}
          className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[600px]"
        >
          {subtitle}
        </motion.p>
      )}
    </>
  );

  return (
    <div className={`flex flex-col gap-5 ${alignClasses} ${className}`}>
      {content}
    </div>
  );
}
