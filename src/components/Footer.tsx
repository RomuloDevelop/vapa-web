"use client";

import { useState } from "react";
import { Linkedin, Instagram, Youtube, MapPin, Mail, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const footerLinks = {
  organization: {
    title: "ORGANIZATION",
    links: [
      { label: "About VAPA", href: "/about/history" },
      { label: "VAPALink", href: "#" },
      { label: "Anniversary", href: "#" },
      { label: "Digital Library", href: "/digital-library" },
    ],
  },
  events: {
    title: "EVENTS",
    links: [
      { label: "Weekly Webinars", href: "#" },
      { label: "Special Events", href: "#" },
      { label: "Past Events", href: "#" },
      { label: "Mentoring Program", href: "#" },
    ],
  },
  getInvolved: {
    title: "GET INVOLVED",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Donations", href: "/donations" },
      { label: "Volunteer", href: "#" },
      { label: "Contact Us", href: "#contact-form" },
    ],
  },
};

const socialLinks = [
  { icon: Linkedin, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
];

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

function AccordionSection({ title, links, isOpen, onToggle, onContactClick }: AccordionSectionProps) {
  return (
    <div className="border-b border-[var(--color-border-gold-light)] lg:border-none">
      {/* Mobile: Clickable header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 lg:hidden"
      >
        <span className="text-[10px] md:text-[11px] font-semibold text-[var(--color-primary)] tracking-[1.5px]">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--color-primary)]" />
        </motion.div>
      </button>

      {/* Desktop: Static header */}
      <span className="hidden lg:block text-[10px] md:text-[11px] font-semibold text-[var(--color-primary)] tracking-[1.5px] mb-5">
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
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
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
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ContactForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, message });
  };

  return (
    <div id={id} className="flex flex-col gap-4 scroll-mt-8">
      <span className="text-[10px] md:text-[11px] font-semibold text-[var(--color-primary)] tracking-[1.5px]">
        QUICK CONTACT
      </span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-3 text-[13px] text-white placeholder:text-[var(--color-text-tertiary)] bg-[var(--color-bg-dark)] border border-[var(--color-border-gold-light)] rounded-md focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <textarea
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-3 text-[13px] text-white placeholder:text-[var(--color-text-tertiary)] bg-[var(--color-bg-dark)] border border-[var(--color-border-gold-light)] rounded-md resize-none focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-xs font-semibold rounded hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="flex flex-col bg-[var(--color-bg-darker)]">
      {/* Main Footer */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8 p-5 md:p-10 lg:p-20">
        {/* Brand Section */}
        <div className="flex flex-col gap-5 md:gap-6 w-full lg:w-[340px]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-md"
              style={{
                background: "linear-gradient(135deg, #D4A853 0%, #B8923D 100%)",
              }}
            />
            <span className="text-xl md:text-2xl font-bold text-white">VAPA</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[var(--color-text-secondary)] leading-[1.6]">
            Venezuelan-American Petroleum Association. Uniting energy
            professionals for technical advancement and sustainable development.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-md border border-[#D4A85330] hover:border-[var(--color-primary)] transition-colors"
              >
                <social.icon className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Columns + Contact Form */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-12 xl:gap-16">
          {/* Mobile: Accordion sections */}
          <div className="flex flex-col lg:contents">
            {Object.entries(footerLinks).map(([key, section]) => (
              <AccordionSection
                key={key}
                title={section.title}
                links={section.links}
                isOpen={openSection === key}
                onToggle={() => handleToggle(key)}
                onContactClick={scrollToContact}
              />
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 w-full sm:max-w-[400px] lg:max-w-none pt-6 lg:pt-0">
            <ContactForm id="contact-form" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-10 lg:px-20 py-5 md:py-6 border-t border-[var(--color-border-gold-light)]">
        <span className="text-xs md:text-[13px] text-[var(--color-text-tertiary)]">
          © 2025 VAPA. All rights reserved.
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] flex-shrink-0" />
            <span className="text-xs md:text-[13px] text-[var(--color-text-tertiary)]">
              26009 Budde Rd. Suite A-200, The Woodlands, TX 77380
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] flex-shrink-0" />
            <span className="text-xs md:text-[13px] text-[var(--color-text-tertiary)]">
              info@vapa-us.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
