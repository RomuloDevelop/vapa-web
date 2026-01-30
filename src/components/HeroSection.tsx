"use client";

import { motion } from "motion/react";
import { ParallaxImage } from "./ParallaxImage";

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[650px] lg:h-[700px] w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <ParallaxImage
        src="https://images.unsplash.com/photo-1726111265336-6bf825e549ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzU5OTN8&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Oil refinery at dusk"
        priority
        speed={0.2}
        flip
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A1628 0%, rgba(10, 22, 40, 0.5) 40%, rgba(10, 22, 40, 0) 70%)",
        }}
      />

      {/* Content */}
      <div className="absolute top-16 md:top-24 lg:top-[120px] left-5 md:left-10 lg:left-20 xl:left-[5%] 2xl:left-[8%] right-5 md:right-10 lg:right-auto flex flex-col gap-5 md:gap-6 lg:gap-8 max-w-full sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] 2xl:max-w-[800px]">
        {/* Badge */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 md:px-5 py-2 rounded-[20px] border border-[var(--color-border-gold)] w-fit"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="text-xs md:text-[13px] font-medium text-[var(--color-primary)]">
            Established 2019 • Texas, USA
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold text-white leading-[1.1]"
        >
          Empowering Venezuelan
          <br />
          Energy Professionals
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg xl:text-xl text-white/85 leading-[1.6] max-w-full md:max-w-[500px] lg:max-w-[580px] xl:max-w-[620px] 2xl:max-w-[680px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
        >
          A nonprofit professional organization uniting experts in the
          Hydrocarbon industry and related energies to promote technical
          advancement, education, and sustainable development.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4"
        >
          <button className="px-6 md:px-9 py-4 md:py-[18px] bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity">
            Become a Member
          </button>
          <button className="px-6 md:px-9 py-4 md:py-[18px] text-white text-sm md:text-base font-medium rounded border border-[var(--color-border-gold-strong)] bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
