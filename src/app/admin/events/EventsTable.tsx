"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { deleteEvent, fetchFilteredEvents, type EventsFilterParams, type FilteredEventsResult } from "@/lib/actions/events";
import type { DateRange } from "react-day-picker";
import { EVENT_TYPES, getEventTypeLabel, type Event, type EventType } from "@/lib/database.types";

const PAGE_SIZE = 10;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface EventsTableProps {
  initialEvents: Event[];
  initialTotalCount: number;
  availableYears: number[];
}

const VALID_TYPES = new Set<string>(EVENT_TYPES.map((t) => t.value));

export function EventsTable({
  initialEvents,
  initialTotalCount,
  availableYears,
}: EventsTableProps) {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") ?? "";
  const initialType = VALID_TYPES.has(urlType) ? (urlType as EventType) : "";

  const [year, setYear] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<EventType | "">(initialType);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [isPending, startTransition] = useTransition();

  const dateFrom = dateRange?.from
    ? dateRange.from.toISOString().split("T")[0]
    : undefined;
  const dateTo = dateRange?.to
    ? dateRange.to.toISOString().split("T")[0]
    : undefined;

  const filterParams: EventsFilterParams = {
    year: year ? Number(year) : undefined,
    type: typeFilter || undefined,
    dateFrom,
    dateTo,
    page,
  };

  const hasActiveFilters =
    year !== "" || typeFilter !== "" || dateRange?.from !== undefined;
  const isInitialState = !hasActiveFilters && page === 1;

  const { data, mutate, isLoading } = useSWR<FilteredEventsResult>(
    ["admin-events", filterParams],
    () => fetchFilteredEvents(filterParams),
    {
      fallbackData: isInitialState
        ? { events: initialEvents, totalCount: initialTotalCount }
        : undefined,
      keepPreviousData: true,
    }
  );

  const events = data?.events ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  const resetFilters = () => {
    setYear("");
    setTypeFilter("");
    setDateRange(undefined);
    setPendingRange(undefined);
    setPage(1);
  };

  const handlePopoverOpen = (open: boolean) => {
    if (open) {
      setPendingRange(dateRange);
    }
    setPopoverOpen(open);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setPendingRange(range);
  };

  const handleAcceptRange = () => {
    if (pendingRange?.from && pendingRange?.to) {
      setDateRange(pendingRange);
      setPage(1);
    }
    setPopoverOpen(false);
  };

  const handleCancelRange = () => {
    setPendingRange(dateRange);
    setPopoverOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    startTransition(async () => {
      const result = await deleteEvent(id);
      if (result.success) {
        toast.success("Event deleted");
        mutate();
      } else {
        toast.error(result.error || "Failed to delete event");
      }
      setDeleteTarget(null);
    });
  };

  const pageNumbers = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  })();

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year */}
          <Select
            value={year}
            onValueChange={(v) => {
              setYear(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-surface border-border-accent-light text-white">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent className="bg-surface-section border-border-accent-light">
              <SelectItem value="all" className="text-foreground-muted">
                All Years
              </SelectItem>
              {availableYears.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-white">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type */}
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v === "all" ? "" : v as EventType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-surface border-border-accent-light text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-surface-section border-border-accent-light">
              <SelectItem value="all" className="text-foreground-muted">
                All Types
              </SelectItem>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-white">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover open={popoverOpen} onOpenChange={handlePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[220px] justify-start text-left font-normal bg-surface border-border-accent-light text-white hover:bg-accent-10 hover:text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-foreground-subtle" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span>
                      {formatShortDate(dateRange.from)} –{" "}
                      {formatShortDate(dateRange.to)}
                    </span>
                  ) : (
                    formatShortDate(dateRange.from)
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
                selected={pendingRange}
                onSelect={handleCalendarSelect}
                defaultMonth={pendingRange?.from || dateRange?.from}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-end gap-2 px-5 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelRange}
                  className="text-foreground-muted hover:bg-accent-10 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptRange}
                  disabled={!pendingRange?.from || !pendingRange?.to}
                  className="bg-accent text-surface font-semibold hover:bg-accent-hover disabled:opacity-40"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Reset all */}
          {hasActiveFilters && (
            <Button
              variant="link"
              onClick={resetFilters}
              className="text-accent px-2"
            >
              Reset filters
            </Button>
          )}
        </div>

        {/* Mobile Card List */}
        <div className="block lg:hidden relative">
          {isLoading && events.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {events.length === 0 && isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-border-accent-light">
                  <Skeleton className="w-10 h-10 rounded shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {events.length === 0 && !isLoading && (
            <div className="py-12 text-center text-foreground-subtle rounded-xl border border-border-accent-light">
              No events found.{" "}
              {hasActiveFilters ? (
                <button onClick={resetFilters} className="text-accent hover:underline">
                  Clear filters
                </button>
              ) : (
                <Link href="/admin/events/new" className="text-accent hover:underline">
                  Create one
                </Link>
              )}
            </div>
          )}

          {events.length > 0 && (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 p-3 rounded-lg border border-border-accent-light"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-surface-sunken shrink-0">
                    <Image src={event.img} alt={event.name} fill className="object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-medium text-white line-clamp-2 break-words">
                      {event.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs text-foreground-subtle">{formatDate(event.date)}</span>
                      <Badge variant="outline" className="border-accent-30 text-accent bg-accent-10 text-[10px] px-1.5 py-0">
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-foreground-muted line-clamp-2 break-words">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="p-1.5 rounded text-foreground-muted hover:text-accent hover:bg-accent-10 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(event)}
                      disabled={isPending}
                      className="p-1.5 rounded text-foreground-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block relative rounded-xl border border-border-accent-light overflow-x-auto">
          {isLoading && events.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              <TableRow className="bg-surface-sunken border-b border-border-accent-light hover:bg-surface-sunken">
                <TableHead style={{ width: "7%" }} className="text-foreground-subtle font-medium py-3 px-4">
                  Image
                </TableHead>
                <TableHead style={{ width: "30%" }} className="text-foreground-subtle font-medium py-3 px-4">
                  Name
                </TableHead>
                <TableHead style={{ width: "27%" }} className="text-foreground-subtle font-medium py-3 px-4">
                  Description
                </TableHead>
                <TableHead style={{ width: "14%" }} className="text-foreground-subtle font-medium py-3 px-4">
                  Date
                </TableHead>
                <TableHead style={{ width: "12%" }} className="text-foreground-subtle font-medium py-3 px-4">
                  Type
                </TableHead>
                <TableHead style={{ width: "10%" }} className="text-foreground-subtle font-medium py-3 px-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 && isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="border-border-accent-light/50 hover:bg-transparent"
                    >
                      <TableCell className="py-3 px-4">
                        <Skeleton className="w-12 h-12 rounded" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {events.length === 0 && !isLoading && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-foreground-subtle"
                  >
                    No events found.{" "}
                    {hasActiveFilters ? (
                      <button
                        onClick={resetFilters}
                        className="text-accent hover:underline"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link
                        href="/admin/events/new"
                        className="text-accent hover:underline"
                      >
                        Create one
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              )}
              {events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-border-accent-light/50 hover:bg-accent-10 transition-colors"
                >
                  <TableCell className="py-3 px-4">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-surface-sunken">
                      <Image
                        src={event.img}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 overflow-hidden whitespace-normal">
                    <span className="text-white font-medium line-clamp-2 break-words">
                      {event.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 overflow-hidden whitespace-normal">
                    {event.description ? (
                      <span className="text-foreground-muted text-sm line-clamp-2 break-words">
                        {event.description}
                      </span>
                    ) : (
                      <span className="text-foreground-faint text-sm">&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground-muted whitespace-nowrap">
                    {formatDate(event.date)}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="border-accent-30 text-accent bg-accent-10"
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="p-2 rounded text-foreground-muted hover:text-accent hover:bg-accent-10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            disabled={isPending}
                            className="p-2 rounded text-foreground-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-subtle">
              Showing {rangeStart}–{rangeEnd} of {totalCount} events
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-foreground-muted hover:text-white hover:bg-accent-10 disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-foreground-subtle text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setPage(p)}
                    className={
                      page === p
                        ? "bg-accent text-surface hover:bg-accent-hover"
                        : "text-foreground-muted hover:text-white hover:bg-accent-10"
                    }
                  >
                    {p}
                  </Button>
                )
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="text-foreground-muted hover:text-white hover:bg-accent-10 disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <DeleteEventDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          onConfirm={handleDelete}
          eventName={deleteTarget?.name ?? ""}
          isPending={isPending}
        />
      </div>
    </TooltipProvider>
  );
}
