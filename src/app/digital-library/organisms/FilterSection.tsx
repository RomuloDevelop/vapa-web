"use client";

import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { Drawer } from "vaul";
import { MobileSelect, type SelectOption } from "@/components/molecules";
import { fadeInUp, defaultTransition, defaultViewport } from "@/components/utils/animations";

export type PageSize = 10 | 20 | "All";
const pageSizes: PageSize[] = [10, 20, "All"];
const pageSizeOptions: SelectOption[] = pageSizes.map((size) => ({
  value: String(size),
  label: String(size),
}));

interface FilterSectionProps {
  activeFilter: string;
  pageSize: PageSize;
  filterYears: string[];
  onFilterChange: (year: string) => void;
  onPageSizeChange: (value: string) => void;
}

export const FilterSection = forwardRef<HTMLDivElement, FilterSectionProps>(
  function FilterSection(
    { activeFilter, pageSize, filterYears, onFilterChange, onPageSizeChange },
    ref
  ) {
    const [yearDrawerOpen, setYearDrawerOpen] = useState(false);

    const handleYearSelect = (year: string) => {
      onFilterChange(year);
      setYearDrawerOpen(false);
    };

    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        transition={defaultTransition}
        className="flex flex-row sm:items-center justify-between gap-4 mb-10 md:mb-12 scroll-mt-24"
      >
        {/* Year Filter */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-accent" />

          {/* Mobile: Bottom Sheet */}
          <div className="block md:hidden">
            <Drawer.Root open={yearDrawerOpen} onOpenChange={setYearDrawerOpen}>
              <Drawer.Trigger asChild>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #D4A853",
                    backgroundColor: "transparent",
                    color: "#D4A853",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <span>{activeFilter}</span>
                  <ChevronDown style={{ width: "16px", height: "16px", opacity: 0.5 }} />
                </button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 50,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  }}
                />
                <Drawer.Content
                  style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "50vh",
                    maxHeight: "50vh",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    borderTopLeftRadius: "1rem",
                    borderTopRightRadius: "1rem",
                    borderTop: "1px solid rgba(212, 168, 83, 0.25)",
                    backgroundColor: "#0A1628",
                  }}
                >
                  {/* Drag handle */}
                  <div
                    style={{
                      margin: "12px auto",
                      height: "6px",
                      width: "48px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(212, 168, 83, 0.5)",
                      flexShrink: 0,
                    }}
                  />
                  {/* Title */}
                  <div style={{ padding: "16px", paddingTop: "0", textAlign: "center" }}>
                    <Drawer.Title
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      Filter by Year
                    </Drawer.Title>
                  </div>
                  {/* Year Options */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      padding: "0 16px 32px 16px",
                      overflowY: "auto",
                      flex: 1,
                    }}
                  >
                    {filterYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "16px",
                          borderRadius: "8px",
                          textAlign: "left",
                          fontSize: "16px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor:
                            activeFilter === year ? "#D4A853" : "transparent",
                          color: activeFilter === year ? "#0A1628" : "white",
                          fontWeight: activeFilter === year ? 600 : 400,
                        }}
                      >
                        <span>{year}</span>
                        {activeFilter === year && (
                          <Check style={{ width: "20px", height: "20px" }} />
                        )}
                      </button>
                    ))}
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>

          {/* Desktop: Button Group */}
          <div className="hidden md:flex flex-wrap gap-2 md:gap-3">
            {filterYears.map((year) => (
              <button
                key={year}
                onClick={() => onFilterChange(year)}
                className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded transition-colors ${
                  activeFilter === year
                    ? "bg-accent text-surface font-semibold"
                    : "text-foreground-subtle border border-border-accent hover:border-accent hover:text-accent"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm md:text-base font-medium text-white">Show</span>
          <MobileSelect
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            placeholder="10"
            title="Show items"
            triggerClassName="w-[80px]"
          />
        </div>
      </motion.div>
    );
  }
);
