"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

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

  // Image: fade in and stay
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

  // Text: fade in staggered and stay
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
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8">
      {/* Image — always on the left */}
      <motion.div
        style={{ opacity: imageOpacity, y: imageY }}
        className="relative w-full md:w-[220px] lg:w-[280px] h-[140px] md:h-[120px] lg:h-[140px] rounded-lg overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Text Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="flex flex-col gap-2 md:gap-3 flex-1"
      >
        <div className="flex items-center gap-3">
          <NumberBadge number={item.number} />
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
            {item.title}
          </h3>
        </div>
        <p className="text-xs md:text-sm lg:text-base text-foreground-muted leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}

export function VisionSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${(visionItems.length + 1) * SCROLL_VH_PER_ITEM}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{
          background: "linear-gradient(180deg, #0A1628 0%, #1A3352 100%)",
        }}
      >
        <div className="w-full px-5 md:px-10 lg:px-20 xl:px-[5%] 2xl:px-[8%]">
          <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
              Our Objectives
            </h2>
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
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
