"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { fadeInUp, defaultViewport, staggerDelay } from "../utils/animations";

interface PricingCardProps {
  icon: LucideIcon;
  title: string;
  price?: number;
  amount?: string;
  priceLabel?: string;
  description?: string;
  features?: string[];
  buttonText: string;
  buttonHref: string;
  popular?: boolean;
  index?: number;
  animate?: boolean;
  variant?: "membership" | "donation";
  className?: string;
}

export function PricingCard({
  icon: Icon,
  title,
  price,
  amount,
  priceLabel = "/year",
  description,
  features,
  buttonText,
  buttonHref,
  popular = false,
  index = 0,
  animate = true,
  variant = "membership",
  className = "",
}: PricingCardProps) {
  const Component = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        variants: fadeInUp,
        initial: "hidden",
        whileInView: "visible",
        viewport: defaultViewport,
        transition: staggerDelay(index),
      }
    : {};

  const isDonation = variant === "donation";

  return (
    <Component
      {...motionProps}
      className={`flex flex-col items-center gap-6 p-8 md:p-10 rounded-2xl bg-[var(--color-bg-dark)] ${
        popular ? "border-2 border-[var(--color-primary)]" : ""
      } ${className}`}
    >
      {popular && (
        <span className="px-4 py-2 text-[11px] font-bold tracking-wider text-[var(--color-bg-dark)] bg-[var(--color-primary)] rounded-full">
          {isDonation ? "POPULAR" : "MOST POPULAR"}
        </span>
      )}

      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          popular ? "bg-[var(--color-primary)]" : "bg-[#D4A85320]"
        }`}
      >
        <Icon
          className={`w-7 h-7 ${
            popular ? "text-[var(--color-bg-dark)]" : "text-[var(--color-primary)]"
          }`}
        />
      </div>

      <h3 className="text-2xl font-bold text-white">{title}</h3>

      {price !== undefined && (
        <div className="flex items-end gap-1">
          <span className="text-2xl font-semibold text-[var(--color-primary)]">$</span>
          <span className="text-[56px] font-bold text-white leading-none">{price}</span>
          <span className="text-lg text-[#8899AA] mb-1">{priceLabel}</span>
        </div>
      )}

      {amount && (
        <span className="text-[32px] font-bold text-[var(--color-primary)]">{amount}</span>
      )}

      {description && (
        <p className="text-[15px] text-[var(--color-text-muted)] text-center leading-relaxed max-w-[280px]">
          {description}
        </p>
      )}

      {features && features.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] text-[var(--color-primary)] flex-shrink-0" />
              <span className="text-[15px] text-[var(--color-text-muted)]">{feature}</span>
            </div>
          ))}
        </div>
      )}

      <a
        href={buttonHref}
        target={buttonHref.startsWith("http") ? "_blank" : undefined}
        rel={buttonHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`w-full py-4 text-[15px] font-semibold text-center rounded-lg transition-colors ${
          popular
            ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] hover:opacity-90"
            : "border border-[#D4A85340] text-[var(--color-primary)] hover:bg-[#D4A85310]"
        }`}
      >
        {buttonText}
      </a>
    </Component>
  );
}
