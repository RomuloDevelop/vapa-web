"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  X,
  Mail,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  fetchFilteredDonations,
  type DonationsFilterParams,
  type FilteredDonationsResult,
} from "@/lib/actions/donations";
import { unwrap } from "@/lib/actions/action-result";
import type { Donation } from "@/lib/database.types";
import { parseLocalDate } from "@/lib/utils";
import type { DateRange } from "react-day-picker";


const PAGE_SIZE = 10;

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

interface DonationsTableProps {
  initialDonations: Donation[];
  initialTotalCount: number;
}

export function DonationsTable({
  initialDonations,
  initialTotalCount,
}: DonationsTableProps) {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email") ?? "";

  const [searchInput, setSearchInput] = useState(urlEmail);
  const [search, setSearch] = useState(urlEmail);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);

  const dateFrom = dateRange?.from
    ? `${dateRange.from.toISOString().split("T")[0]}T00:00:00`
    : undefined;
  const dateTo = dateRange?.to
    ? `${dateRange.to.toISOString().split("T")[0]}T23:59:59`
    : undefined;

  const filterParams: DonationsFilterParams = {
    search: search || undefined,
    dateFrom,
    dateTo,
    page,
  };

  const hasActiveFilters =
    search !== "" || dateRange?.from !== undefined;
  const isInitialState = !hasActiveFilters && page === 1;

  const { data, isLoading } = useSWR<FilteredDonationsResult>(
    ["admin-donations", filterParams],
    () => unwrap(fetchFilteredDonations(filterParams)),
    {
      fallbackData: isInitialState
        ? { donations: initialDonations, totalCount: initialTotalCount }
        : undefined,
      keepPreviousData: true,
    }
  );

  const donations = data?.donations ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setDateRange(undefined);
    setPage(1);
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
          <DateRangePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setPage(1);
            }}
          />

          {/* Search */}
          <div className="relative">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search name or email..."
              className="w-[240px] bg-surface border-border-accent-light text-white placeholder:text-foreground-faint pr-8"
            />
            {searchInput ? (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-faint pointer-events-none" />
            )}
          </div>

          <Button
            onClick={handleSearch}
            size="sm"
            className="bg-accent text-surface font-semibold hover:bg-accent-hover"
          >
            Search
          </Button>

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
          {isLoading && donations.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {donations.length === 0 && isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-4 rounded-lg border border-border-accent-light"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {donations.length === 0 && !isLoading && (
            <div className="py-12 text-center text-foreground-subtle rounded-xl border border-border-accent-light">
              No donations found.{" "}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {donations.length > 0 && (
            <div className="flex flex-col gap-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 rounded-lg border border-border-accent-light bg-surface-section"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {donation.donor_name}
                      </p>
                      <p className="text-xs text-foreground-muted truncate mt-0.5">
                        {donation.donor_email}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-accent">
                      {formatAmount(donation.amount_cents, donation.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-accent-light/30">
                    <span className="text-xs text-foreground-subtle">
                      {formatDate(donation.donation_date)}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        donation.receipt_email_sent
                          ? "border-green-500/30 text-green-400 bg-green-500/10 text-xs"
                          : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10 text-xs"
                      }
                    >
                      {donation.receipt_email_sent ? (
                        <MailCheck className="w-3 h-3 mr-1" />
                      ) : (
                        <Mail className="w-3 h-3 mr-1" />
                      )}
                      {donation.receipt_email_sent ? "Sent" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block relative rounded-xl border border-border-accent-light overflow-x-auto">
          {isLoading && donations.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              <TableRow className="bg-surface-sunken border-b border-border-accent-light hover:bg-surface-sunken">
                <TableHead
                  style={{ width: "22%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Donor
                </TableHead>
                <TableHead
                  style={{ width: "25%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Email
                </TableHead>
                <TableHead
                  style={{ width: "13%" }}
                  className="text-foreground-subtle font-medium py-3 px-4 text-right"
                >
                  Amount
                </TableHead>
                <TableHead
                  style={{ width: "15%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Date
                </TableHead>
                <TableHead
                  style={{ width: "13%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Receipt
                </TableHead>
                <TableHead
                  style={{ width: "12%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Country
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 && isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="border-border-accent-light/50 hover:bg-transparent"
                    >
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {donations.length === 0 && !isLoading && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-foreground-subtle"
                  >
                    No donations found.{" "}
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-accent hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              )}
              {donations.map((donation) => (
                <TableRow
                  key={donation.id}
                  className="border-border-accent-light/50 hover:bg-accent-10 transition-colors"
                >
                  <TableCell className="py-3 px-4">
                    <span className="text-white font-medium truncate block">
                      {donation.donor_name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span className="text-foreground-muted text-sm truncate block">
                      {donation.donor_email}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    <span className="text-accent font-semibold">
                      {formatAmount(donation.amount_cents, donation.currency)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground-muted whitespace-nowrap">
                    {formatDate(donation.donation_date)}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Badge
                            variant="outline"
                            className={
                              donation.receipt_email_sent
                                ? "border-green-500/30 text-green-400 bg-green-500/10"
                                : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                            }
                          >
                            {donation.receipt_email_sent ? (
                              <MailCheck className="w-3 h-3 mr-1" />
                            ) : (
                              <Mail className="w-3 h-3 mr-1" />
                            )}
                            {donation.receipt_email_sent ? "Sent" : "Pending"}
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {donation.receipt_email_sent
                          ? "Receipt email sent"
                          : "Receipt email not sent"}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground-muted text-sm">
                    {donation.billing_country || "—"}
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
              Showing {rangeStart}–{rangeEnd} of {totalCount} donations
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
      </div>
    </TooltipProvider>
  );
}
