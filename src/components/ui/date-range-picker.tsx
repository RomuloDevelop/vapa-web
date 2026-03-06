"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<DateRange | undefined>();

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setPending(value);
    setOpen(isOpen);
  };

  const handleAccept = () => {
    if (pending?.from && pending?.to) {
      onChange(pending);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setPending(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-start text-left font-normal bg-surface border-border-accent-light text-white hover:bg-accent-10 hover:text-white"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-foreground-subtle" />
          {value?.from ? (
            value.to ? (
              <span>
                {formatShortDate(value.from)} – {formatShortDate(value.to)}
              </span>
            ) : (
              formatShortDate(value.from)
            )
          ) : (
            <span className="text-foreground-faint">Date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-surface-section border-border-accent-light"
        align="start"
      >
        <Calendar
          mode="range"
          selected={pending}
          onSelect={setPending}
          defaultMonth={pending?.from || value?.from}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-2 px-5 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-foreground-muted hover:bg-accent-10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            disabled={!pending?.from || !pending?.to}
            className="bg-accent text-surface font-semibold hover:bg-accent-hover disabled:opacity-40"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
