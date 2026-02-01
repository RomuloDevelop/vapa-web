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

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): (number | "ellipsis")[] {
  // If total pages fits within max, show all
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const sideCount = Math.floor((maxVisible - 3) / 2); // Pages on each side of current (minus first, last, current)

  // Always show first page
  pages.push(1);

  // Calculate start and end of middle section
  let start = Math.max(2, currentPage - sideCount);
  let end = Math.min(totalPages - 1, currentPage + sideCount);

  // Adjust if we're near the beginning
  if (currentPage <= sideCount + 2) {
    end = Math.min(totalPages - 1, maxVisible - 2);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - sideCount - 1) {
    start = Math.max(2, totalPages - maxVisible + 3);
  }

  // Add ellipsis after first if there's a gap
  if (start > 2) {
    pages.push("ellipsis");
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last if there's a gap
  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Get page numbers for desktop (max 12) and mobile (max 5)
  const desktopPages = getPageNumbers(currentPage, totalPages, 12);
  const mobilePages = getPageNumbers(currentPage, totalPages, 5);

  const renderPageButton = (page: number | "ellipsis", index: number) => {
    if (page === "ellipsis") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)]"
        >
          •••
        </span>
      );
    }

    return (
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
    );
  };

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mt-10">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded border border-[#D4A85340] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D4A85340] disabled:hover:text-[var(--color-text-muted)] transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Desktop Pages */}
      <div className="hidden md:flex items-center gap-2">
        {desktopPages.map((page, index) => renderPageButton(page, index))}
      </div>

      {/* Mobile Pages */}
      <div className="flex md:hidden items-center gap-1">
        {mobilePages.map((page, index) => renderPageButton(page, index))}
      </div>

      {/* Next Button */}
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
