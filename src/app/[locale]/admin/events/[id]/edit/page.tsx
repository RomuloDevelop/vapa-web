import { getEventById } from "@/lib/services/events";
import { notFound } from "next/navigation";
import { EventForm } from "../../EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Edit Event</h1>
      <EventForm event={event} />
    </div>
  );
}
