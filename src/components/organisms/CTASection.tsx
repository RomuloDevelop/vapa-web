"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, defaultViewport, slowTransition } from "../utils/animations";

const DonationModal = dynamic(
  () => import("../molecules/DonationModal").then((mod) => mod.DonationModal),
  { ssr: false }
);

const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

export function CTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            viewport={defaultViewport}
            transition={slowTransition}
            className="text-[10px] md:text-xs font-semibold text-accent tracking-[2px]"
          >
            JOIN OUR COMMUNITY
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-bold text-white text-center"
          >
            Become a VAPA Member Today
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.2 }}
            className="flex flex-col gap-4 max-w-full md:max-w-[700px] lg:max-w-[800px]"
          >
            <p className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.6] text-center">
              <span className="text-accent font-bold">For Professionals and Students:</span>{" "}
              Join our network to connect with mentors, peers, and career
              opportunities. Your knowledge and experience help shape the future
              of Venezuela&apos;s energy sector.
            </p>
            <p className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.6] text-center">
              <span className="text-accent font-bold">For allies like companies, universities, and research institutions:</span>{" "}
              Access Venezuela&apos;s exceptional talent and contribute to
              rebuilding an entire energy industry. Your support creates real
              impact and long-term opportunity.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-5 w-full sm:w-auto"
          >
            <a
              href={MEMBERSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-accent text-surface text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Register Now
              <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 md:px-12 py-4 md:py-5 text-white text-sm md:text-base font-medium rounded border border-border-white bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors text-center"
            >
              Make a Donation
            </button>
          </motion.div>
        </div>
      </section>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
