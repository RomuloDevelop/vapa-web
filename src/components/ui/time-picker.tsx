"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function to12Hour(h24: number): { hour: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
  const hour = h24 % 12 || 12;
  return { hour, period };
}

function to24Hour(hour: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function formatTime(value: string): string {
  if (!value) return "";
  const [hStr, mStr] = value.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return "";
  const { hour, period } = to12Hour(h);
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

function TimeColumns({
  parsed,
  updateTime,
}: {
  parsed: { hour: number; minute: number; period: "AM" | "PM" };
  updateTime: (hour: number, minute: number, period: "AM" | "PM") => void;
}) {
  const hoursRef = React.useRef<HTMLDivElement>(null);
  const minutesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      const scrollToSelected = (container: HTMLDivElement | null, selector: string) => {
        if (!container) return;
        const selected = container.querySelector(selector) as HTMLElement | null;
        if (selected) {
          selected.scrollIntoView({ block: "center", behavior: "instant" });
        }
      };
      scrollToSelected(hoursRef.current, "[data-selected=true]");
      scrollToSelected(minutesRef.current, "[data-selected=true]");
    }, 0);
    return () => clearTimeout(scrollTimeout);
  }, []);

  return (
    <div className="flex divide-x divide-border-accent-light">
      {/* Hours */}
      <div
        ref={hoursRef}
        className="flex flex-col h-56 overflow-y-auto py-1 px-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {HOURS.map((h) => (
          <button
            key={h}
            type="button"
            data-selected={parsed.hour === h}
            onClick={() => updateTime(h, parsed.minute, parsed.period)}
            className={cn(
              "px-3 py-1.5 text-sm rounded transition-colors min-w-[40px]",
              parsed.hour === h
                ? "bg-accent text-surface font-semibold"
                : "text-foreground-muted hover:bg-accent-20 hover:text-white"
            )}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Minutes */}
      <div
        ref={minutesRef}
        className="flex flex-col h-56 overflow-y-auto py-1 px-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            data-selected={parsed.minute === m}
            onClick={() => updateTime(parsed.hour, m, parsed.period)}
            className={cn(
              "px-3 py-1.5 text-sm rounded transition-colors min-w-[40px]",
              parsed.minute === m
                ? "bg-accent text-surface font-semibold"
                : "text-foreground-muted hover:bg-accent-20 hover:text-white"
            )}
          >
            {m.toString().padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* AM/PM */}
      <div className="flex flex-col justify-center gap-1 py-1 px-1">
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => updateTime(parsed.hour, parsed.minute, p)}
            className={cn(
              "px-3 py-1.5 text-sm rounded transition-colors font-medium",
              parsed.period === p
                ? "bg-accent text-surface font-semibold"
                : "text-foreground-muted hover:bg-accent-20 hover:text-white"
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
}: TimePickerProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const parsed = React.useMemo(() => {
    if (!value) return { hour: 12, minute: 0, period: "AM" as const };
    const [hStr, mStr] = value.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return { hour: 12, minute: 0, period: "AM" as const };
    const { hour, period } = to12Hour(h);
    return { hour, minute: m, period };
  }, [value]);

  const updateTime = (hour: number, minute: number, period: "AM" | "PM") => {
    const h24 = to24Hour(hour, period);
    onChange(`${h24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
  };

  const handleClear = () => {
    onChange("");
    setPopoverOpen(false);
    setDrawerOpen(false);
  };

  const triggerContent = (
    <>
      <Clock className="mr-2 h-4 w-4 text-foreground-subtle" />
      {value ? formatTime(value) : placeholder}
    </>
  );

  return (
    <>
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !value && "text-foreground-faint",
                className
              )}
            >
              {triggerContent}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-surface-section border-border-accent-light"
            align="start"
          >
            <TimeColumns parsed={parsed} updateTime={updateTime} />
            {value && (
              <div className="flex justify-end px-3 py-2 border-t border-border-accent-light">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleClear}
                  className="bg-accent text-surface font-semibold hover:bg-accent-hover"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="block md:hidden">
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !value && "text-foreground-faint",
                className
              )}
            >
              {triggerContent}
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                backgroundColor: "var(--color-overlay)",
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
                borderTop: "1px solid var(--color-border-gold)",
                backgroundColor: "var(--color-bg-dark)",
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  margin: "12px auto",
                  height: "6px",
                  width: "48px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--color-border-gold-strong)",
                  flexShrink: 0,
                }}
              />
              <div style={{ padding: "16px", paddingTop: "0", textAlign: "center" }}>
                <Drawer.Title
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-text-white)",
                  }}
                >
                  Select Time
                </Drawer.Title>
              </div>
              <div className="flex-1 flex items-center justify-center px-4">
                <TimeColumns parsed={parsed} updateTime={updateTime} />
              </div>
              {value && (
                <div className="flex justify-end px-4 pb-6 border-t border-border-accent-light pt-3">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleClear}
                    className="bg-accent text-surface font-semibold hover:bg-accent-hover"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear
                  </Button>
                </div>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}

export { TimePicker };
