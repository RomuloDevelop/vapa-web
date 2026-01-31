"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInUp,
  defaultViewport,
  slowTransition,
} from "@/components/utils/animations";

export function VisionSection() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={slowTransition}
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
          CORE VALUE
        </span>
        <h3 className="text-xl md:text-2xl lg:text-[32px] font-bold text-white">
          Professional Networking
        </h3>
        <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-[1.7]">
          Networking that will offer unique opportunity to interchange expertise
          and build strong professional connections among professionals in the
          energy industry.
        </p>
      </div>
    </motion.div>
  );
}
