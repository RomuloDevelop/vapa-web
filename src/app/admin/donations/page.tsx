import { Suspense } from "react";
import { getDonations, getDonationsCount } from "@/lib/services/donations";
import { DonationsTable } from "./DonationsTable";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function AdminDonationsPage() {
  const [donations, totalCount] = await Promise.all([
    getDonations({ limit: PAGE_SIZE, offset: 0 }),
    getDonationsCount(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Donations</h1>
          <p className="text-sm text-foreground-subtle mt-1">
            {totalCount} {totalCount === 1 ? "donation" : "donations"}
          </p>
        </div>
      </div>
      <Suspense>
        <DonationsTable
          initialDonations={donations}
          initialTotalCount={totalCount}
        />
      </Suspense>
    </div>
  );
}
