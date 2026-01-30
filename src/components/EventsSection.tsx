"use client";

import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

function EventCard({
  event,
  className = "",
}: {
  event: (typeof events)[0];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col h-full rounded-lg bg-[var(--color-bg-section)] overflow-hidden ${className}`}
    >
      <div className="relative h-[160px] md:h-[180px] w-full">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 md:gap-4 p-5 md:p-7">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span className="text-xs md:text-[13px] font-medium text-[var(--color-primary)]">
            {event.date}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white">{event.title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-[1.5]">
          {event.description}
        </p>
      </div>
    </div>
  );
}

export function EventsSection() {
  return (
    <section className="flex flex-col gap-8 md:gap-12 lg:gap-[60px] px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-[var(--color-bg-dark)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
        <div className="flex flex-col gap-2 md:gap-4">
          <motion.span
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] tracking-[2px]"
          >
            UPCOMING EVENTS
          </motion.span>
          <motion.h2
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white"
          >
            Programs & Webinars
          </motion.h2>
        </div>
        <motion.button
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded border border-[var(--color-border-gold)] hover:bg-white/5 transition-colors w-full sm:w-auto"
        >
          <span className="text-sm font-medium text-[var(--color-primary)]">
            View All Events
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--color-primary)]" />
        </motion.button>
      </div>

      {/* Mobile Swiper Carousel */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="block md:hidden"
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.15}
          centeredSlides={false}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-[var(--color-primary)] !opacity-30",
            bulletActiveClass: "!opacity-100",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="!pb-10"
        >
          {events.map((event) => (
            <SwiperSlide key={event.title}>
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:flex gap-4 lg:gap-6 w-full">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-1"
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
