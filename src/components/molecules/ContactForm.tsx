"use client";

import { useState } from "react";

interface ContactFormProps {
  id?: string;
  className?: string;
}

export function ContactForm({ id, className = "" }: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, message });
  };

  return (
    <div id={id} className={`flex flex-col gap-4 scroll-mt-8 ${className}`}>
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
