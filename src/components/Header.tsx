"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { label: "Home", active: true },
  { label: "About", active: false },
  { label: "Events", active: false },
  { label: "Membership", active: false },
  { label: "Donations", active: false },
  { label: "Digital Library", active: false },
  { label: "Contact", active: false },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="relative z-50 bg-[var(--color-bg-dark)]">
        <div className="flex items-center justify-between px-5 py-4 md:px-10 lg:px-20 md:py-6">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #D4A853 0%, #B8923D 100%)",
              }}
            />
            <span className="text-2xl md:text-[28px] font-bold text-white">VAPA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
                  item.active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <button className="hidden md:block px-5 lg:px-7 py-3 lg:py-3.5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-semibold rounded hover:opacity-90 transition-opacity">
            Join VAPA
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[70vw] max-w-[320px] bg-[var(--color-bg-dark)] z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col min-h-full">
                {/* Menu Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border-gold-light)]">
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #D4A853 0%, #B8923D 100%)",
                    }}
                  />
                  <span className="text-2xl font-bold text-white">VAPA</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col flex-1 px-6 py-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href="#"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className={`py-4 text-lg font-medium transition-colors hover:text-[var(--color-primary)] border-b border-[var(--color-border-gold-light)]/30 ${
                        item.active
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                {/* CTA Button */}
                <div className="px-6 py-6 mt-auto">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-base font-semibold rounded hover:opacity-90 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join VAPA
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
