"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/history" },
  { label: "Events", href: "#" },
  { label: "Membership", href: "/membership" },
  { label: "Donations", href: "/donations" },
  { label: "Digital Library", href: "/digital-library" },
  { label: "Contact", href: "#contact-form", scrollTo: true },
] as const;

interface HeaderProps {
  variant?: "solid" | "gradient";
  activeNav?: string;
}

export function Header({ variant = "solid", activeNav = "Home" }: HeaderProps) {
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

  const isGradient = variant === "gradient";

  const scrollToElement = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className={`${isGradient ? "absolute top-0 left-0 right-0" : "relative"} z-50`}
        style={
          isGradient
            ? {
                background:
                  "linear-gradient(180deg, #0A1628 0%, #0A1628 40%, transparent 100%)",
              }
            : { backgroundColor: "var(--color-bg-dark)" }
        }
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-10 lg:px-20 md:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #D4A853 0%, #B8923D 100%)",
              }}
            />
            <span className="text-2xl md:text-[28px] font-bold text-white">VAPA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navItems.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
                    item.label === activeNav
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {item.label}
                </a>
              ) : "scrollTo" in item && item.scrollTo ? (
                <button
                  key={item.label}
                  onClick={(e) => scrollToElement(e, item.href)}
                  className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
                    item.label === activeNav
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-[var(--color-primary)] ${
                    item.label === activeNav
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
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
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      {"external" in item && item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block py-4 text-lg font-medium transition-colors hover:text-[var(--color-primary)] border-b border-[var(--color-border-gold-light)]/30 ${
                            item.label === activeNav
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ) : "scrollTo" in item && item.scrollTo ? (
                        <button
                          className={`block w-full text-left py-4 text-lg font-medium transition-colors hover:text-[var(--color-primary)] border-b border-[var(--color-border-gold-light)]/30 ${
                            item.label === activeNav
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                          onClick={(e) => {
                            setIsMenuOpen(false);
                            setTimeout(() => scrollToElement(e, item.href), 300);
                          }}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block py-4 text-lg font-medium transition-colors hover:text-[var(--color-primary)] border-b border-[var(--color-border-gold-light)]/30 ${
                            item.label === activeNav
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
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
