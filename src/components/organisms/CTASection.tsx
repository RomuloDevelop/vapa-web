"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fadeInUp, defaultViewport, slowTransition } from "../utils/animations";

const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

export function CTASection() {
  const t = useTranslations("CTA");
  const tc = useTranslations("Common");

  return (
      <section className="relative min-h-[450px] md:min-h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/sections/cta.jpg"
          alt="Professional meeting"
          fill
          className="object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-cta-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-8 px-5 md:px-10 lg:px-20 py-12 md:py-16">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={slowTransition}
            className="text-xs md:text-sm font-semibold text-accent tracking-[2px]"
          >
            {t("joinCommunity")}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-bold text-white text-center"
          >
            {t("whyJoin")}
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
              <span className="text-accent font-bold">{t("professionalsLabel")}</span>{" "}
              {t("professionalsDesc")}
            </p>
            <p className="text-sm md:text-base lg:text-lg text-foreground-muted leading-[1.6] text-center">
              <span className="text-accent font-bold">{t("alliesLabel")}</span>{" "}
              {t("alliesDesc")}
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
              className="flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-accent text-surface text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {tc("registerNow")}
              <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </a>
            <Link
              href="/donations#donate"
              className="px-8 md:px-12 py-4 md:py-5 text-white text-sm md:text-base font-medium rounded border border-white bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {tc("makeDonation")}
            </Link>
          </motion.div>
        </div>
      </section>
  );
}
