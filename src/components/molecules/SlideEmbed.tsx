"use client";

import { useRef } from "react";
import { Maximize2 } from "lucide-react";

interface SlideEmbedProps {
  embedUrl: string;
  title: string;
}

export function SlideEmbed({ embedUrl, title }: SlideEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as HTMLDivElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
      (el as HTMLDivElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden border border-border-accent-light bg-surface-sunken"
      >
        {/* Mobile: taller 3:4 ratio | Desktop: standard 16:9 */}
        <div className="relative w-full aspect-[3/4] md:aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
      <button
        onClick={handleFullScreen}
        className="flex items-center justify-center gap-2 self-end px-4 py-2 rounded border border-border-accent text-accent text-sm font-medium hover:bg-accent-10 transition-colors md:hidden"
      >
        <Maximize2 className="w-4 h-4" />
        Full Screen
      </button>
    </div>
  );
}
