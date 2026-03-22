"use client";

import { useState, useRef, useEffect } from "react";
import { PresentationsList } from "./organisms";
import type { Presentation } from "@/lib/database.types";

const PAGE_SIZE = 10;

interface PresentationsContentProps {
  presentations: Presentation[];
}

export function PresentationsContent({
  presentations,
}: PresentationsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const isFirstRender = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(presentations.length / PAGE_SIZE);
  const paginatedPresentations = presentations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShouldAnimate(false);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={listRef}
      className="flex flex-col items-center gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20 bg-surface-section"
    >
      <div className="w-full lg:w-[60vw] lg:min-w-[600px] lg:max-w-[1000px]">
        <PresentationsList
          presentations={paginatedPresentations}
          totalCount={presentations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          shouldAnimate={shouldAnimate}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
