"use client";

import { Check, Loader2 } from "lucide-react";

export interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

interface ImageResultsGridProps {
  images: UnsplashImage[];
  isSearching: boolean;
  hasSearched: boolean;
  error: boolean;
  onSelectImage: (image: UnsplashImage) => void;
  /** Id of the chosen image, shown with the gold selected indicator */
  selectedId?: string;
}

/**
 * Scrollable grid of image search results, with loading / error / empty states.
 * Columns follow the grid's own width (container query), not the screen:
 * 3 in a narrow panel like the admin popover, 4 when there is room (e.g. a chat panel).
 */
export function ImageResultsGrid({
  images,
  isSearching,
  hasSearched,
  error,
  onSelectImage,
  selectedId,
}: ImageResultsGridProps) {
  return (
    <div className="@container p-4 min-h-0 overflow-y-auto">
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <p className="text-xs text-foreground-faint">Searching images...</p>
        </div>
      )}

      {error && !isSearching && (
        <p className="text-sm text-destructive text-center py-4">Failed to load images. Please try again.</p>
      )}

      {!isSearching && !error && hasSearched && images.length === 0 && (
        <p className="text-sm text-foreground-subtle text-center py-4">No images found. Try a different search term.</p>
      )}

      {!isSearching && !error && !hasSearched && (
        <p className="text-sm text-foreground-subtle text-center py-4">Search for images to use as your event cover.</p>
      )}

      {!isSearching && images.length > 0 && (
        <>
          <div className="grid grid-cols-3 @3xl:grid-cols-4 gap-2">
            {images.map((image) => {
              const selected = image.id === selectedId;
              return (
              <button
                key={image.id}
                type="button"
                onClick={() => onSelectImage(image)}
                aria-pressed={selected}
                className={`group relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selected ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-accent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {selected && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-accent">
                    <Check className="w-4 h-4 text-surface" />
                  </span>
                )}
              </button>
              );
            })}
          </div>

          <p className="text-xs text-foreground-faint text-center mt-3">
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
  );
}
