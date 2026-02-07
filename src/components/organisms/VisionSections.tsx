"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import {
  fadeInUp,
  smallViewport,
  slowTransition,
  staggerDelay,
} from "../utils/animations";

// === SCROLL TIMING — tweak these to tune the feel ===
const SCROLL_VH_PER_ITEM = 80; // vh of scroll height per item reveal
const FADE_DURATION = 0.35; // fraction of item segment for fade-in
const TEXT_STAGGER = 0.55; // text starts this fraction after image
const SLIDE_PX = 30; // items slide up this many px when appearing

interface VisionItem {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const visionItems: VisionItem[] = [
  {
    number: 1,
    title: "Envision the Future",
    description:
      "Develop and share strategic scenarios for the rehabilitation of Venezuela's energy sector through collaborative planning and foresight initiatives",
    imageSrc:
      "https://images.unsplash.com/photo-1678984239456-a63d28c947ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA0NzIwNDZ8&ixlib=rb-4.1.0&q=80&w=1080",
    imageAlt: "Energy sector planning",
  },
  {
    number: 2,
    title: "Empower Talent",
    description:
      "Connect experts and young professionals through mentorship, training, and knowledge-sharing to build the skills needed for tomorrow's energy landscape",
    imageSrc:
      "https://images.unsplash.com/photo-1596496357130-e24a50408378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA0NzIwNTV8&ixlib=rb-4.1.0&q=80&w=1080",
    imageAlt: "Professional mentorship and training",
  },
  {
    number: 3,
    title: "Innovate with Purpose",
    description:
      "Promote ideas and integrate technology, economics, and environmental sustainability to address Venezuela's unique challenges",
    imageSrc:
      "https://images.unsplash.com/photo-1759536588260-e708d399a2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA0NzIxMDN8&ixlib=rb-4.1.0&q=80&w=1080",
    imageAlt: "Innovation in energy technology",
  },
  {
    number: 4,
    title: "Build Global Bridges",
    description:
      "Facilitate international alliances for technology transfer, investment, and best practices exchange among energy professionals",
    imageSrc:
      "https://images.unsplash.com/photo-1665072204431-b3ba11bd6d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA0NzIxMDR8&ixlib=rb-4.1.0&q=80&w=1080",
    imageAlt: "Global professional collaboration",
  },
  {
    number: 5,
    title: "Preserve and Evolve the Legacy",
    description:
      "Protect Venezuela's oil & gas heritage while opening pathways to new energies and innovative business models that ensure long-term prosperity",
    imageSrc:
      "https://images.unsplash.com/photo-1700325332000-e6f5dae044f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA0NzIxMjh8&ixlib=rb-4.1.0&q=80&w=1080",
    imageAlt: "Energy industry heritage",
  },
];

// Compute fade-in keyframes for accumulation (items fade in and STAY)
// +1 segment: hold after last item so all stay visible before scrolling away
function getAccumulateTimeline(index: number, total: number) {
  const seg = 1 / (total + 1);
  const base = index * seg; // starts immediately when section reaches top
  const fade = FADE_DURATION * seg;
  const stagger = TEXT_STAGGER * seg;

  return {
    // Image fades in first
    imgFadeInStart: base,
    imgFadeInEnd: base + fade,
    // Text fades in after image (staggered)
    txtFadeInStart: base + stagger,
    txtFadeInEnd: base + fade + stagger,
  };
}

function NumberBadge({ number }: { number: number }) {
  const isGradient = number % 2 === 1;

  if (isGradient) {
    return (
      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-accent flex-shrink-0">
        <span className="text-sm md:text-lg font-bold text-surface">
          {number}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent bg-accent-30 flex-shrink-0">
      <span className="text-sm md:text-lg font-bold text-accent">
        {number}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Desktop: scroll-driven sticky animation (lg+)
   ────────────────────────────────────────────── */

function VisionRow({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: VisionItem;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const timeline = getAccumulateTimeline(index, total);

  const imageOpacity = useTransform(
    scrollYProgress,
    [timeline.imgFadeInStart, timeline.imgFadeInEnd],
    [0, 1]
  );

  const imageY = useTransform(
    scrollYProgress,
    [timeline.imgFadeInStart, timeline.imgFadeInEnd],
    [SLIDE_PX, 0]
  );

  const textOpacity = useTransform(
    scrollYProgress,
    [timeline.txtFadeInStart, timeline.txtFadeInEnd],
    [0, 1]
  );

  const textY = useTransform(
    scrollYProgress,
    [timeline.txtFadeInStart, timeline.txtFadeInEnd],
    [SLIDE_PX, 0]
  );

  return (
    <div className="flex flex-row items-center gap-6 lg:gap-8">
      <motion.div
        style={{ opacity: imageOpacity, y: imageY }}
        className="relative w-[220px] lg:w-[280px] h-[120px] lg:h-[140px] rounded-lg overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="flex flex-col gap-3 flex-1"
      >
        <div className="flex items-center gap-3">
          <NumberBadge number={item.number} />
          <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
            {item.title}
          </h3>
        </div>
        <p className="text-sm lg:text-base text-foreground-muted leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Mobile: simple stacked list with whileInView
   ────────────────────────────────────────────── */

function MobileVisionRow({
  item,
  index,
}: {
  item: VisionItem;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={smallViewport}
      transition={staggerDelay(index)}
      className="flex flex-row items-start gap-4"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <NumberBadge number={item.number} />
          <h3 className="text-base md:text-lg font-bold text-white leading-tight">
            {item.title}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-foreground-muted leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Desktop wrapper (isolates useScroll hooks)
   ────────────────────────────────────────────── */

function DesktopVisionSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="hidden lg:block"
      style={{ height: `${(visionItems.length + 1) * SCROLL_VH_PER_ITEM}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{
          background: "linear-gradient(180deg, #0A1628 0%, #1A3352 100%)",
        }}
      >
        <div className="w-full px-20 xl:px-[5%] 2xl:px-[8%]">
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center">
              Our Objectives
            </h2>
            <div className="flex flex-col gap-6">
              {visionItems.map((item, index) => (
                <VisionRow
                  key={item.number}
                  item={item}
                  index={index}
                  total={visionItems.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Exported component
   ────────────────────────────────────────────── */

const LG_BREAKPOINT = 1024;

export function VisionSections() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (isDesktop) {
    return <DesktopVisionSections />;
  }

  return (
    <section
      className="px-5 md:px-10 py-16 md:py-20"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #1A3352 100%)",
      }}
    >
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={smallViewport}
          transition={slowTransition}
          className="text-2xl md:text-3xl font-bold text-white text-center"
        >
          Our Objectives
        </motion.h2>
        <div className="flex flex-col gap-6">
          {visionItems.map((item, index) => (
            <MobileVisionRow key={item.number} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
