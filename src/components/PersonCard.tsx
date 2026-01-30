"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface PersonCardProps {
  image: string;
  name: string;
  title: string;
  size?: "small" | "medium" | "large";
  index?: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

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
}: PersonCardProps) {
  const config = sizeConfig[size];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
    </motion.div>
  );
}
