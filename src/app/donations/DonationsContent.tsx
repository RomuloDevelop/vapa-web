"use client";

import { motion } from "motion/react";
import {
  Heart,
  HandHelping,
  Award,
  Trophy,
  Star,
  BookOpen,
  Users,
  Calendar,
  Globe,
  CreditCard,
  Smartphone,
  Building,
  Mail,
  ShieldCheck,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const donationTiers = [
  {
    id: "friend",
    icon: Heart,
    name: "Friend",
    amount: "$250+",
    popular: false,
    height: "h-[280px]",
  },
  {
    id: "supporter",
    icon: HandHelping,
    name: "Supporter",
    amount: "$500+",
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "advocate",
    icon: Award,
    name: "Advocate",
    amount: "$1,000+",
    popular: true,
    height: "h-[370px]",
  },
  {
    id: "champion",
    icon: Trophy,
    name: "Champion",
    amount: "$2,000+",
    popular: false,
    height: "h-[320px]",
  },
  {
    id: "visionary",
    icon: Star,
    name: "Visionary",
    amount: "$4,000+",
    popular: false,
    height: "h-[280px]",
  },
];

const impactAreas = [
  {
    icon: BookOpen,
    title: "Educational Programs",
    description:
      "Fund webinars, seminars, and technical courses for energy professionals",
  },
  {
    icon: Users,
    title: "Mentorship Programs",
    description:
      "Support the next generation through VAPA Links mentoring initiatives",
  },
  {
    icon: Calendar,
    title: "Community Events",
    description:
      "Enable networking events and professional gatherings for members",
  },
  {
    icon: Globe,
    title: "Community Growth",
    description:
      "Expand our reach and support more Venezuelan energy professionals",
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Online Payment",
    description: "Secure payment through MemberPlanet portal",
  },
  {
    icon: Smartphone,
    title: "Zelle / QuickPay",
    description: "Send to donations@vapa-us.org",
  },
  {
    icon: Building,
    title: "Bank Transfer",
    description: "ACH or wire transfer via Chase Bank",
  },
];

const DONATION_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

function TierCard({
  tier,
  index,
}: {
  tier: (typeof donationTiers)[0];
  index: number;
}) {
  const Icon = tier.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex flex-col items-center justify-end gap-4 p-7 rounded-t-xl ${tier.height} ${
        tier.popular
          ? "bg-[var(--color-bg-dark)] border-2 border-[var(--color-primary)]"
          : index % 2 === 1
            ? "bg-[#0D1E33]"
            : "bg-[var(--color-bg-dark)]"
      }`}
    >
      {tier.popular && (
        <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[var(--color-bg-dark)] bg-[var(--color-primary)] rounded-full">
          POPULAR
        </span>
      )}

      <div
        className={`flex items-center justify-center rounded-full ${
          tier.popular
            ? "w-14 h-14 bg-[var(--color-primary)]"
            : "w-12 h-12 bg-[#D4A85320]"
        }`}
      >
        <Icon
          className={`${tier.popular ? "w-[26px] h-[26px]" : "w-[22px] h-[22px]"} ${
            tier.popular
              ? "text-[var(--color-bg-dark)]"
              : "text-[var(--color-primary)]"
          }`}
        />
      </div>

      <h3
        className={`font-bold text-white ${tier.popular ? "text-[22px]" : "text-xl"}`}
      >
        {tier.name}
      </h3>

      <span
        className={`font-bold text-[var(--color-primary)] ${tier.popular ? "text-[32px]" : "text-[28px]"}`}
      >
        {tier.amount}
      </span>

      <a
        href={DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-2.5 text-sm font-semibold text-center rounded-md transition-colors ${
          tier.popular
            ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] hover:opacity-90"
            : "border border-[#D4A85340] text-[var(--color-primary)] hover:bg-[#D4A85310]"
        }`}
      >
        {tier.popular ? "Donate Now" : "Donate"}
      </a>
    </motion.div>
  );
}

function ImpactCard({
  item,
  index,
}: {
  item: (typeof impactAreas)[0];
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-5 p-8 rounded-xl bg-[var(--color-bg-dark)]"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4A85320]">
        <Icon className="w-7 h-7 text-[var(--color-primary)]" />
      </div>
      <h3 className="text-xl font-semibold text-white text-center">
        {item.title}
      </h3>
      <p className="text-[15px] text-[var(--color-text-muted)] text-center leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

function PaymentCard({
  method,
  index,
}: {
  method: (typeof paymentMethods)[0];
  index: number;
}) {
  const Icon = method.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-5 p-8 rounded-xl bg-[#152D45] w-full md:w-[300px]"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#D4A85320]">
        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
      </div>
      <h3 className="text-lg font-semibold text-white">{method.title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] text-center leading-relaxed">
        {method.description}
      </p>
    </motion.div>
  );
}

export function DonationsContent() {
  return (
    <>
      {/* Tax Badge - appears below hero */}
      <div className="flex justify-center -mt-16 relative z-10 px-5">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D4A85320]"
        >
          <ShieldCheck className="w-[18px] h-[18px] text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-primary)]">
            501(c)(3) Tax-Deductible Organization
          </span>
        </motion.div>
      </div>

      {/* Donation Tiers Section */}
      <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-[#1A3352]">
        <div className="flex flex-col items-center gap-5 text-center">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
          >
            GIVING LEVELS
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Choose Your Impact Level
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[600px]"
          >
            Every contribution makes a difference. Select a giving level that
            works for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 items-end w-full max-w-[1280px]">
          {donationTiers.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-[#152D45]">
        <div className="flex flex-col items-center gap-5 text-center">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
          >
            YOUR IMPACT
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Where Your Donation Goes
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1280px]">
          {impactAreas.map((item, index) => (
            <ImpactCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-[var(--color-bg-dark)]">
        <div className="flex flex-col items-center gap-5 text-center">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
          >
            WAYS TO GIVE
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Payment Methods
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[500px]"
          >
            Choose the payment method that works best for you
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-[1000px]">
          {paymentMethods.map((method, index) => (
            <PaymentCard key={method.title} method={method} index={index} />
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 p-8 rounded-xl bg-[#D4A85310] w-full max-w-[1000px]"
        >
          <Mail className="w-6 h-6 text-[var(--color-primary)]" />
          <p className="text-base text-[var(--color-text-muted)] text-center sm:text-left">
            For donation certificates, please email your legal name and amount
            to{" "}
            <a
              href="mailto:donations@vapa-us.org"
              className="text-[var(--color-primary)] hover:underline"
            >
              donations@vapa-us.org
            </a>
          </p>
        </motion.div>
      </section>
    </>
  );
}
