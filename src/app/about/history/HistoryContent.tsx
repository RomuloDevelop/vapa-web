"use client";

import { MissionSection, TimelineSection, VisionSection } from "./organisms";

export function HistoryContent() {
  return (
    <section className="flex flex-col gap-16 md:gap-20 lg:gap-24 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-surface-elevated">
      <MissionSection />
      <TimelineSection />
      <VisionSection />
    </section>
  );
}
