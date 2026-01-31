"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fadeInUp, defaultTransition, defaultViewport } from "@/components/utils/animations";
import { filterYears } from "../events";

export type PageSize = 10 | 20 | "All";
const pageSizes: PageSize[] = [10, 20, "All"];

interface FilterSectionProps {
  activeFilter: string;
  pageSize: PageSize;
  onFilterChange: (year: string) => void;
  onPageSizeChange: (value: string) => void;
}

export const FilterSection = forwardRef<HTMLDivElement, FilterSectionProps>(
  function FilterSection({ activeFilter, pageSize, onFilterChange, onPageSizeChange }, ref) {
    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={defaultTransition}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 md:mb-12 scroll-mt-24"
      >
        {/* Year Filter */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" />
          <div className="flex flex-wrap gap-2 md:gap-3">
            {filterYears.map((year) => (
              <button
                key={year}
                onClick={() => onFilterChange(year)}
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
            onValueChange={onPageSizeChange}
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
    );
  }
);
