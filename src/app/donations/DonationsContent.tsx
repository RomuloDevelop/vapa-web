"use client";

import {
  TaxBadge,
  DonationTiersSection,
  ImpactSection,
  PaymentMethodsSection,
} from "./organisms";

export function DonationsContent() {
  return (
    <>
      <TaxBadge />
      <DonationTiersSection />
      <ImpactSection />
      <PaymentMethodsSection />
    </>
  );
}
