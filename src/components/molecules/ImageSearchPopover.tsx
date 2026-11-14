"use client";

import { useState, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { Drawer } from "vaul";
import { Sparkles } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ImageSearchBar } from "./ImageSearchBar";
import { ImageResultsGrid, type UnsplashImage } from "./ImageResultsGrid";

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

  const content = (
    <>
      <ImageSearchBar
        prompt={prompt}
        onPromptChange={setPrompt}
        onSearch={() => handleSearch()}
        isSearching={isMutating}
        refinedQuery={refinedQuery}
      />
      <ImageResultsGrid
        images={images}
        isSearching={isMutating}
        hasSearched={hasSearched}
        error={!!error}
        onSelectImage={handleSelectImage}
      />
    </>
  );

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
            {content}
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
                {content}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}
