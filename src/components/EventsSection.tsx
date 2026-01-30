"use client";

import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

const events = [
  {
    image:
      "https://images.unsplash.com/photo-1676277759236-fdc9fe039d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzYwODN8&ixlib=rb-4.1.0&q=80&w=1080",
    date: "January 16, 2026",
    title: "Venezuela Digital Strategy Webinar",
    description:
      "Exploring digital transformation strategies for the Venezuelan energy sector.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1647510283848-1884fb01e887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzYwODZ8&ixlib=rb-4.1.0&q=80&w=1080",
    date: "January 21, 2025",
    title: "Financial Freedom Course",
    description:
      "A comprehensive course on financial planning and investment strategies for energy professionals.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1565351167686-7a19c5114965?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk3MzYwODh8&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 2025",
    title: "Mentoring Program 2025",
    description:
      "Connect with industry leaders through our annual mentoring program for career development.",
  },
];

const delayClasses = ["delay-100", "delay-200", "delay-300"];

export function EventsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="flex flex-col gap-[60px] px-20 py-[100px] bg-[var(--color-bg-dark)]">
      {/* Header */}
      <div ref={headerRef} className="flex items-end justify-between w-full">
        <div className="flex flex-col gap-4">
          <span
            className={`text-xs font-semibold text-[var(--color-primary)] tracking-[2px] animate-on-scroll fade-in-left ${
              headerVisible ? "visible" : ""
            }`}
          >
            UPCOMING EVENTS
          </span>
          <h2
            className={`text-[42px] font-bold text-white animate-on-scroll fade-in-left delay-100 ${
              headerVisible ? "visible" : ""
            }`}
          >
            Programs & Webinars
          </h2>
        </div>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded border border-[var(--color-border-gold)] hover:bg-white/5 transition-colors animate-on-scroll fade-in-right ${
            headerVisible ? "visible" : ""
          }`}
        >
          <span className="text-sm font-medium text-[var(--color-primary)]">
            View All Events
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--color-primary)]" />
        </button>
      </div>

      {/* Events Grid */}
      <div ref={cardsRef} className="flex gap-6 w-full">
        {events.map((event, index) => (
          <div
            key={event.title}
            className={`flex flex-col flex-1 rounded-lg bg-[var(--color-bg-section)] overflow-hidden animate-on-scroll fade-in-up ${
              delayClasses[index]
            } ${cardsVisible ? "visible" : ""}`}
          >
            <div className="relative h-[180px] w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 p-7">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span className="text-[13px] font-medium text-[var(--color-primary)]">
                  {event.date}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">{event.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[1.5]">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
