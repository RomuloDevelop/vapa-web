"use client";

import { motion } from "motion/react";
import {
  GraduationCap,
  Briefcase,
  RefreshCw,
  Check,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const membershipPlans = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    price: 5,
    description:
      "Perfect for students in geology, geophysics, or petroleum-related fields",
    features: [
      "Access to webinars",
      "Networking events",
      "Mentorship program access",
    ],
    buttonText: "Join as Student",
    popular: false,
  },
  {
    id: "active",
    icon: Briefcase,
    title: "Active",
    price: 60,
    description:
      "For active professionals in the energy industry seeking full access",
    features: [
      "All webinars & seminars",
      "Full networking access",
      "Event participation",
      "Digital library access",
    ],
    buttonText: "Join as Active Member",
    popular: true,
  },
  {
    id: "transition",
    icon: RefreshCw,
    title: "In Transition",
    price: 30,
    description:
      "For professionals between jobs or transitioning careers in energy",
    features: [
      "Access to webinars",
      "Networking events",
      "Career support resources",
    ],
    buttonText: "Join In Transition",
    popular: false,
  },
];

const benefits = [
  {
    icon: Users,
    title: "Professional Network",
    description:
      "Connect with Venezuelan energy professionals in the Houston area and beyond",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description:
      "Access courses, seminars, and lunch-and-learn sessions on state-of-the-art technologies",
  },
  {
    icon: Calendar,
    title: "Exclusive Events",
    description:
      "Participate in exclusive events and assist in organizing association activities",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Advance your career through mentorship programs and professional development",
  },
];

const partners = [
  "Partner 1",
  "Partner 2",
  "Partner 3",
  "Partner 4",
  "Partner 5",
  "Partner 6",
  "Partner 7",
  "Partner 8",
  "Partner 9",
];

function MembershipCard({
  plan,
  index,
}: {
  plan: (typeof membershipPlans)[0];
  index: number;
}) {
  const Icon = plan.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex flex-col items-center gap-6 p-10 rounded-2xl bg-[var(--color-bg-dark)] ${
        plan.popular ? "border-2 border-[var(--color-primary)]" : ""
      }`}
      style={{ width: "100%", maxWidth: 380 }}
    >
      {plan.popular && (
        <span className="px-4 py-2 text-[11px] font-bold tracking-wider text-[var(--color-bg-dark)] bg-[var(--color-primary)] rounded-full">
          MOST POPULAR
        </span>
      )}

      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          plan.popular ? "bg-[var(--color-primary)]" : "bg-[#D4A85320]"
        }`}
      >
        <Icon
          className={`w-7 h-7 ${
            plan.popular
              ? "text-[var(--color-bg-dark)]"
              : "text-[var(--color-primary)]"
          }`}
        />
      </div>

      <h3 className="text-2xl font-bold text-white">{plan.title}</h3>

      <div className="flex items-end gap-1">
        <span className="text-2xl font-semibold text-[var(--color-primary)]">
          $
        </span>
        <span className="text-[56px] font-bold text-white leading-none">
          {plan.price}
        </span>
        <span className="text-lg text-[#8899AA] mb-1">/year</span>
      </div>

      <p className="text-[15px] text-[var(--color-text-muted)] text-center leading-relaxed max-w-[280px]">
        {plan.description}
      </p>

      <div className="flex flex-col gap-4 w-full">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <Check className="w-[18px] h-[18px] text-[var(--color-primary)]" />
            <span className="text-[15px] text-[var(--color-text-muted)]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid"
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-4 text-[15px] font-semibold text-center rounded-lg transition-colors ${
          plan.popular
            ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] hover:opacity-90"
            : "border border-[#D4A85350] text-[var(--color-primary)] hover:bg-[#D4A85310]"
        }`}
      >
        {plan.buttonText}
      </a>
    </motion.div>
  );
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof benefits)[0];
  index: number;
}) {
  const Icon = benefit.icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-5 p-8 rounded-xl bg-[var(--color-bg-dark)]"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#D4A85320]">
        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
      </div>
      <h3 className="text-xl font-semibold text-white text-center">
        {benefit.title}
      </h3>
      <p className="text-[15px] text-[var(--color-text-muted)] text-center leading-relaxed">
        {benefit.description}
      </p>
    </motion.div>
  );
}

export function MembershipContent() {
  return (
    <>
      {/* Membership Plans Section */}
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
            MEMBERSHIP PLANS
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Choose Your Membership
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[700px]"
          >
            Join VAPA and gain access to exclusive events, educational
            resources, and networking opportunities
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-[1240px]">
          {membershipPlans.map((plan, index) => (
            <MembershipCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
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
            WHY JOIN VAPA
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Membership Benefits
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1280px]">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={index} />
          ))}
        </div>
      </section>

      {/* Sponsors Section */}
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
            OUR PARTNERS
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[600px]"
          >
            We are proud to partner with leading organizations in the energy
            sector
          </motion.p>
        </div>

        <div className="flex flex-col gap-10 w-full max-w-[1100px]">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
            {partners.slice(0, 5).map((partner, index) => (
              <motion.div
                key={partner}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center justify-center w-[160px] lg:w-[180px] h-20 rounded-lg bg-[#152D45]"
              >
                <span className="text-base font-medium text-[#6B7A8A]">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
            {partners.slice(5).map((partner, index) => (
              <motion.div
                key={partner}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index + 5) * 0.05 }}
                className="flex items-center justify-center w-[160px] lg:w-[180px] h-20 rounded-lg bg-[#152D45]"
              >
                <span className="text-base font-medium text-[#6B7A8A]">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
