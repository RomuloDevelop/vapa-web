"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  speed?: number; // Parallax speed multiplier (default: 0.3)
}

export function ParallaxImage({
  src,
  alt,
  priority = false,
  speed = 0.3,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0 h-[120%] -top-[10%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
