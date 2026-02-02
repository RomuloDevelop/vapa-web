"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface AccordionSectionProps {
  title: string;
  links: FooterLink[];
  isOpen: boolean;
  onToggle: () => void;
  onContactClick?: (e: React.MouseEvent) => void;
}

export function AccordionSection({
  title,
  links,
  isOpen,
  onToggle,
  onContactClick,
}: AccordionSectionProps) {
  return (
    <div className="border-b border-border-accent-light lg:border-none">
      {/* Mobile: Clickable header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 lg:hidden"
      >
        <span className="text-[10px] md:text-[11px] font-semibold text-accent tracking-[1.5px]">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-accent" />
        </motion.div>
      </button>

      {/* Desktop: Static header */}
      <span className="hidden lg:block text-[10px] md:text-[11px] font-semibold text-accent tracking-[1.5px] mb-5">
        {title}
      </span>

      {/* Mobile: Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-2.5 pb-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.label === "Contact Us" ? onContactClick : undefined}
                  className="text-sm text-foreground-muted hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Always visible content */}
      <div className="hidden lg:flex flex-col gap-3.5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={link.label === "Contact Us" ? onContactClick : undefined}
            className="text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
