"use client";

import { motion } from "motion/react";
import { GraduationCap, Briefcase, RefreshCw, Check } from "lucide-react";
import {
  fadeInUp,
  defaultViewport,
  staggerDelay,
} from "@/components/utils/animations";
import { SectionHeader } from "@/components/molecules";

const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

const membershipPlans = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    price: 5,
    description:
      "Perfect for students in the energy industry",
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
      "For active professionals in the energy industry",
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
      "All webinars & seminars",
      "Full networking access",
      "Event participation",
      "Digital library access",
    ],
    buttonText: "Join In Transition",
    popular: false,
  },
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
      viewport={defaultViewport}
      transition={staggerDelay(index)}
      className={`flex flex-col items-center gap-6 p-10 rounded-2xl bg-surface ${
        plan.popular ? "border-2 border-accent" : ""
      }`}
      style={{ width: "100%", maxWidth: 380 }}
    >
      {plan.popular && (
        <span className="px-4 py-2 text-[11px] font-bold tracking-wider text-surface bg-accent rounded-full">
          MOST POPULAR
        </span>
      )}

      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          plan.popular ? "bg-accent" : "bg-accent-20"
        }`}
      >
        <Icon
          className={`w-7 h-7 ${
            plan.popular
              ? "text-surface"
              : "text-accent"
          }`}
        />
      </div>

      <h3 className="text-2xl font-bold text-white">{plan.title}</h3>

      <div className="flex items-end gap-1">
        <span className="text-2xl font-semibold text-accent">
          $
        </span>
        <span className="text-[56px] font-bold text-white leading-none">
          {plan.price}
        </span>
        <span className="text-lg text-foreground-subtle mb-1">/year</span>
      </div>

      <p className="text-[15px] text-foreground-muted text-center leading-relaxed max-w-[280px]">
        {plan.description}
      </p>

      <div className="flex flex-col gap-4 w-full">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <Check className="w-[18px] h-[18px] text-accent" />
            <span className="text-[15px] text-foreground-muted">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <a
        href={MEMBERSHIP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-4 text-[15px] font-semibold text-center rounded-lg transition-colors ${
          plan.popular
            ? "bg-accent text-surface hover:opacity-90"
            : "border border-border-accent-strong text-accent hover:bg-accent-10"
        }`}
      >
        {plan.buttonText}
      </a>
    </motion.div>
  );
}

export function MembershipPlansSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-5 md:px-10 lg:px-20 py-20 md:py-24 lg:py-28 bg-surface-elevated">
      <SectionHeader
        label="MEMBERSHIP PLANS"
        title="Choose Your Membership"
        subtitle="Join VAPA and gain access to exclusive events, educational resources, and networking opportunities"
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-[1240px]">
        {membershipPlans.map((plan, index) => (
          <MembershipCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>
    </section>
  );
}
