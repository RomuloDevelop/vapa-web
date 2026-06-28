"use client";

import { motion } from "motion/react";
import { Smartphone, Building } from "lucide-react";
import { useTranslations } from "next-intl";
import { fadeInUp, defaultViewport, staggerDelay } from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const ZELLE_EMAILS = ["donations.vapa@vapa-us.org", "donations.vapa@gmail.com"];

// Bank data is constant, not translatable — labels come from messages.
const BANK_ROWS = [
  { labelKey: "accountName", value: "Venezuelan American Petroleum Association (VAPA)" },
  { labelKey: "bank", value: "Chase Bank" },
  { labelKey: "checkingAccount", value: "531353586" },
  { labelKey: "achRouting", value: "111000614" },
  { labelKey: "wireRouting", value: "021000021" },
];

export function WaysToGiveSection() {
  const t = useTranslations("EarthquakeRelief");

  return (
    <section className="flex flex-col items-center gap-12 md:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-24 bg-surface-section">
      <SectionHeader label={t("waysToGive")} title={t("howToDonate")} align="center" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1000px]">
        {/* Zelle */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={staggerDelay(0)}
          className="flex flex-col gap-5 p-8 rounded-xl bg-surface-raised"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-20 shrink-0">
              <Smartphone className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t("zelleTitle")}</h3>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">{t("zelleDesc")}</p>
          <div className="flex flex-col gap-2">
            {ZELLE_EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="text-sm font-medium text-accent hover:underline break-all"
              >
                {email}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bank Transfer */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={staggerDelay(1)}
          className="flex flex-col gap-5 p-8 rounded-xl bg-surface-raised"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-20 shrink-0">
              <Building className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t("bankTitle")}</h3>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">{t("bankDesc")}</p>
          <dl className="flex flex-col divide-y divide-border-accent-light">
            {BANK_ROWS.map((row) => (
              <div key={row.labelKey} className="flex flex-col gap-0.5 py-2.5">
                <dt className="text-xs uppercase tracking-wide text-foreground-faint">
                  {t(row.labelKey)}
                </dt>
                <dd className="text-sm font-medium text-foreground select-all">{row.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
