"use client";

import { motion } from "motion/react";
import { InstagramFeed } from "../molecules/InstagramFeed";
import type { InstagramPost } from "@/lib/services/instagram";
import {
  fadeInRight,
  defaultViewport,
  slowTransition,
} from "../utils/animations";

interface AboutSectionProps {
  posts?: InstagramPost[];
}

export function AboutSection({ posts = [] }: AboutSectionProps) {
  return (
    <section className="px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-section">
      <motion.div
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...slowTransition, delay: 0.3 }}
        className="w-full"
      >
        <InstagramFeed posts={posts} />
      </motion.div>
    </section>
  );
}
