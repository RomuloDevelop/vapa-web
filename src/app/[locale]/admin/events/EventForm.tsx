"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { format, parse } from "date-fns";
import { Upload, CalendarIcon, X, ImageIcon, Loader2 } from "lucide-react";
import { formatEventTime, parseEventTime } from "./format-time";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { translateTexts } from "@/lib/actions/translate";
import { EVENT_TYPES, type Event, type EventType } from "@/lib/database.types";
import { eventSchema, type EventFormValues } from "@/lib/schemas";
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

async function doTranslate(
  _key: string,
  { arg }: { arg: string[] }
): Promise<{ translations: string[] }> {
  const result = await translateTexts(arg);
  if (!result.success) {
    throw new Error(result.error.message || "Translation failed");
  }
  return result.data;
}

interface EventFormProps {
  event?: Event;
}

const inputClass =
  "bg-surface border-border-accent text-white placeholder:text-foreground-faint focus-visible:border-accent focus-visible:ring-accent/20";

const errorInputClass =
  "bg-surface border-red-500 text-white placeholder:text-foreground-faint focus-visible:border-red-500 focus-visible:ring-red-500/20";

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!event;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger: uploadFile, isMutating: isUploading } = useSWRMutation(
    "image-upload",
    uploadImage
  );
  const { trigger: translateTrigger, isMutating: isTranslating } = useSWRMutation(
    "translate",
    doTranslate
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name ?? "",
      name_en: event?.name_en ?? "",
      img: event?.img ?? "",
      date: event?.date ?? "",
      type: event?.type ?? "webinar",
      time: event?.time ? parseEventTime(event.time) : "",
      presenters: event?.presenters?.join(", ") ?? "",
      links: event?.links?.join(", ") ?? "",
      description: event?.description ?? "",
      description_en: event?.description_en ?? "",
    },
  });

  const imgValue = watch("img");
  const dateValue = watch("date");
  const nameValue = watch("name");

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<"es" | "en">("es");

  // Auto-translate when switching languages
  const handleLangSwitch = async (newLang: "es" | "en") => {
    setActiveLang(newLang);

    const name = watch("name");
    const nameEn = watch("name_en");
    const desc = watch("description");
    const descEn = watch("description_en");

    if (newLang === "en") {
      // Translate ES → EN for empty EN fields
      const needsName = name.trim() && !nameEn.trim();
      const needsDesc = desc.trim() && !descEn.trim();
      if (!needsName && !needsDesc) return;

      const texts: string[] = [];
      if (needsName) texts.push(name);
      if (needsDesc) texts.push(desc);

      try {
        const result = await translateTrigger(texts);
        let i = 0;
        if (needsName) setValue("name_en", result.translations[i++], { shouldValidate: true });
        if (needsDesc) setValue("description_en", result.translations[i], { shouldValidate: true });
      } catch {
        toast.error("Translation failed — you can type the English text manually");
      }
    } else {
      // Translate EN → ES for empty ES fields
      const needsName = nameEn.trim() && !name.trim();
      const needsDesc = descEn.trim() && !desc.trim();
      if (!needsName && !needsDesc) return;

      const texts: string[] = [];
      if (needsName) texts.push(nameEn);
      if (needsDesc) texts.push(descEn);

      try {
        const result = await translateTrigger(texts);
        let i = 0;
        if (needsName) setValue("name", result.translations[i++], { shouldValidate: true });
        if (needsDesc) setValue("description", result.translations[i], { shouldValidate: true });
      } catch {
        toast.error("Translation failed — you can type the Spanish text manually");
      }
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSetFile = useCallback(
    (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error("File too large. Maximum size is 5MB");
        return;
      }

      setPreviewUrl((prev) => {
        if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setPendingFile(file);
      setValue("img", "__pending__", { shouldValidate: true });
    },
    [setValue]
  );

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
    setValue("img", "", { shouldValidate: true });
  };

  const handleUnsplashSelect = (url: string) => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setPendingFile(null);
    setValue("img", url, { shouldValidate: true });
  };

  // Parse date string to Date for Calendar
  const selectedDate = dateValue
    ? parse(dateValue, "yyyy-MM-dd", new Date())
    : undefined;

  const onSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      let imgUrl = data.img;

      // Upload pending file first
      if (pendingFile) {
        try {
          const result = await uploadFile(pendingFile);
          imgUrl = result.url;
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Image upload failed"
          );
          return;
        }
      }

      if (!imgUrl || imgUrl === "__pending__") {
        toast.error("Please select an image");
        return;
      }

      const fd = new FormData();
      fd.set("name", data.name);
      fd.set("name_en", data.name_en);
      fd.set("img", imgUrl);
      fd.set("date", data.date);
      fd.set("type", data.type);
      fd.set("time", data.time ? formatEventTime(data.date, data.time) : "");
      fd.set("presenters", data.presenters);
      fd.set("links", data.links);
      fd.set("description", data.description);
      fd.set("description_en", data.description_en);

      const result = isEdit
        ? await updateEvent(event!.id, fd)
        : await createEvent(fd);

      if (result.success) {
        toast.success(isEdit ? "Event updated" : "Event created");
        router.push("/admin/events");
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const hasImage =
    pendingFile || (imgValue && imgValue !== "__pending__");
  const displayImageUrl = pendingFile ? previewUrl : imgValue;

  // Field registration based on active language
  const nameField = activeLang === "es" ? "name" : "name_en";
  const descField = activeLang === "es" ? "description" : "description_en";
  const nameLabel = activeLang === "es" ? "Nombre del Evento (Español) *" : "Event Name (English) *";
  const descLabel = activeLang === "es" ? "Descripción (Español) *" : "Description (English) *";
  const namePlaceholder = activeLang === "es"
    ? "ej. Webinar VAPA: Transición Energética"
    : "e.g. VAPA Webinar: Energy Transition";
  const descPlaceholder = activeLang === "es"
    ? "Descripción del evento..."
    : "Event description...";

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 max-w-2xl"
      >
        {/* Language Toggle */}
        <div className="flex items-center gap-3 justify-end">
          <div className="relative flex items-center bg-surface-sunken rounded-lg p-0.5 border border-border-accent">
            <div
              className={`absolute top-0.5 left-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-md bg-accent transition-transform duration-200 ${
                activeLang === "en" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              onClick={() => handleLangSwitch("es")}
              disabled={isTranslating}
              className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeLang === "es" ? "text-surface" : "text-foreground-muted"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => handleLangSwitch("en")}
              disabled={isTranslating}
              className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeLang === "en" ? "text-surface" : "text-foreground-muted"
              }`}
            >
              EN
            </button>
          </div>
          {isTranslating && (
            <div className="flex items-center gap-1.5 text-xs text-accent">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Translating...
            </div>
          )}
        </div>

        {/* Basic Info */}
        <fieldset className="flex flex-col gap-5">
          <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
            Basic Info
          </legend>

          <div className="flex flex-col gap-2">
            <Label htmlFor={nameField} className="text-foreground-muted">
              {nameLabel}
            </Label>
            <Input
              id={nameField}
              key={nameField}
              {...register(nameField)}
              placeholder={namePlaceholder}
              className={errors[nameField] ? errorInputClass : inputClass}
            />
            {errors[nameField] && (
              <span className="text-xs text-red-400">{errors[nameField]?.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="text-foreground-muted">
              Type *
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.type ? errorInputClass : inputClass}
                  >
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-section border-border-accent-light">
                    {EVENT_TYPES.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="text-white"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <span className="text-xs text-red-400">{errors.type.message}</span>
            )}
          </div>
        </fieldset>

        {/* Schedule */}
        <fieldset className="flex flex-col gap-5">
          <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
            Schedule
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground-muted">Date *</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${errors.date ? errorInputClass : inputClass} ${!field.value ? "text-foreground-faint" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-foreground-subtle" />
                        {field.value
                          ? format(
                              parse(field.value, "yyyy-MM-dd", new Date()),
                              "MMM d, yyyy"
                            )
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
                            field.onChange(format(day, "yyyy-MM-dd"));
                          }
                          setDateOpen(false);
                        }}
                        defaultMonth={selectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <span className="text-xs text-red-400">
                  {errors.date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground-muted">Time (CT — Houston)</Label>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    className={`w-full ${inputClass}`}
                  />
                )}
              />
              <span className="text-xs text-foreground-faint">
                ET and Venezuela times will be calculated automatically
              </span>
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
              <Label className="text-foreground-muted">Image *</Label>
              <ImageSearchPopover
                onSelectImage={handleUnsplashSelect}
                eventName={nameValue}
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
                      : errors.img
                        ? "border-red-500 hover:border-red-400"
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
                {errors.img && (
                  <span className="text-xs text-red-400">
                    {errors.img.message}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="links" className="text-foreground-muted">
              Links
            </Label>
            <Input
              id="links"
              {...register("links")}
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
              {...register("presenters")}
              placeholder="John Doe, Jane Smith (comma-separated)"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={descField} className="text-foreground-muted">
              {descLabel}
            </Label>
            <Textarea
              id={descField}
              key={descField}
              {...register(descField)}
              placeholder={descPlaceholder}
              rows={4}
              className={errors[descField] ? errorInputClass : inputClass}
            />
            {errors[descField] && (
              <span className="text-xs text-red-400">{errors[descField]?.message}</span>
            )}
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
