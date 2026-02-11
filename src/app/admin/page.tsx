import Link from "next/link";
import { Calendar, Plus, Star } from "lucide-react";
import { getEventsCount } from "@/lib/services/events";
import type { EventType } from "@/lib/database.types";

const SPECIAL_EVENT: EventType = "special_event";

export default async function AdminDashboardPage() {
  const [totalEvents, specialEvents] = await Promise.all([
    getEventsCount(),
    getEventsCount({ type: SPECIAL_EVENT }),
  ]);

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: Calendar,
    },
    {
      label: "Special Events",
      value: specialEvents,
      icon: Star,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-6 rounded-xl bg-surface-section border border-border-accent-light"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-20">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-foreground-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 px-5 py-3 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-2 px-5 py-3 border border-border-accent text-foreground-muted text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            View All Events
          </Link>
        </div>
      </div>
    </div>
  );
}
