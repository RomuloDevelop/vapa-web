"use client";

import { useState } from "react";
import { Linkedin, Instagram, Youtube, MapPin, Mail } from "lucide-react";
import { AccordionSection, ContactForm } from "../molecules";

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
      { label: "Weekly Webinars", href: "/events/webinars" },
      { label: "Special Events", href: "/events/special" },
      { label: "Digital Library", href: "/digital-library" },
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
  { icon: Linkedin, href: "https://www.linkedin.com/company/40898534/" },
  { icon: Instagram, href: "https://www.instagram.com/vapa.us/" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UCT5ejHEYwbGAadcQ7ttmAwA" },
];

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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-gradient-accent" />
            <span className="text-xl md:text-2xl font-bold text-white">VAPA</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-foreground-subtle leading-[1.6]">
            Venezuelan-American Petroleum Association. Uniting energy
            professionals for technical advancement and sustainable development.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-md border border-accent-30 hover:border-accent transition-colors"
              >
                <social.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-10 lg:px-20 py-5 md:py-6 border-t border-border-accent-light">
        <span className="text-xs md:text-[13px] text-foreground-faint">
          © 2025 VAPA. All rights reserved.
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-foreground-faint flex-shrink-0" />
            <span className="text-xs md:text-[13px] text-foreground-faint">
              26009 Budde Rd. Suite A-200, The Woodlands, TX 77380
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-foreground-faint flex-shrink-0" />
            <span className="text-xs md:text-[13px] text-foreground-faint">
              info@vapa-us.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
