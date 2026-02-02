"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { IconWrapper } from "../atoms/IconWrapper";
import { fadeInUp, defaultViewport, staggerDelay } from "../utils/animations";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  animate?: boolean;
  variant?: "default" | "dark" | "light";
  iconSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const variantClasses = {
  default: "bg-surface",
  dark: "bg-card-dark",
  light: "bg-accent-10",
};

export function IconCard({
  icon,
  title,
  description,
  index = 0,
  animate = true,
  variant = "default",
  iconSize = "lg",
  className = "",
}: IconCardProps) {
  const Component = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        variants: fadeInUp,
        initial: "hidden",
        whileInView: "visible",
        viewport: defaultViewport,
        transition: staggerDelay(index),
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`flex flex-col items-center gap-5 p-8 rounded-xl ${variantClasses[variant]} ${className}`}
    >
      <IconWrapper icon={icon} size={iconSize} />
      <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
      <p className="text-[15px] text-foreground-muted text-center leading-relaxed">
        {description}
      </p>
    </Component>
  );
}
