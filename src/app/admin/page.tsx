import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Plus, Star, Video, ArrowRight } from "lucide-react";
import {
  getEventsCount,
  getRecentEvents,
  getRecentSpecialEvents,
} from "@/lib/services/events";
import type { Event, EventType } from "@/lib/database.types";

const SPECIAL_EVENT: EventType = "special_event";

function EventRow({ event }: { event: Event }) {
  return (
    <Link
      href={`/admin/events/${event.id}/edit`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-10 transition-colors group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.img}
        alt={event.name}
        className="w-12 h-12 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
          {event.name}
        </p>
        <p className="text-xs text-foreground-subtle">
          {format(new Date(event.date), "MMM d, yyyy")}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-foreground-faint group-hover:text-accent transition-colors shrink-0" />
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [totalEvents, specialEventsCount, recentWebinars, recentSpecialEvents] =
    await Promise.all([
      getEventsCount(),
      getEventsCount({ type: SPECIAL_EVENT }),
      getRecentEvents(5),
      getRecentSpecialEvents(5),
    ]);

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: Calendar,
    },
    {
      label: "Special Events",
      value: specialEventsCount,
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

      {/* Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Webinars */}
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-surface-section border border-border-accent-light">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-accent" />
              Latest Webinars
            </h2>
            <Link
              href="/admin/events?type=webinar"
              className="text-xs text-foreground-subtle hover:text-accent transition-colors"
            >
              View all
            </Link>
          </div>
          {recentWebinars.length > 0 ? (
            <div className="flex flex-col">
              {recentWebinars.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-subtle py-4 text-center">
              No webinars yet.
            </p>
          )}
        </div>

        {/* Latest Special Events */}
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-surface-section border border-border-accent-light">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" />
              Latest Special Events
            </h2>
            <Link
              href="/admin/events?type=special_event"
              className="text-xs text-foreground-subtle hover:text-accent transition-colors"
            >
              View all
            </Link>
          </div>
          {recentSpecialEvents.length > 0 ? (
            <div className="flex flex-col">
              {recentSpecialEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-subtle py-4 text-center">
              No special events yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
