"use client";

import { motion } from "motion/react";
import {
  fadeInUp,
  defaultViewport,
  slowTransition,
} from "../utils/animations";

export function AboutIntroSection() {
  return (
    <section className="flex flex-col items-center gap-6 md:gap-8 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-section">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={slowTransition}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white text-center"
      >
        The Venezuelan American Petroleum Association
      </motion.h2>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...slowTransition, delay: 0.1 }}
        className="flex flex-col gap-5 max-w-3xl text-center"
      >
        <p className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.7]">
          VAPA is a nonprofit professional organization in the Hydrocarbon
          industry and other related energies. It was founded in the state of
          Texas, USA in July 2019 and aims to establish relationships with
          organizations and institutions that can provide technical support,
          education and training to help the sustainable development of the
          Venezuelan energy industry.
        </p>
        <p className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.7]">
          VAPA is committed to promote technical events in upstream, midstream
          and downstream of both Oil and Gas and alternative energies that are of
          benefit to its members.
        </p>
      </motion.div>
    </section>
  );
}
