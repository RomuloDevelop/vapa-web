"use client";

import { useState, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { Drawer } from "vaul";
import { Sparkles, Search, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

interface SearchResult {
  results: UnsplashImage[];
  query: string;
}

interface SearchArg {
  prompt: string;
  eventName?: string;
}

interface ImageSearchPopoverProps {
  onSelectImage: (url: string) => void;
  defaultPrompt?: string;
  eventName?: string;
}

async function searchImages(
  _key: string,
  { arg }: { arg: SearchArg }
): Promise<SearchResult> {
  const params = new URLSearchParams({ query: arg.prompt.trim() });
  if (arg.eventName) params.set("eventName", arg.eventName);

  const res = await fetch(`/api/images/search?${params}`);
  if (!res.ok) throw new Error("Failed to search images");
  return res.json();
}

function ImageSearchContent({
  prompt,
  setPrompt,
  handleSearch,
  handleKeyDown,
  isMutating,
  images,
  refinedQuery,
  hasSearched,
  error,
  handleSelectImage,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  handleSearch: (searchPrompt?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isMutating: boolean;
  images: UnsplashImage[];
  refinedQuery: string | null;
  hasSearched: boolean;
  error: boolean;
  handleSelectImage: (image: UnsplashImage) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="shrink-0 flex flex-col gap-3 px-4 pt-4 pb-4 border-b border-border-accent-light">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          AI Image Search
        </h3>
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you need..."
            className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border-accent-light text-white text-sm placeholder:text-foreground-faint focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={isMutating || !prompt.trim()}
            className="px-3 py-2 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isMutating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
        {refinedQuery && (
          <p className="text-[11px] text-foreground-faint -mt-1">
            AI refined:{" "}
            <span className="text-foreground-subtle italic">
              &quot;{refinedQuery}&quot;
            </span>
          </p>
        )}
      </div>

      {/* Results area */}
      <div className="p-4 min-h-0 overflow-y-auto">
        {isMutating && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <p className="text-xs text-foreground-faint">
              Searching images...
            </p>
          </div>
        )}

        {error && !isMutating && (
          <p className="text-sm text-destructive text-center py-4">
            Failed to load images. Please try again.
          </p>
        )}

        {!isMutating && !error && hasSearched && images.length === 0 && (
          <p className="text-sm text-foreground-subtle text-center py-4">
            No images found. Try a different search term.
          </p>
        )}

        {!isMutating && !error && !hasSearched && (
          <p className="text-sm text-foreground-subtle text-center py-4">
            Search for images to use as your event cover.
          </p>
        )}

        {!isMutating && images.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => handleSelectImage(image)}
                  className="group relative aspect-[16/10] rounded-lg overflow-hidden border border-transparent hover:border-accent transition-all cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.thumb}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-foreground-faint text-center mt-3">
              Photos from{" "}
              <a
                href="https://unsplash.com/?utm_source=vapa_admin&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground-subtle"
              >
                Unsplash
              </a>
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function ImageSearchPopover({
  onSelectImage,
  defaultPrompt = "oil energy industry",
  eventName,
}: ImageSearchPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const hasAutoSearched = useRef(false);

  const { trigger, data, error, isMutating } = useSWRMutation(
    "image-search",
    searchImages
  );

  const images = data?.results ?? [];
  const refinedQuery =
    data?.query && data.query !== prompt.trim() ? data.query : null;
  const hasSearched = !!data || !!error;

  const handleSearch = (searchPrompt?: string) => {
    const q = searchPrompt ?? prompt;
    if (!q.trim()) return;
    trigger({ prompt: q, eventName });
  };

  const open = popoverOpen || drawerOpen;

  useEffect(() => {
    if (open && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      handleSearch(defaultPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSelectImage = (image: UnsplashImage) => {
    onSelectImage(image.url);
    setPopoverOpen(false);
    setDrawerOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const triggerButton = (
    <button
      type="button"
      className="shrink-0 p-3 rounded-lg bg-surface border border-border-accent-light text-foreground-subtle hover:text-accent hover:border-accent transition-colors"
      title="Search stock images with AI"
      aria-label="Search stock images with AI"
    >
      <Sparkles className="w-4 h-4" />
    </button>
  );

  const contentProps = {
    prompt,
    setPrompt,
    handleSearch,
    handleKeyDown,
    isMutating,
    images,
    refinedQuery,
    hasSearched,
    error: !!error,
    handleSelectImage,
  };

  return (
    <>
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            collisionPadding={16}
            className="w-[420px] max-w-[calc(100vw-32px)] p-0 bg-surface-section border border-border-accent-light rounded-xl shadow-popover flex flex-col overflow-hidden"
            style={{
              maxHeight:
                "var(--radix-popover-content-available-height, 500px)",
            }}
          >
            <ImageSearchContent {...contentProps} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="block md:hidden">
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>{triggerButton}</Drawer.Trigger>
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
                height: "85vh",
                maxHeight: "85vh",
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
              <Drawer.Title className="sr-only">AI Image Search</Drawer.Title>
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ImageSearchContent {...contentProps} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}
