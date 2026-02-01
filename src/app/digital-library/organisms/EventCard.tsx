"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, Play } from "lucide-react";
import { fadeInUp, staggerDelay, smallViewport } from "@/components/utils/animations";
import { formatDate, getVideoUrl } from "../utils";
import type { Event } from "@/lib/database.types";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface EventCardProps {
  event: Event;
  index: number;
  animate?: boolean;
}

export function EventCard({ event, index, animate = true }: EventCardProps) {
  const videoUrl = getVideoUrl(event.links);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const cardRef = useRef<HTMLElement>(null);

  const handleTouch = (e: React.TouchEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <motion.article
      ref={cardRef}
      variants={animate ? fadeInUp : undefined}
      initial={animate ? "hidden" : undefined}
      whileInView={animate ? "visible" : undefined}
      viewport={animate ? smallViewport : undefined}
      transition={animate ? staggerDelay(index) : { duration: 0.15 }}
      whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)" }}
      onTouchStart={handleTouch}
      className="flex flex-col sm:flex-row bg-[var(--color-bg-dark)] rounded-xl overflow-hidden relative"
    >
      {/* Mobile ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none md:hidden z-10"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
          animate={{ width: 400, height: 400, x: -200, y: -200, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Image */}
      <div className="relative w-full sm:w-[200px] md:w-[240px] lg:w-[280px] h-[180px] sm:h-auto sm:min-h-[200px] flex-shrink-0">
        <Image src={event.img} alt={event.name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 md:gap-4 p-5 md:p-6 lg:p-8 justify-center">
        {/* Badge */}
        <span className="px-3 py-1.5 text-[10px] md:text-[11px] font-semibold tracking-[1px] text-[var(--color-primary)] bg-[#D4A85320] rounded-full w-fit">
          {event.type.toUpperCase()}
        </span>

        {/* Date and Time Row */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* Date */}
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 md:w-[18px] md:h-[18px] text-[var(--color-primary)]" />
            <span className="text-sm md:text-[15px] font-medium text-[var(--color-primary)]">
              {formatDate(event.date)}
            </span>
          </div>

          {/* Time */}
          {event.time && (
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 md:w-[18px] md:h-[18px] text-[var(--color-text-muted)]" />
              <span className="text-sm md:text-[15px] text-[var(--color-text-muted)]">
                {event.time}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-[1.2]">
          {event.name}
        </h3>

        {/* Presenters */}
        {event.presenters.length > 0 && event.presenters.some((p) => p.trim()) && (
          <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
            Presented by{" "}
            {event.presenters
              .filter((p) => p.trim() && !p.startsWith("Presentador:"))
              .join(", ")}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {videoUrl && videoUrl !== "#" && videoUrl !== "#." && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-xs md:text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Watch Recording
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
