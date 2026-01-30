"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section ref={ref} className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1768564206500-5cddb1fea679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzYxMjB8&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Professional meeting"
        fill
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10, 22, 40, 0.9) 0%, rgba(13, 30, 51, 0.8) 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-20">
        <span
          className={`text-xs font-semibold text-[var(--color-primary)] tracking-[2px] animate-on-scroll fade-in-up ${
            isVisible ? "visible" : ""
          }`}
        >
          JOIN OUR COMMUNITY
        </span>
        <h2
          className={`text-[52px] font-bold text-white text-center animate-on-scroll fade-in-up delay-100 ${
            isVisible ? "visible" : ""
          }`}
        >
          Become a VAPA Member Today
        </h2>
        <p
          className={`text-lg text-[var(--color-text-muted)] leading-[1.6] text-center max-w-[700px] animate-on-scroll fade-in-up delay-200 ${
            isVisible ? "visible" : ""
          }`}
        >
          Join a network of Venezuelan energy professionals dedicated to
          excellence, innovation, and the sustainable development of the
          hydrocarbon industry.
        </p>
        <div
          className={`flex items-center gap-5 animate-on-scroll fade-in-up delay-300 ${
            isVisible ? "visible" : ""
          }`}
        >
          <button className="flex items-center gap-3 px-12 py-5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-base font-semibold rounded hover:opacity-90 transition-opacity">
            Register Now
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
          <button className="px-12 py-5 text-white text-base font-medium rounded border border-[var(--color-border-white)] hover:bg-white/5 transition-colors">
            Make a Donation
          </button>
        </div>
      </div>
    </section>
  );
}
