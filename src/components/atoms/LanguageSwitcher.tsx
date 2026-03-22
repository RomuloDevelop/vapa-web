"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

function USFlag({ className = "w-5 h-3.5 rounded-sm shrink-0" }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      {/* Stripes */}
      <rect width="60" height="30" fill="#B22234" />
      <path d="M0,3.46H60M0,8.08H60M0,12.69H60M0,17.31H60M0,21.92H60M0,26.54H60" stroke="#FFF" strokeWidth="2.31" />
      {/* Canton */}
      <rect width="24" height="16.15" fill="#3C3B6E" />
      {/* Simplified stars as dots */}
      <g fill="#FFF">
        <circle cx="4" cy="2.7" r="1" />
        <circle cx="8" cy="2.7" r="1" />
        <circle cx="12" cy="2.7" r="1" />
        <circle cx="16" cy="2.7" r="1" />
        <circle cx="20" cy="2.7" r="1" />
        <circle cx="6" cy="5.4" r="1" />
        <circle cx="10" cy="5.4" r="1" />
        <circle cx="14" cy="5.4" r="1" />
        <circle cx="18" cy="5.4" r="1" />
        <circle cx="4" cy="8.1" r="1" />
        <circle cx="8" cy="8.1" r="1" />
        <circle cx="12" cy="8.1" r="1" />
        <circle cx="16" cy="8.1" r="1" />
        <circle cx="20" cy="8.1" r="1" />
        <circle cx="6" cy="10.8" r="1" />
        <circle cx="10" cy="10.8" r="1" />
        <circle cx="14" cy="10.8" r="1" />
        <circle cx="18" cy="10.8" r="1" />
        <circle cx="4" cy="13.5" r="1" />
        <circle cx="8" cy="13.5" r="1" />
        <circle cx="12" cy="13.5" r="1" />
        <circle cx="16" cy="13.5" r="1" />
        <circle cx="20" cy="13.5" r="1" />
      </g>
    </svg>
  );
}

function VenezuelaFlag({ className = "w-5 h-3.5 rounded-sm shrink-0" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      {/* Yellow stripe (top) */}
      <rect width="60" height="13.3" fill="#FFCC00" />
      {/* Blue stripe (middle) */}
      <rect y="13.3" width="60" height="13.4" fill="#00247D" />
      {/* Red stripe (bottom) */}
      <rect y="26.7" width="60" height="13.3" fill="#CF142B" />
      {/* 8 white stars in arc */}
      <g fill="#FFF">
        <circle cx="16" cy="20" r="1.3" />
        <circle cx="20.5" cy="17.5" r="1.3" />
        <circle cx="26" cy="16" r="1.3" />
        <circle cx="31.5" cy="15.5" r="1.3" />
        <circle cx="37" cy="16" r="1.3" />
        <circle cx="42" cy="17.5" r="1.3" />
        <circle cx="46" cy="20" r="1.3" />
        <circle cx="31" cy="19" r="1.3" />
      </g>
    </svg>
  );
}

const locales = [
  { code: "en", label: "English", Flag: USFlag },
  { code: "es", label: "Espanol", Flag: VenezuelaFlag },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) || locales[0];

  const switchLocale = (newLocale: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium text-foreground-muted hover:text-accent border border-border-accent rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={locale === "en" ? "Change language" : "Cambiar idioma"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <current.Flag />
        <span className="uppercase">{current.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1.5 w-40 rounded-lg border border-border-accent bg-surface shadow-lg shadow-black/30 overflow-hidden z-50"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === locale}
              onClick={() => switchLocale(l.code)}
              className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm transition-colors ${
                l.code === locale
                  ? "bg-accent-15 text-accent font-medium"
                  : "text-foreground-muted hover:bg-accent-10 hover:text-white"
              }`}
            >
              <l.Flag />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
