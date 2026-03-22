"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
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
import { DeletePresentationDialog } from "./DeletePresentationDialog";
import {
  deletePresentation,
  fetchFilteredPresentations,
  type PresentationsFilterParams,
  type FilteredPresentationsResult,
} from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import type { Presentation } from "@/lib/database.types";
import { parseLocalDate } from "@/lib/utils";

const PAGE_SIZE = 10;

function getFileExtension(filePath: string): string {
  return filePath.split(".").pop()?.toUpperCase() || "FILE";
}

function formatDate(dateString: string): string {
  return parseLocalDate(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface PresentationsTableProps {
  initialPresentations: Presentation[];
  initialTotalCount: number;
}

export function PresentationsTable({
  initialPresentations,
  initialTotalCount,
}: PresentationsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Presentation | null>(null);
  const [isPending, startTransition] = useTransition();

  const filterParams: PresentationsFilterParams = {
    search: search || undefined,
    page,
  };

  const isInitialState = !search && page === 1;

  const { data, mutate, isLoading } = useSWR<FilteredPresentationsResult>(
    ["admin-presentations", filterParams],
    () => unwrap(fetchFilteredPresentations(filterParams)),
    {
      fallbackData: isInitialState
        ? {
            presentations: initialPresentations,
            totalCount: initialTotalCount,
          }
        : undefined,
      keepPreviousData: true,
    }
  );

  const presentations = data?.presentations ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deletePresentation(deleteTarget.id);
      if (result.success) {
        toast.success("Presentation deleted");
        mutate();
      } else {
        toast.error(result.error.message);
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
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-faint" />
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search presentations..."
              className="pl-9 bg-surface border-border-accent-light text-white placeholder:text-foreground-faint focus-visible:border-accent focus-visible:ring-accent/20"
            />
          </div>
          {search && (
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="text-accent px-2"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Mobile Card List */}
        <div className="block lg:hidden relative">
          {isLoading && presentations.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {presentations.length === 0 && isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg border border-border-accent-light"
                >
                  <Skeleton className="w-10 h-10 rounded shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {presentations.length === 0 && !isLoading && (
            <div className="py-12 text-center text-foreground-subtle rounded-xl border border-border-accent-light">
              No presentations found.{" "}
              {search ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="text-accent hover:underline"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  href="/admin/presentations/new"
                  className="text-accent hover:underline"
                >
                  Add one
                </Link>
              )}
            </div>
          )}

          {presentations.length > 0 && (
            <div className="flex flex-col gap-3">
              {presentations.map((pres) => (
                <div
                  key={pres.id}
                  className="flex gap-3 p-3 rounded-lg border border-border-accent-light"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-surface-sunken shrink-0">
                    <Image
                      src={pres.img}
                      alt={pres.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-medium text-white line-clamp-2 break-words">
                      {pres.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs text-foreground-subtle">
                        {formatDate(pres.created_at)}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-accent-30 text-accent bg-accent-10 text-xs px-1.5 py-0"
                      >
                        {getFileExtension(pres.file_path)}
                      </Badge>
                    </div>
                    {pres.description && (
                      <p className="text-xs text-foreground-muted line-clamp-2 break-words">
                        {pres.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <Link
                      href={`/admin/presentations/${pres.id}/edit`}
                      className="p-1.5 rounded text-foreground-muted hover:text-accent hover:bg-accent-10 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(pres)}
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
          {isLoading && presentations.length > 0 && (
            <div className="absolute inset-0 bg-surface/60 z-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              <TableRow className="bg-surface-sunken border-b border-border-accent-light hover:bg-surface-sunken">
                <TableHead
                  style={{ width: "7%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Image
                </TableHead>
                <TableHead
                  style={{ width: "30%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Title
                </TableHead>
                <TableHead
                  style={{ width: "30%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Description
                </TableHead>
                <TableHead
                  style={{ width: "8%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  File
                </TableHead>
                <TableHead
                  style={{ width: "15%" }}
                  className="text-foreground-subtle font-medium py-3 px-4"
                >
                  Added
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="text-foreground-subtle font-medium py-3 px-4 text-right"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presentations.length === 0 && isLoading && (
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
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Skeleton className="h-4 w-24" />
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
              {presentations.length === 0 && !isLoading && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-foreground-subtle"
                  >
                    No presentations found.{" "}
                    {search ? (
                      <button
                        onClick={() => {
                          setSearch("");
                          setPage(1);
                        }}
                        className="text-accent hover:underline"
                      >
                        Clear search
                      </button>
                    ) : (
                      <Link
                        href="/admin/presentations/new"
                        className="text-accent hover:underline"
                      >
                        Add one
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              )}
              {presentations.map((pres) => (
                <TableRow
                  key={pres.id}
                  className="border-border-accent-light/50 hover:bg-accent-10 transition-colors"
                >
                  <TableCell className="py-3 px-4">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-surface-sunken">
                      <Image
                        src={pres.img}
                        alt={pres.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 overflow-hidden whitespace-normal">
                    <span className="text-white font-medium line-clamp-2 break-words">
                      {pres.title}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 overflow-hidden whitespace-normal">
                    {pres.description ? (
                      <span className="text-foreground-muted text-sm line-clamp-2 break-words">
                        {pres.description}
                      </span>
                    ) : (
                      <span className="text-foreground-faint text-sm">
                        &mdash;
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="border-accent-30 text-accent bg-accent-10"
                    >
                      {getFileExtension(pres.file_path)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground-muted whitespace-nowrap">
                    {formatDate(pres.created_at)}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/admin/presentations/${pres.id}/edit`}
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
                            onClick={() => setDeleteTarget(pres)}
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
              Showing {rangeStart}–{rangeEnd} of {totalCount} presentations
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
        <DeletePresentationDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          onConfirm={handleDelete}
          presentationTitle={deleteTarget?.title ?? ""}
          isPending={isPending}
        />
      </div>
    </TooltipProvider>
  );
}
