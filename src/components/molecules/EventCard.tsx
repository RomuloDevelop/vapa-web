"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { fadeInUp, defaultViewport, staggerDelay } from "../utils/animations";

interface EventCardProps {
  image: string;
  date: string;
  title: string;
  description: string;
  index?: number;
  animate?: boolean;
  className?: string;
}

export function EventCard({
  image,
  date,
  title,
  description,
  index = 0,
  animate = true,
  className = "",
}: EventCardProps) {
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
      className={`flex flex-col bg-surface rounded-xl overflow-hidden h-full ${className}`}
    >
      {/* Image */}
      <div className="relative h-[180px] md:h-[200px] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 md:gap-4 p-5 md:p-6">
        {/* Date */}
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 md:w-[18px] md:h-[18px] text-accent" />
          <span className="text-sm md:text-[15px] font-medium text-accent">
            {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-[15px] text-foreground-subtle leading-[1.5]">
          {description}
        </p>
      </div>
    </Component>
  );
}
