"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks";

export function HeroSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative h-[700px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1726111265336-6bf825e549ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzU5OTN8&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Oil refinery at dusk"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A1628 0%, rgba(10, 22, 40, 0.5) 40%, rgba(10, 22, 40, 0) 70%)",
        }}
      />

      {/* Content */}
      <div className="absolute top-[120px] left-20 flex flex-col gap-8 max-w-[700px]">
        {/* Badge */}
        <div
          className={`flex items-center gap-2 px-5 py-2 rounded-[20px] border border-[var(--color-border-gold)] w-fit animate-on-scroll fade-in-left ${
            isVisible ? "visible" : ""
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="text-[13px] font-medium text-[var(--color-primary)]">
            Established 2019 • Texas, USA
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-[64px] font-bold text-white leading-[1.1] animate-on-scroll fade-in-left delay-100 ${
            isVisible ? "visible" : ""
          }`}
        >
          Empowering Venezuelan
          <br />
          Energy Professionals
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg text-[var(--color-text-muted)] leading-[1.6] max-w-[580px] animate-on-scroll fade-in-left delay-200 ${
            isVisible ? "visible" : ""
          }`}
        >
          A nonprofit professional organization uniting experts in the
          Hydrocarbon industry and related energies to promote technical
          advancement, education, and sustainable development.
        </p>

        {/* Buttons */}
        <div
          className={`flex items-center gap-4 animate-on-scroll fade-in-left delay-300 ${
            isVisible ? "visible" : ""
          }`}
        >
          <button className="px-9 py-[18px] bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-base font-semibold rounded hover:opacity-90 transition-opacity">
            Become a Member
          </button>
          <button className="px-9 py-[18px] text-white text-base font-medium rounded border border-[var(--color-border-gold-strong)] hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
