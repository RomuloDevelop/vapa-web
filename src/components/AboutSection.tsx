"use client";

import { Users, GraduationCap, Globe } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { value: "2019", label: "Founded" },
  { value: "5+", label: "Years of Impact" },
  { value: "TX", label: "Headquarters" },
];

const pillars = [
  {
    icon: Users,
    title: "Professional Unity",
    description:
      "Unite Venezuelan energy professionals while promoting technical advancement in upstream, midstream, and downstream operations.",
  },
  {
    icon: GraduationCap,
    title: "Education & Training",
    description:
      "Provide technical support, education and training resources for sustainable industry development and professional growth.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Establish relationships with organizations and institutions worldwide to support the Venezuelan energy sector development.",
  },
];

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export function AboutSection() {
  return (
    <section className="flex flex-col gap-10 md:gap-16 lg:gap-20 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-[var(--color-bg-section)]">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
        <motion.span
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
        >
          ABOUT VAPA
        </motion.span>
        <motion.h2
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center"
        >
          United for Energy Excellence
        </motion.h2>
        <motion.p
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-[var(--color-text-muted)] leading-[1.6] text-center max-w-full md:max-w-[600px] lg:max-w-[800px]"
        >
          Venezuelan-American Petroleum Association aims to establish
          relationships with organizations and institutions that can provide
          technical support, education and training for the sustainable
          development of the energy sector.
        </motion.p>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 lg:gap-10 w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center gap-2 px-8 sm:px-10 md:px-[60px] py-6 md:py-10 rounded border border-[var(--color-border-gold-light)]"
          >
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)]">
              {stat.value}
            </span>
            <span className="text-xs md:text-sm font-medium text-[var(--color-text-muted)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Pillars */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col gap-4 md:gap-5 flex-1 p-6 md:p-8 lg:p-10 rounded-lg bg-[var(--color-bg-dark)]"
          >
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-[#D4A85315]">
              <pillar.icon className="w-6 h-6 md:w-7 md:h-7 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-[22px] font-semibold text-white">
              {pillar.title}
            </h3>
            <p className="text-sm md:text-[15px] text-[var(--color-text-secondary)] leading-[1.6]">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
