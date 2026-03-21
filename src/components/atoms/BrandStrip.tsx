"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInLeft,
  fadeInRight,
  defaultViewport,
  slowTransition,
} from "../utils/animations";

export function BrandStrip() {
  return (
    <section className="bg-surface-sunken border-y border-border-accent px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
        {/* Logo */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={slowTransition}
          className="shrink-0"
        >
          <Image
            src="/images/sections/VAPA_logo.png"
            alt="VAPA - Venezuelan American Petroleum Association"
            width={260}
            height={260}
            className="w-[180px] md:w-[220px] lg:w-[260px] h-auto"
          />
        </motion.div>

        {/* Text content */}
        <div className="flex flex-col gap-4 md:gap-5">
          <motion.span
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={slowTransition}
            className="text-xs md:text-sm font-semibold text-accent tracking-[2px] text-center md:text-left"
          >
            ABOUT VAPA
          </motion.span>
          <motion.h2
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center md:text-left"
          >
            United for Energy Excellence
          </motion.h2>
          <motion.p
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.2 }}
            className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.6] text-center md:text-left max-w-full lg:max-w-[700px]"
          >
            Venezuelan-American Petroleum Association aims to establish
            relationships with organizations and institutions that can provide
            technical support, education and training for the sustainable
            development of the energy sector.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
