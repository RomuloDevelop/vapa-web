"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Button } from "../atoms/Button";
import { fadeInLeft, defaultViewport, slowTransition } from "../utils/animations";

const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

const EDGE_ZONE = 120; // px from edge to trigger arrow

const heroSlides = [
  {
    src: "/images/heroes/hero-1.jpg",
    alt: "Oil refinery at dusk",
    className: "object-cover -scale-x-100",
    objectPosition: "right 100%",
  },
  {
    src: "/images/heroes/hero-2.jpg",
    alt: "Oil pumpjack in the field",
  },
  {
    src: "/images/heroes/hero-3.jpg",
    alt: "Aerial view of an oil refinery complex with storage tanks",
  },
];

export function HeroSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    setShowLeftArrow(x < EDGE_ZONE);
    setShowRightArrow(x > width - EDGE_ZONE);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowLeftArrow(false);
    setShowRightArrow(false);
  }, []);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[600px] md:h-[700px] lg:h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image Carousel */}
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !bg-accent !opacity-30 !w-6 !h-[3px] !rounded-full",
          bulletActiveClass: "!opacity-100 !w-10",
        }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="absolute inset-0 h-full w-full z-0 [&_.swiper-pagination]:!bottom-6 [&_.swiper-pagination]:!z-30"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className={slide.className || "object-cover"}
              style={
                slide.objectPosition
                  ? { objectPosition: slide.objectPosition }
                  : undefined
              }
              priority={index === 0}
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero-overlay z-10 pointer-events-none" />

      {/* Navigation Arrows - Desktop only */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-5 top-1/2 z-30 w-12 h-12 items-center justify-center rounded border border-border-interactive text-white cursor-pointer"
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: showLeftArrow ? 1 : 0,
          transform: showLeftArrow
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(-8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: showLeftArrow ? "auto" : "none",
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-5 top-1/2 z-30 w-12 h-12 items-center justify-center rounded border border-border-interactive text-white cursor-pointer"
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: showRightArrow ? 1 : 0,
          transform: showRightArrow
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: showRightArrow ? "auto" : "none",
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center left-5 md:left-10 lg:left-20 xl:left-[5%] 2xl:left-[8%] right-5 md:right-10 lg:right-auto gap-5 md:gap-6 lg:gap-8 max-w-full sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] 2xl:max-w-[800px] z-20 pointer-events-none">
        {/* Badge */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={slowTransition}
          className="flex items-center gap-2 px-4 md:px-5 py-2 rounded-[20px] border border-border-accent w-fit pointer-events-auto"
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-sm font-medium text-accent">
            Established 2019 • Texas, USA
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ ...slowTransition, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold text-white leading-[1.1]"
        >
          Empowering Venezuelan
          <br />
          Energy Professionals
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ ...slowTransition, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg xl:text-xl text-white/85 leading-[1.6] max-w-full md:max-w-[500px] lg:max-w-[580px] xl:max-w-[620px] 2xl:max-w-[680px] drop-shadow-text"
        >
          A non-profit professional organization founded in 2019.
          Restoring Venezuela&apos;s Energy Leadership. Empowering
          Venezuela&apos;s Energy Future.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ ...slowTransition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 pointer-events-auto"
        >
          <Button href={MEMBERSHIP_URL} external variant="primary">
            Become a Member
          </Button>
          <Button href="/about/history" variant="secondary">Learn More</Button>
        </motion.div>
      </div>
    </section>
  );
}
