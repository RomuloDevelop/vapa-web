"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, Play, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allEvents, filterYears, getImage, type LibraryEvent } from "./events";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Format date from ISO string to readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Get year from ISO date string
function getYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

// Get video URL (first link that looks like a video)
function getVideoUrl(links: string[]): string | undefined {
  return links.find(
    (link) =>
      link.includes("youtube.com") ||
      link.includes("youtu.be") ||
      (link !== "#" && link !== "#.")
  );
}

interface EventCardProps {
  event: LibraryEvent;
  index: number;
  animate: boolean;
}

function EventCard({ event, index, animate }: EventCardProps) {
  const videoUrl = getVideoUrl(event.links);
  const imageUrl = getImage(index);

  return (
    <motion.article
      variants={animate ? fadeIn : undefined}
      initial={animate ? "hidden" : undefined}
      whileInView={animate ? "visible" : undefined}
      viewport={animate ? { once: true, amount: 0.2 } : undefined}
      transition={animate ? { duration: 0.3 } : undefined}
      className="flex flex-col sm:flex-row bg-[var(--color-bg-dark)] rounded-xl overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-full sm:w-[200px] md:w-[240px] lg:w-[280px] h-[180px] sm:h-auto sm:min-h-[200px] flex-shrink-0">
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          className="object-cover"
        />
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

const pageSizes = [10, 20, "All"] as const;
type PageSize = (typeof pageSizes)[number];

export function LibraryContent() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const isFirstRender = useRef(true);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredByYear =
    activeFilter === "All"
      ? allEvents
      : allEvents.filter((event) => getYear(event.date) === activeFilter);

  const totalPages = pageSize === "All" ? 1 : Math.ceil(filteredByYear.length / pageSize);

  const filteredEvents =
    pageSize === "All"
      ? filteredByYear
      : filteredByYear.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Disable animation after first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  // Reset to page 1 when filter changes, enable animation
  const handleFilterChange = (year: string) => {
    setActiveFilter(year);
    setCurrentPage(1);
    setShouldAnimate(true);
  };

  // Reset to page 1 when page size changes, no animation
  const handlePageSizeChange = (value: string) => {
    setPageSize(value === "All" ? "All" : Number(value) as PageSize);
    setCurrentPage(1);
    setShouldAnimate(false);
  };

  // No animation when changing pages, scroll to filter
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShouldAnimate(false);
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="flex flex-col items-center gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20 bg-[#152D45]">
      {/* Container with max-width for desktop */}
      <div className="w-full lg:w-[60vw] lg:min-w-[600px] lg:max-w-[1000px]">
        {/* Filter Row */}
        <motion.div
          ref={filterRef}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 md:mb-12 scroll-mt-24"
        >
          {/* Year Filter */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" />
            <div className="flex flex-wrap gap-2 md:gap-3">
              {filterYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleFilterChange(year)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded transition-colors ${
                    activeFilter === year
                      ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-semibold"
                      : "text-[var(--color-text-secondary)] border border-[#D4A85340] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base font-medium text-white">
              Show
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[80px] border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--color-bg-dark)] border-[var(--color-primary)]">
                {pageSizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="text-white focus:bg-[var(--color-primary)] focus:text-[var(--color-bg-dark)]"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Events List */}
        <motion.div
          variants={shouldAnimate ? fadeInUp : undefined}
          initial={shouldAnimate ? "hidden" : undefined}
          whileInView={shouldAnimate ? "visible" : undefined}
          viewport={shouldAnimate ? { once: true, amount: 0.1 } : undefined}
          transition={shouldAnimate ? { duration: 0.5 } : undefined}
          className="flex flex-col gap-6 md:gap-8"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard key={`${event.date}-${index}`} event={event} index={index} animate={shouldAnimate} />
            ))
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-base text-[var(--color-text-muted)]">
                No events found for {activeFilter}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pageSize !== "All" && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D4A85340] disabled:hover:text-[var(--color-text-muted)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)]"
                    : "border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D4A85340] disabled:hover:text-[var(--color-text-muted)] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Event Count */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center mt-6">
            <span className="text-xs md:text-sm text-[var(--color-text-muted)]">
              Showing {filteredEvents.length} of {filteredByYear.length} events
              {activeFilter !== "All" && ` (${activeFilter})`}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
