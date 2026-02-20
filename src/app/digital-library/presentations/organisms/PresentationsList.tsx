"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fadeInUp,
  defaultTransition,
  minimalViewport,
} from "@/components/utils/animations";
import { PresentationCard } from "./PresentationCard";
import type { Presentation } from "@/lib/database.types";

interface PresentationsListProps {
  presentations: Presentation[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  shouldAnimate: boolean;
  onPageChange: (page: number) => void;
}

export function PresentationsList({
  presentations,
  totalCount,
  currentPage,
  totalPages,
  shouldAnimate,
  onPageChange,
}: PresentationsListProps) {
  return (
    <>
      {/* Presentations List */}
      <motion.div
        variants={shouldAnimate ? fadeInUp : undefined}
        initial={shouldAnimate ? "hidden" : undefined}
        whileInView={shouldAnimate ? "visible" : undefined}
        viewport={shouldAnimate ? minimalViewport : undefined}
        transition={shouldAnimate ? defaultTransition : undefined}
        className="flex flex-col gap-6 md:gap-8"
      >
        {presentations.length > 0 ? (
          presentations.map((pres, index) => (
            <PresentationCard
              key={pres.id}
              presentation={pres}
              index={index}
              animate={shouldAnimate}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-base text-foreground-muted">
              No presentations available yet.
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Count */}
      {presentations.length > 0 && (
        <div className="flex justify-center mt-6">
          <span className="text-xs md:text-sm text-foreground-muted">
            Showing {presentations.length} of {totalCount} presentations
          </span>
        </div>
      )}
    </>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

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
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const sideCount = Math.floor((maxVisible - 3) / 2);

  pages.push(1);

  let start = Math.max(2, currentPage - sideCount);
  let end = Math.min(totalPages - 1, currentPage + sideCount);

  if (currentPage <= sideCount + 2) {
    end = Math.min(totalPages - 1, maxVisible - 2);
  }

  if (currentPage >= totalPages - sideCount - 1) {
    start = Math.max(2, totalPages - maxVisible + 3);
  }

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const desktopPages = getPageNumbers(currentPage, totalPages, 12);
  const mobilePages = getPageNumbers(currentPage, totalPages, 5);

  const renderPageButton = (page: number | "ellipsis", index: number) => {
    if (page === "ellipsis") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="w-10 h-10 flex items-center justify-center text-foreground-muted"
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
            ? "bg-accent text-surface"
            : "border border-border-interactive text-foreground-muted hover:border-accent hover:text-accent"
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
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded border border-border-interactive text-foreground-muted hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-interactive disabled:hover:text-foreground-muted transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="hidden md:flex items-center gap-2">
        {desktopPages.map((page, index) => renderPageButton(page, index))}
      </div>

      <div className="flex md:hidden items-center gap-1">
        {mobilePages.map((page, index) => renderPageButton(page, index))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-border-interactive text-foreground-muted hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-interactive disabled:hover:text-foreground-muted transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
