"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { fadeInUp, fadeIn } from "../utils/animations";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DONATION_EMAIL = "mailto:donations@vapa-us.org?subject=Donation%20to%20VAPA";

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-[480px]"
          >
            <div className="relative flex flex-col gap-6 p-6 md:p-8 rounded-xl bg-surface border border-border-accent-light">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-foreground-faint hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col gap-2 pr-8">
                <span className="text-[10px] md:text-xs font-semibold text-accent tracking-[2px]">
                  SUPPORT VAPA
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Ready to Make a Difference?
                </h3>
              </div>

              {/* Content */}
              <p className="text-sm md:text-[15px] text-foreground-muted leading-relaxed">
                Thank you for your interest in supporting VAPA! To complete your contribution via{" "}
                <span className="text-white font-medium">Zelle</span>,{" "}
                <span className="text-white font-medium">QuickPay</span>,{" "}
                <span className="text-white font-medium">ACH</span>, or{" "}
                <span className="text-white font-medium">wire transfer</span>, please send us an email and we&apos;ll
                promptly share our Chase Bank account details.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={DONATION_EMAIL}
                  onClick={onClose}
                  className="flex-1 py-3.5 px-6 bg-accent text-surface text-sm font-semibold rounded text-center hover:opacity-90 transition-opacity"
                >
                  Send Email to Donate
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 px-6 border border-border-accent text-foreground-muted text-sm font-medium rounded text-center hover:bg-white/5 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
