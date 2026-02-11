import type { Variants } from "motion/react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// Common viewport configurations
export const defaultViewport = { once: true, amount: 0.3 };
export const smallViewport = { once: true, amount: 0.2 };
export const minimalViewport = { once: true, amount: 0.1 };

// Common transition configurations
export const defaultTransition = { duration: 0.5 };
export const slowTransition = { duration: 0.6 };
export const fastTransition = { duration: 0.3 };

// Shared hover animation for interactive cards
export const cardHover = {
  whileHover: { y: -4, boxShadow: "var(--shadow-card-hover)" },
  transition: { duration: 0.15 },
};

// Staggered delay helper
export const staggerDelay = (index: number, baseDelay = 0.1) => ({
  duration: 0.5,
  delay: index * baseDelay,
});
