"use client";

import {
  TaxBadge,
  DonationTiersSection,
  ImpactSection,
} from "./organisms";

export function DonationsContent() {
  return (
    <>
      <TaxBadge />
      <DonationTiersSection />
      <ImpactSection />
    </>
  );
}
