"use client";

import Image from "next/image";
import { motion } from "motion/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const timeline = [
  {
    year: "2019",
    title: "Founded",
    description: "VAPA established in Texas, USA during July 2019",
  },
  {
    year: "2020",
    title: "First Board",
    description: "Inaugural Board of Directors and Advisory Council formed",
  },
  {
    year: "2025",
    title: "Growing Strong",
    description: "New Board elected for 2025-2027 term, expanding global reach",
  },
];

export function HistoryContent() {
  return (
    <section className="flex flex-col gap-16 md:gap-20 lg:gap-24 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-[#1A3352]">
      {/* Mission Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Column */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5 md:gap-6 flex-1"
        >
          <span className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]">
            OUR MISSION
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.2]">
            A Nonprofit Professional Organization
          </h2>
          <p className="text-sm md:text-base lg:text-[17px] text-[var(--color-text-muted)] leading-[1.7]">
            VAPA is a nonprofit professional organization in the Hydrocarbon
            industry and other related energies. Established in Texas during July
            2019, we are dedicated to uniting Venezuelan energy professionals
            across the globe.
          </p>
        </motion.div>

        {/* Right Column */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-5 md:gap-6 flex-1"
        >
          <span className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]">
            OUR PURPOSE
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.2]">
            Technical Support & Education
          </h2>
          <p className="text-sm md:text-base lg:text-[17px] text-[var(--color-text-muted)] leading-[1.7]">
            VAPA aims to establish connections with organizations and institutions
            that provide technical support, education, and training benefiting
            Venezuela&apos;s energy sector development. We organize technical events
            spanning upstream, midstream, and downstream operations.
          </p>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <div className="flex flex-col items-center gap-8 md:gap-10">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white"
        >
          Our Journey
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 w-full">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 md:gap-4 p-8 md:p-10 lg:p-12 border border-[#D4A85330] rounded-lg flex-1 max-w-[320px] mx-auto md:mx-0"
            >
              <span className="text-4xl md:text-5xl lg:text-[48px] font-bold text-[var(--color-primary)]">
                {item.year}
              </span>
              <span className="text-base md:text-lg font-semibold text-white">
                {item.title}
              </span>
              <p className="text-sm text-[var(--color-text-secondary)] text-center leading-[1.5] max-w-[220px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Highlight Section */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row overflow-hidden rounded-xl bg-[var(--color-bg-dark)]"
      >
        <div className="relative h-[250px] md:h-[300px] lg:h-auto lg:w-[500px] flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1644567103258-6da3857faab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzgyNjV8&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Power transmission lines"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 md:gap-5 p-8 md:p-10 lg:p-12">
          <span className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]">
            OUR VISION
          </span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            Professional Networking
          </h3>
          <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-[1.7]">
            Our organization facilitates connections between professionals across
            different fields in energy. We provide platforms for knowledge sharing,
            career development, and strategic collaboration across the energy industry.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
