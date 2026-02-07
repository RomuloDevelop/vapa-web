"use client";

interface SlideEmbedProps {
  embedUrl: string;
  title: string;
}

export function SlideEmbed({ embedUrl, title }: SlideEmbedProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-border-accent-light bg-surface-sunken">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
