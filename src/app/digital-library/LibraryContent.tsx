"use client";

import { useState, useRef, useEffect } from "react";
import { getYear } from "./utils";
import { FilterSection, EventsList, type PageSize } from "./organisms";
import type { Event } from "@/lib/database.types";

interface LibraryContentProps {
  events: Event[];
  filterYears: string[];
}

export function LibraryContent({ events, filterYears }: LibraryContentProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const isFirstRender = useRef(true);
  const filterRef = useRef<HTMLDivElement>(null);

  // Filter events by year
  const filteredByYear =
    activeFilter === "All"
      ? events
      : events.filter((event) => getYear(event.date) === activeFilter);

  // Calculate pagination
  const totalPages = pageSize === "All" ? 1 : Math.ceil(filteredByYear.length / pageSize);

  // Get current page events
  const paginatedEvents =
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
    setPageSize(value === "All" ? "All" : (Number(value) as PageSize));
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
    <section className="flex flex-col items-center gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20 bg-surface-raised">
      {/* Container with max-width for desktop */}
      <div className="w-full lg:w-[60vw] lg:min-w-[600px] lg:max-w-[1000px]">
        <FilterSection
          ref={filterRef}
          activeFilter={activeFilter}
          pageSize={pageSize}
          filterYears={filterYears}
          onFilterChange={handleFilterChange}
          onPageSizeChange={handlePageSizeChange}
        />

        <EventsList
          events={paginatedEvents}
          totalCount={filteredByYear.length}
          activeFilter={activeFilter}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          shouldAnimate={shouldAnimate}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
