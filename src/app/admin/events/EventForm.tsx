"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { EVENT_TYPES, type Event, type EventType } from "@/lib/database.types";
import { ImageSearchPopover } from "@/components/molecules";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventFormProps {
  event?: Event;
}

const inputClass =
  "bg-surface border-border-accent-light text-white placeholder:text-foreground-faint focus-visible:border-accent focus-visible:ring-accent/20";

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!event;

  const [formData, setFormData] = useState({
    name: event?.name ?? "",
    img: event?.img ?? "",
    date: event?.date ?? "",
    type: event?.type ?? ("webinar" as EventType),
    time: event?.time ?? "",
    presenters: event?.presenters?.join(", ") ?? "",
    links: event?.links?.join(", ") ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.set("name", formData.name);
    fd.set("img", formData.img);
    fd.set("date", formData.date);
    fd.set("type", formData.type);
    fd.set("time", formData.time);
    fd.set("presenters", formData.presenters);
    fd.set("links", formData.links);

    startTransition(async () => {
      const result = isEdit
        ? await updateEvent(event!.id, fd)
        : await createEvent(fd);

      if (result.success) {
        toast.success(isEdit ? "Event updated" : "Event created");
        router.push("/admin/events");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Basic Info */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Basic Info
        </legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-foreground-muted">
            Event Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. VAPA Webinar: Energy Transition"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="type" className="text-foreground-muted">
            Type *
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value as EventType }))
            }
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent className="bg-surface-section border-border-accent-light">
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-white">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      {/* Schedule */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Schedule
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-foreground-muted">
              Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="time" className="text-foreground-muted">
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
        </div>
      </fieldset>

      {/* Media */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Media
        </legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="img" className="text-foreground-muted">
            Image URL *
          </Label>
          <div className="flex gap-2">
            <Input
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              required
              placeholder="https://..."
              className={inputClass}
            />
            <ImageSearchPopover
              onSelectImage={(url) =>
                setFormData((prev) => ({ ...prev, img: url }))
              }
              eventName={formData.name}
            />
          </div>
          {formData.img && (
            <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden bg-surface-sunken mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.img}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="links" className="text-foreground-muted">
            Links
          </Label>
          <Input
            id="links"
            name="links"
            value={formData.links}
            onChange={handleChange}
            placeholder="https://youtube.com/... (comma-separated)"
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Details */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Details
        </legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="presenters" className="text-foreground-muted">
            Presenters
          </Label>
          <Input
            id="presenters"
            name="presenters"
            value={formData.presenters}
            onChange={handleChange}
            placeholder="John Doe, Jane Smith (comma-separated)"
            className={inputClass}
          />
        </div>

      </fieldset>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border-accent-light">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-accent text-surface font-semibold hover:bg-accent-hover"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Event"
              : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/events")}
          className="border-border-accent text-foreground-muted hover:bg-accent-10 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
