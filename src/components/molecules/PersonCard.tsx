"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, smallViewport, staggerDelay } from "../utils/animations";

interface PersonCardProps {
  image: string;
  name: string;
  title: string;
  size?: "small" | "medium" | "large";
  index?: number;
  animate?: boolean;
}

const sizeConfig = {
  small: {
    width: "w-full sm:w-[180px] md:w-[200px] lg:w-[240px]",
    imageHeight: "h-[200px] md:h-[220px] lg:h-[240px]",
    nameSize: "text-base md:text-lg",
    titleSize: "text-xs md:text-[13px]",
    padding: "p-4 md:p-5",
    gap: "gap-1.5",
  },
  medium: {
    width: "w-full sm:w-[220px] md:w-[260px] lg:w-[280px]",
    imageHeight: "h-[220px] md:h-[260px] lg:h-[280px]",
    nameSize: "text-lg md:text-xl",
    titleSize: "text-sm md:text-[14px]",
    padding: "p-5 md:p-6",
    gap: "gap-2",
  },
  large: {
    width: "w-full sm:w-[260px] md:w-[300px] lg:w-[320px]",
    imageHeight: "h-[260px] md:h-[300px] lg:h-[320px]",
    nameSize: "text-xl md:text-2xl",
    titleSize: "text-sm md:text-base",
    padding: "p-6 md:p-7",
    gap: "gap-2",
  },
};

export function PersonCard({
  image,
  name,
  title,
  size = "medium",
  index = 0,
  animate = true,
}: PersonCardProps) {
  const config = sizeConfig[size];
  const Component = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        variants: fadeInUp,
        initial: "hidden",
        whileInView: "visible",
        viewport: smallViewport,
        transition: staggerDelay(index),
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`flex flex-col overflow-hidden rounded-xl bg-[var(--color-bg-dark)] ${config.width}`}
    >
      <div className={`relative ${config.imageHeight} w-full`}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div
        className={`flex flex-col items-center ${config.gap} ${config.padding}`}
      >
        <span
          className={`${config.nameSize} font-semibold text-white text-center`}
        >
          {name}
        </span>
        <span
          className={`${config.titleSize} font-medium text-[var(--color-primary)] text-center`}
        >
          {title}
        </span>
      </div>
    </Component>
  );
}
