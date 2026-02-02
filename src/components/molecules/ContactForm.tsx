"use client";

import { useState, useMemo } from "react";
import useSWRMutation from "swr/mutation";
import { ExternalToast, toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";
import type { EmailResult } from "@/lib/services/email";

interface ContactFormProps {
  id?: string;
  className?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

// SWR mutation fetcher for Server Action
async function sendEmail(
  _key: string,
  { arg }: { arg: FormData }
): Promise<EmailResult> {
  return submitContactForm(arg);
}

interface ValidationErrors {
  email?: string;
  message?: string;
}

const commonToastOptions: ExternalToast = {
  descriptionClassName: "!text-foreground-muted",
  duration: 3000,
  position: "top-right",
}

const commonErrorToastOptions: ExternalToast = {
  ...commonToastOptions,
  className: "!bg-red-950/80 !backdrop-blur-sm !border-red-900/50 !text-white",
};

export function ContactForm({ id, className = "" }: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ email: false, message: false });

  // Real-time validation
  const errors = useMemo<ValidationErrors>(() => {
    const errs: ValidationErrors = {};

    // Email validation (only show if touched and has content)
    if (touched.email && email.length > 0 && !EMAIL_REGEX.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    // Message validation (only show if touched and has content)
    if (touched.message && message.length > 0 && message.length < MIN_MESSAGE_LENGTH) {
      errs.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters (${message.length}/${MIN_MESSAGE_LENGTH})`;
    }

    return errs;
  }, [email, message, touched]);

  const hasValidationErrors = Object.keys(errors).length > 0;
  const isFormValid = email.length > 0 && EMAIL_REGEX.test(email) && message.length >= MIN_MESSAGE_LENGTH;

  const { trigger, isMutating } = useSWRMutation("contact-form", sendEmail, {
    onSuccess: (result) => {
      if (result.success) {
        setEmail("");
        setName("");
        setMessage("");
        setTouched({ email: false, message: false });
        toast.success("Message sent!", {
          description: "We'll get back to you soon.",
          className: "!bg-green-950/80 !backdrop-blur-sm !border-green-900/50 !text-white",
          ...commonToastOptions,
        });
      } else {
        // Server error - show passive toast with blur effect
        toast.error("Failed to send message", {
          description: result.error || "Please try again later.",
          ...commonErrorToastOptions,
        });
      }
    },
    onError: () => {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
        ...commonErrorToastOptions,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all as touched on submit attempt
    setTouched({ email: true, message: true });

    // Don't submit if validation errors
    if (!isFormValid) return;

    const formData = new FormData(e.currentTarget);
    trigger(formData);
  };

  const handleEmailBlur = () => setTouched((prev) => ({ ...prev, email: true }));
  const handleMessageBlur = () => setTouched((prev) => ({ ...prev, message: true }));

  return (
    <div id={id} className={`flex flex-col gap-4 scroll-mt-8 ${className}`}>
      <span className="text-[10px] md:text-[11px] font-semibold text-accent tracking-[1.5px]">
        QUICK CONTACT
      </span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              disabled={isMutating}
              className={`w-full px-3.5 py-3 text-[13px] text-white placeholder:text-foreground-faint bg-surface border rounded-md focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-border-accent-light focus:border-accent"
              }`}
            />
            {errors.email && (
              <span className="text-[11px] text-red-500 font-medium">{errors.email}</span>
            )}
          </div>

          {/* Name Input (Optional) */}
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isMutating}
            className="w-full px-3.5 py-3 text-[13px] text-white placeholder:text-foreground-faint bg-surface border border-border-accent-light rounded-md focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Message Input */}
          <div className="flex flex-col gap-1">
            <textarea
              name="message"
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={handleMessageBlur}
              disabled={isMutating}
              rows={3}
              className={`w-full px-3.5 py-3 text-[13px] text-white placeholder:text-foreground-faint bg-surface border rounded-md resize-none focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-border-accent-light focus:border-accent"
              }`}
            />
            {errors.message && (
              <span className="text-[11px] text-red-500 font-medium">{errors.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isMutating || hasValidationErrors}
            className="px-5 py-2.5 bg-accent text-surface text-xs font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isMutating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
    </div>
  );
}
