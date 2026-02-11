import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Create Event</h1>
      <EventForm />
    </div>
  );
}
