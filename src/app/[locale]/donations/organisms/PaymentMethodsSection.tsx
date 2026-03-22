"use client";

import { motion } from "motion/react";
import { CreditCard, Smartphone, Building, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  fadeInUp,
  defaultViewport,
  defaultTransition,
  staggerDelay,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

interface PaymentMethod {
  icon: typeof CreditCard;
  titleKey: string;
  descriptionKey: string;
}

const paymentMethodDefs: PaymentMethod[] = [
  {
    icon: CreditCard,
    titleKey: "onlinePayment",
    descriptionKey: "onlinePaymentDesc",
  },
  {
    icon: Smartphone,
    titleKey: "zellePayment",
    descriptionKey: "zelleDesc",
  },
  {
    icon: Building,
    titleKey: "bankTransfer",
    descriptionKey: "bankTransferDesc",
  },
];

function PaymentCard({
  method,
  index,
  t,
}: {
  method: PaymentMethod;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const Icon = method.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={staggerDelay(index)}
      className="flex flex-col items-center gap-5 p-8 rounded-xl bg-surface-raised w-full md:w-[300px]"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-20">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-white">{t(method.titleKey)}</h3>
      <p className="text-sm text-foreground-muted text-center leading-relaxed">
        {t(method.descriptionKey)}
      </p>
    </motion.div>
  );
}

export function PaymentMethodsSection() {
  const t = useTranslations("Donations");

  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface">
      <SectionHeader
        label={t("waysToGive")}
        title={t("paymentMethods")}
        subtitle={t("paymentMethodsDesc")}
        align="center"
      />

      <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-[1000px]">
        {paymentMethodDefs.map((method, index) => (
          <PaymentCard key={method.titleKey} method={method} index={index} t={t} />
        ))}
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={{ ...defaultTransition, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-5 p-8 rounded-xl bg-accent-10 w-full max-w-[1000px]"
      >
        <Mail className="w-6 h-6 text-accent" />
        <p className="text-base text-foreground-muted text-center sm:text-left">
          {t("certificateNote")}{" "}
          <a
            href="mailto:donations@vapa-us.org"
            className="text-accent hover:underline"
          >
            donations@vapa-us.org
          </a>
        </p>
      </motion.div>
    </section>
  );
}
