"use client";

import { Linkedin, Instagram, Youtube, MapPin, Mail } from "lucide-react";

const footerLinks = {
  organization: {
    title: "ORGANIZATION",
    links: ["About VAPA", "VAPALink", "Anniversary", "Digital Library"],
  },
  events: {
    title: "EVENTS",
    links: ["Weekly Webinars", "Special Events", "Past Events", "Mentoring Program"],
  },
  getInvolved: {
    title: "GET INVOLVED",
    links: ["Membership", "Donations", "Volunteer", "Contact Us"],
  },
};

const socialLinks = [
  { icon: Linkedin, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="flex flex-col bg-[var(--color-bg-darker)]">
      {/* Main Footer */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-8 p-5 md:p-10 lg:p-20">
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

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-20">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="flex flex-col gap-4 md:gap-5">
              <span className="text-[10px] md:text-[11px] font-semibold text-[var(--color-primary)] tracking-[1.5px]">
                {section.title}
              </span>
              <div className="flex flex-col gap-2.5 md:gap-3.5">
                {section.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
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
