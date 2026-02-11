"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Play, Clock, Info } from "lucide-react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  defaultViewport,
  smallViewport,
  slowTransition,
  staggerDelay,
} from "../utils/animations";
import type { Event } from "@/lib/database.types";

interface EventsSectionProps {
  events: Event[];
  specialEvents?: Event[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Get the first valid link from event
function getEventLink(links: string[]): string | null {
  const validLink = links.find(
    (link) => link && link !== "#" && link !== "#." && link.trim() !== ""
  );
  return validLink || null;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

function EventCardInternal({
  event,
  className = "",
}: {
  event: Event;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const eventLink = getEventLink(event.links);

  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      // Temporarily remove clamp to measure full height
      const originalStyle = el.style.cssText;
      el.style.cssText = "";
      const fullHeight = el.scrollHeight;
      // Get line height to calculate 2 lines
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const twoLineHeight = lineHeight * 2;
      // Restore original styles
      el.style.cssText = originalStyle;
      setIsClamped(fullHeight > twoLineHeight);
    }
  }, [event.name]);

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
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
    <motion.div
      ref={cardRef}
      className={`flex flex-col h-full rounded-lg bg-surface-section overflow-hidden relative ${className}`}
      whileHover={{ y: -8, boxShadow: "var(--shadow-card-hover-lg)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onTouchStart={handleTouch}
    >
      {/* Mobile ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none md:hidden"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <div className="relative h-[160px] md:h-[180px] w-full">
        <Image src={event.img} alt={event.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 md:gap-4 p-5 md:p-7 flex-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs md:text-[13px] font-medium text-accent">
            {formatDate(event.date)}
          </span>
        </div>
        <div>
          <h3
            ref={titleRef}
            className="text-lg md:text-base font-semibold text-white"
            style={
              !expanded
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
                : undefined
            }
          >
            {event.name}
          </h3>
          {isClamped && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-accent hover:underline mt-1"
            >
              {expanded ? "less" : "more"}
            </button>
          )}
        </div>
        {event.time && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="text-xs md:text-[13px] text-foreground-muted">
              {event.time}
            </span>
          </div>
        )}
        {event.description && (
          <p className="text-xs md:text-[13px] text-foreground-muted line-clamp-2">
            {event.description}
          </p>
        )}
        {eventLink && (
          <div className="flex justify-end mt-auto pt-2">
            <a
              href={eventLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              {event.type === "special_event" ? (
                <>
                  <Info className="w-3 h-3" />
                  More Info
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Join us
                </>
              )}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EventsGrid({ events }: { events: Event[] }) {
  return (
    <>
      {/* Mobile Swiper Carousel */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={smallViewport}
        transition={slowTransition}
        className="block md:hidden"
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.15}
          centeredSlides={false}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-accent !opacity-30",
            bulletActiveClass: "!opacity-100",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="!pb-10"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <EventCardInternal event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:flex gap-4 lg:gap-6 w-full">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={smallViewport}
            transition={staggerDelay(index)}
            className="flex-1"
          >
            <EventCardInternal event={event} />
          </motion.div>
        ))}
      </div>
    </>
  );
}

export function EventsSection({ events, specialEvents = [] }: EventsSectionProps) {
  return (
    <section className="flex flex-col gap-8 md:gap-12 lg:gap-[60px] px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
        <div className="flex flex-col gap-2 md:gap-4">
          <motion.span
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={slowTransition}
            className="text-[10px] md:text-xs font-semibold text-accent tracking-[2px]"
          >
            UPCOMING EVENTS
          </motion.span>
          <motion.h2
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={{ ...slowTransition, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white"
          >
            Programs & Webinars
          </motion.h2>
        </div>
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={slowTransition}
        >
          <Link
            href="/digital-library"
            className="flex items-center justify-center sm:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded border border-border-accent hover:bg-white/5 transition-colors w-full sm:w-auto"
          >
            <span className="text-sm font-medium text-accent">
              View All Events
            </span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </Link>
        </motion.div>
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <div className="flex flex-col gap-6 md:gap-8">
          <motion.h3
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={smallViewport}
            transition={slowTransition}
            className="text-lg md:text-xl font-semibold text-white"
          >
            Recent Events
          </motion.h3>
          <EventsGrid events={events} />
        </div>
      )}

      {/* Special Events */}
      {specialEvents.length > 0 && (
        <div className="flex flex-col gap-6 md:gap-8">
          <motion.h3
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={smallViewport}
            transition={slowTransition}
            className="text-lg md:text-xl font-semibold text-white"
          >
            Special Events
          </motion.h3>
          <EventsGrid events={specialEvents} />
        </div>
      )}
    </section>
  );
}
