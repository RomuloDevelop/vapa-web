"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export function CTASection() {
  return (
    <section className="relative min-h-[450px] md:min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1768564206500-5cddb1fea679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzYxMjB8&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Professional meeting"
        fill
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10, 22, 40, 0.9) 0%, rgba(13, 30, 51, 0.8) 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-8 px-5 md:px-10 lg:px-20 py-12 md:py-16">
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
        >
          JOIN OUR COMMUNITY
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-bold text-white text-center"
        >
          Become a VAPA Member Today
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-[var(--color-text-muted)] leading-[1.6] text-center max-w-full md:max-w-[600px] lg:max-w-[700px]"
        >
          Join a network of Venezuelan energy professionals dedicated to
          excellence, innovation, and the sustainable development of the
          hydrocarbon industry.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-5 w-full sm:w-auto"
        >
          <button className="flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity">
            Register Now
            <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
          <button className="px-8 md:px-12 py-4 md:py-5 text-white text-sm md:text-base font-medium rounded border border-[var(--color-border-white)] hover:bg-white/5 transition-colors">
            Make a Donation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
