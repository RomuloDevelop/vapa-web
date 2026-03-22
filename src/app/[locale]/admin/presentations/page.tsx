import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchPresentationsWithCount } from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import { Button } from "@/components/ui/button";
import { PresentationsTable } from "./PresentationsTable";

export const dynamic = "force-dynamic";

export default async function AdminPresentationsPage() {
  const { presentations, totalCount } = await unwrap(
    fetchPresentationsWithCount()
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Presentations</h1>
        <Button
          asChild
          className="bg-accent text-surface font-semibold hover:bg-accent-hover"
        >
          <Link href="/admin/presentations/new">
            <Plus className="w-4 h-4" />
            Add Presentation
          </Link>
        </Button>
      </div>

      <Suspense>
        <PresentationsTable
          initialPresentations={presentations}
          initialTotalCount={totalCount}
        />
      </Suspense>
    </div>
  );
}
