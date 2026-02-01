"use client";

import { motion } from "motion/react";
import { ParallaxImage } from "./ParallaxImage";
import { fadeInUp, slowTransition } from "../utils/animations";

interface PageHeroProps {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  subtitle: string;
  height?: number;
}

export function PageHero({
  image,
  imageAlt,
  label,
  title,
  subtitle,
  height = 350,
}: PageHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: height }}
    >
      {/* Background Image with Parallax */}
      <ParallaxImage src={image} alt={imageAlt} priority speed={0.2} />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-page-hero" />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-5 px-5 md:px-10 lg:px-20 pt-16 md:pt-20"
        style={{ minHeight: height }}
      >
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={slowTransition}
          className="text-[10px] md:text-xs font-semibold text-gold tracking-[2px]"
        >
          {label}
        </motion.span>
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...slowTransition, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white text-center"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...slowTransition, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-muted text-center"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
