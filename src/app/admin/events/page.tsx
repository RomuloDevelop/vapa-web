import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents, getEventsCount, getEventYears } from "@/lib/services/events";
import { Button } from "@/components/ui/button";
import { EventsTable } from "./EventsTable";

const PAGE_SIZE = 10;

export default async function AdminEventsPage() {
  const [events, totalCount, years] = await Promise.all([
    getEvents({ limit: PAGE_SIZE, offset: 0 }),
    getEventsCount(),
    getEventYears(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <Button asChild className="bg-accent text-surface font-semibold hover:bg-accent-hover">
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <EventsTable
        initialEvents={events}
        initialTotalCount={totalCount}
        availableYears={years}
      />
    </div>
  );
}
