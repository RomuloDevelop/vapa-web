"use client";

import { useState } from "react";
import Image from "next/image";
import { Linkedin, Instagram, Youtube, MapPin, Mail } from "lucide-react";
import { AccordionSection, ContactForm } from "../molecules";
import { socialLinks } from "@/config/navigation";

const socialIconMap = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
} as const;

const footerLinks = {
  organization: {
    title: "ABOUT US",
    links: [
      { label: "Our History", href: "/about/history" },
      { label: "Board of Directors", href: "/about/directors" },
      { label: "Advisory Board", href: "/about/advisory" },
      { label: "VAPALink", href: "/about/links" },
      { label: "VAPAResPro", href: "/about/respro" },
    ],
  },
  events: {
    title: "EVENTS",
    links: [
      { label: "Weekly Webinars", href: "/events/webinars" },
      { label: "Special Events", href: "/events/special" },
      { label: "Digital Library", href: "/digital-library" },
    ],
  },
  getInvolved: {
    title: "GET INVOLVED",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Donations", href: "/donations" },
    ],
  },
};


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
    <footer className="flex flex-col bg-surface-sunken">
      {/* Main Footer */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8 p-5 md:p-10 lg:p-20">
        {/* Brand Section */}
        <div className="flex flex-col gap-5 md:gap-6 w-full lg:w-[340px]">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/vapa-icon.png" alt="VAPA logo" width={40} height={40} className="w-9 h-9 md:w-10 md:h-10 object-contain shrink-0" />
            <span className="text-xl md:text-2xl font-bold text-white">VAPA</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-foreground-subtle leading-[1.6]">
            Venezuelan-American Petroleum Association. Uniting energy
            professionals for technical advancement and sustainable development.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-4">
            {socialLinks.map((social) => {
              const Icon = socialIconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-md border border-accent-30 hover:border-accent transition-colors"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Navigation Columns + Contact Form */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-12 xl:gap-16">
          {/* Mobile: Accordion sections */}
          <div className="flex flex-col lg:contents">
            {Object.entries(footerLinks).map(([key, section]) => (
              <nav key={key} aria-label={section.title}>
                <AccordionSection
                  title={section.title}
                  links={section.links}
                  isOpen={openSection === key}
                  onToggle={() => handleToggle(key)}
                  onContactClick={scrollToContact}
                />
              </nav>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 w-full sm:max-w-[400px] lg:max-w-none pt-6 lg:pt-0">
            <ContactForm id="contact-form" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-10 lg:px-20 py-5 md:py-6 border-t border-border-accent-light">
        <span className="text-sm text-foreground-faint">
          © 2025 VAPA. All rights reserved.
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-foreground-faint flex-shrink-0" />
            <span className="text-sm text-foreground-faint">
              26009 Budde Rd. Suite A-200, The Woodlands, TX 77380
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-foreground-faint flex-shrink-0" />
            <span className="text-sm text-foreground-faint">
              info@vapa-us.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
