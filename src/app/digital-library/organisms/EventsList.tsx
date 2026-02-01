"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeInUp, defaultTransition, minimalViewport } from "@/components/utils/animations";
import { EventCard } from "./EventCard";
import type { Event } from "@/lib/database.types";
import type { PageSize } from "./FilterSection";

interface EventsListProps {
  events: Event[];
  totalCount: number;
  activeFilter: string;
  pageSize: PageSize;
  currentPage: number;
  totalPages: number;
  shouldAnimate: boolean;
  onPageChange: (page: number) => void;
}

export function EventsList({
  events,
  totalCount,
  activeFilter,
  pageSize,
  currentPage,
  totalPages,
  shouldAnimate,
  onPageChange,
}: EventsListProps) {
  return (
    <>
      {/* Events List */}
      <motion.div
        variants={shouldAnimate ? fadeInUp : undefined}
        initial={shouldAnimate ? "hidden" : undefined}
        whileInView={shouldAnimate ? "visible" : undefined}
        viewport={shouldAnimate ? minimalViewport : undefined}
        transition={shouldAnimate ? defaultTransition : undefined}
        className="flex flex-col gap-6 md:gap-8"
      >
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              animate={shouldAnimate}
            />
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Event Count */}
      {events.length > 0 && (
        <div className="flex justify-center mt-6">
          <span className="text-xs md:text-sm text-[var(--color-text-muted)]">
            Showing {events.length} of {totalCount} events
            {activeFilter !== "All" && ` (${activeFilter})`}
          </span>
        </div>
      )}
    </>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D4A85340] disabled:hover:text-[var(--color-text-muted)] transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)]"
              : "border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D4A85340] disabled:hover:text-[var(--color-text-muted)] transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
