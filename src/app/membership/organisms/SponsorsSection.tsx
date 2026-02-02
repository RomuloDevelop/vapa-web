"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInUp,
  defaultViewport,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const partners = [
  { name: "Partner 1", image: "/partners/Partner1.png" },
  { name: "Partner 2", image: "/partners/Partner2.png" },
  { name: "Partner 3", image: "/partners/Partner3.png" },
  { name: "Partner 4", image: "/partners/Partner4.png" },
  { name: "Partner 5", image: "/partners/Partner5.png" },
  { name: "Partner 6", image: "/partners/Partner6.png" },
  { name: "Partner 7", image: "/partners/Partner7.png" },
  { name: "Partner 8", image: "/partners/Partner8.png" },
  { name: "Partner 9", image: "/partners/Partner9.jpeg" },
];

export function SponsorsSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface">
      <SectionHeader
        label="OUR PARTNERS"
        title="Trusted by Industry Leaders"
        subtitle="We are proud to partner with leading organizations in the energy sector"
        align="center"
      />

      <div className="flex flex-col gap-10 w-full max-w-[1100px]">
        {/* First row - 4 partners */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {partners.slice(0, 4).map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex items-center justify-center w-[140px] md:w-[180px] lg:w-[220px] h-20 md:h-24 p-4 rounded-lg bg-white/60"
            >
              <Image
                src={partner.image}
                alt={partner.name}
                width={180}
                height={80}
                className="object-contain max-h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Second row - 4 partners */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {partners.slice(4, 8).map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: (index + 4) * 0.05 }}
              className="flex items-center justify-center w-[140px] md:w-[180px] lg:w-[220px] h-20 md:h-24 p-4 rounded-lg bg-white/60"
            >
              <Image
                src={partner.image}
                alt={partner.name}
                width={180}
                height={80}
                className="object-contain max-h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Third row - 1 featured partner (larger) */}
        <div className="flex justify-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center w-full max-w-[400px] h-28 md:h-32 p-6 rounded-lg bg-white/60"
          >
            <Image
              src={partners[8].image}
              alt={partners[8].name}
              width={350}
              height={100}
              className="object-contain max-h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
