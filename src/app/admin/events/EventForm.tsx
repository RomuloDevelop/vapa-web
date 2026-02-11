"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { format, parse } from "date-fns";
import { Upload, CalendarIcon, X, ImageIcon } from "lucide-react";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { EVENT_TYPES, type Event, type EventType } from "@/lib/database.types";
import { ImageSearchPopover } from "@/components/molecules";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadImage(
  _key: string,
  { arg }: { arg: File }
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", arg);
  const res = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Upload failed");
  }
  return res.json();
}

interface EventFormProps {
  event?: Event;
}

const inputClass =
  "bg-surface border-border-accent text-white placeholder:text-foreground-faint focus-visible:border-accent focus-visible:ring-accent/20";

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!event;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger: uploadFile, isMutating: isUploading } = useSWRMutation(
    "image-upload",
    uploadImage
  );

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: event?.name ?? "",
    img: event?.img ?? "",
    date: event?.date ?? "",
    type: event?.type ?? ("webinar" as EventType),
    time: event?.time ?? "",
    presenters: event?.presenters?.join(", ") ?? "",
    links: event?.links?.join(", ") ?? "",
    description: event?.description ?? "",
  });

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSetFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5MB");
      return;
    }

    // Revoke previous preview
    setPreviewUrl((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPendingFile(file);
    setFormData((prev) => ({ ...prev, img: "__pending__" }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleRemoveImage = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setPendingFile(null);
    setFormData((prev) => ({ ...prev, img: "" }));
  };

  const handleUnsplashSelect = (url: string) => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setPendingFile(null);
    setFormData((prev) => ({ ...prev, img: url }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Parse date string to Date for Calendar
  const selectedDate = formData.date
    ? parse(formData.date, "yyyy-MM-dd", new Date())
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      let imgUrl = formData.img;

      // Upload pending file first
      if (pendingFile) {
        try {
          const result = await uploadFile(pendingFile);
          imgUrl = result.url;
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Image upload failed");
          return;
        }
      }

      if (!imgUrl || imgUrl === "__pending__") {
        toast.error("Please select an image");
        return;
      }

      const fd = new FormData();
      fd.set("name", formData.name);
      fd.set("img", imgUrl);
      fd.set("date", formData.date);
      fd.set("type", formData.type);
      fd.set("time", formData.time);
      fd.set("presenters", formData.presenters);
      fd.set("links", formData.links);
      fd.set("description", formData.description);

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

  const hasImage = pendingFile || (formData.img && formData.img !== "__pending__");
  const displayImageUrl = pendingFile ? previewUrl : formData.img;

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
            <Label className="text-foreground-muted">
              Date *
            </Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${inputClass} ${!formData.date ? "text-foreground-faint" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-foreground-subtle" />
                  {formData.date
                    ? format(selectedDate!, "MMM d, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-surface-section border-border-accent-light"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => {
                    if (day) {
                      setFormData((prev) => ({
                        ...prev,
                        date: format(day, "yyyy-MM-dd"),
                      }));
                    }
                    setDateOpen(false);
                  }}
                  defaultMonth={selectedDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-foreground-muted">
              Time
            </Label>
            <TimePicker
              value={formData.time}
              onChange={(time) =>
                setFormData((prev) => ({ ...prev, time }))
              }
              className={`w-full ${inputClass}`}
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
          <div className="flex items-center justify-between">
            <Label className="text-foreground-muted">
              Image *
            </Label>
            <ImageSearchPopover
              onSelectImage={handleUnsplashSelect}
              eventName={formData.name}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {hasImage ? (
            /* Preview state */
            <div className="flex flex-col gap-3">
              <div
                className="relative w-full h-48 rounded-lg overflow-hidden bg-surface-sunken group"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                {isDragging && (
                  <div className="absolute inset-0 bg-accent/20 border-2 border-dashed border-accent flex items-center justify-center">
                    <span className="text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-md">
                      Drop to replace
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border-accent text-foreground-muted hover:bg-accent-10 hover:text-white"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Change image
                </Button>
              </div>
            </div>
          ) : (
            /* Empty drop zone */
            <div className="flex flex-col gap-3">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 w-full h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border-accent hover:border-accent hover:bg-accent-10"
                }`}
              >
                <div className="p-3 rounded-full bg-accent-10">
                  <ImageIcon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground-muted">
                    Drag & drop an image here, or click to browse
                  </p>
                  <p className="text-xs text-foreground-faint mt-1">
                    JPEG, PNG, WebP, GIF &middot; Max 5MB
                  </p>
                </div>
              </div>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-foreground-muted">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional event description..."
            rows={4}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border-accent-light">
        <Button
          type="submit"
          disabled={isPending || isUploading}
          className="bg-accent text-surface font-semibold hover:bg-accent-hover"
        >
          {isPending
            ? isUploading
              ? "Uploading image..."
              : "Saving..."
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
