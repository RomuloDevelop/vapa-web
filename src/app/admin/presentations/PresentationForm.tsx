"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import {
  createPresentation,
  updatePresentation,
} from "@/lib/actions/presentations";
import type { Presentation } from "@/lib/database.types";
import { presentationSchema, type PresentationFormValues } from "@/lib/schemas";
import { ImageSearchPopover } from "@/components/molecules";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ── Image upload (same as EventForm) ────────────────────────────────────────

const IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB

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
    throw new Error(data.error || "Image upload failed");
  }
  return res.json();
}

// ── File upload (presentations bucket — private) ────────────────────────────

const FILE_ALLOWED_EXTENSIONS = ["pdf", "ppt", "pptx", "doc", "docx"];
const FILE_MAX_SIZE = 50 * 1024 * 1024; // 50MB

async function uploadFile(
  _key: string,
  { arg }: { arg: File }
): Promise<{ filePath: string; originalName: string }> {
  const formData = new FormData();
  formData.append("file", arg);
  const res = await fetch("/api/presentations/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "File upload failed");
  }
  return res.json();
}

// ── Component ───────────────────────────────────────────────────────────────

interface PresentationFormProps {
  presentation?: Presentation;
}

const inputClass =
  "bg-surface border-border-accent text-white placeholder:text-foreground-faint focus-visible:border-accent focus-visible:ring-accent/20";

const errorInputClass =
  "bg-surface border-red-500 text-white placeholder:text-foreground-faint focus-visible:border-red-500 focus-visible:ring-red-500/20";

export function PresentationForm({ presentation }: PresentationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!presentation;

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PresentationFormValues>({
    resolver: zodResolver(presentationSchema),
    defaultValues: {
      title: presentation?.title ?? "",
      description: presentation?.description ?? "",
      img: presentation?.img ?? "",
      file_path: presentation?.file_path ?? "",
    },
  });

  const imgValue = watch("img");
  const filePathValue = watch("file_path");
  const titleValue = watch("title");

  // Image upload
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { trigger: triggerImageUpload, isMutating: isUploadingImage } =
    useSWRMutation("presentation-image-upload", uploadImage);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isImageDragging, setIsImageDragging] = useState(false);

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger: triggerFileUpload, isMutating: isUploadingFile } =
    useSWRMutation("presentation-file-upload", uploadFile);
  const [pendingDocument, setPendingDocument] = useState<File | null>(null);
  const [isFileDragging, setIsFileDragging] = useState(false);

  // Clean up image object URLs
  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // ── Image handlers (same pattern as EventForm) ──────────────────────────

  const validateAndSetImage = useCallback(
    (file: File) => {
      if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
        toast.error("Invalid image type. Allowed: JPEG, PNG, WebP, GIF");
        return;
      }
      if (file.size > IMAGE_MAX_SIZE) {
        toast.error("Image too large. Maximum size is 5MB");
        return;
      }
      setImagePreviewUrl((prev) => {
        if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setPendingImage(file);
      setValue("img", "__pending__", { shouldValidate: true });
    },
    [setValue]
  );

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetImage(file);
    e.target.value = "";
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageDragging(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsImageDragging(false);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl("");
    setPendingImage(null);
    setValue("img", "", { shouldValidate: true });
  };

  const handleUnsplashSelect = (url: string) => {
    if (imagePreviewUrl.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl("");
    setPendingImage(null);
    setValue("img", url, { shouldValidate: true });
  };

  // ── File (document) handlers ────────────────────────────────────────────

  const validateAndSetDocument = useCallback(
    (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!FILE_ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error("Invalid file type. Allowed: PDF, PPT, PPTX, DOC, DOCX");
        return;
      }
      if (file.size > FILE_MAX_SIZE) {
        toast.error("File too large. Maximum size is 50MB");
        return;
      }
      setPendingDocument(file);
      setValue("file_path", "__pending__", { shouldValidate: true });
    },
    [setValue]
  );

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetDocument(file);
    e.target.value = "";
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragging(true);
  };

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsFileDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetDocument(file);
  };

  const handleRemoveDocument = () => {
    setPendingDocument(null);
    setValue("file_path", "", { shouldValidate: true });
  };

  // Display file name
  const displayFileName = pendingDocument
    ? pendingDocument.name
    : filePathValue
      ? filePathValue.replace(/^\d+-[a-f0-9-]+\./, "file.")
      : "";

  const displayFileExt = pendingDocument
    ? pendingDocument.name.split(".").pop()?.toUpperCase()
    : filePathValue
      ? filePathValue.split(".").pop()?.toUpperCase()
      : "";

  // ── Submit ──────────────────────────────────────────────────────────────

  const onSubmit = (data: PresentationFormValues) => {
    startTransition(async () => {
      let imgUrl = data.img;
      let filePath = data.file_path;

      // Upload pending image first
      if (pendingImage) {
        try {
          const result = await triggerImageUpload(pendingImage);
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

      // Upload pending document
      if (pendingDocument) {
        try {
          const result = await triggerFileUpload(pendingDocument);
          filePath = result.filePath;
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "File upload failed"
          );
          return;
        }
      }

      if (!filePath || filePath === "__pending__") {
        toast.error("Please select a file");
        return;
      }

      const fd = new FormData();
      fd.set("title", data.title);
      fd.set("description", data.description);
      fd.set("img", imgUrl);
      fd.set("file_path", filePath);

      const result = isEdit
        ? await updatePresentation(presentation!.id, fd)
        : await createPresentation(fd);

      if (result.success) {
        toast.success(
          isEdit ? "Presentation updated" : "Presentation created"
        );
        router.push("/admin/presentations");
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const hasImage =
    pendingImage || (imgValue && imgValue !== "__pending__");
  const displayImageUrl = pendingImage ? imagePreviewUrl : imgValue;

  const hasDocument =
    pendingDocument ||
    (filePathValue && filePathValue !== "__pending__");

  const isUploading = isUploadingImage || isUploadingFile;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-2xl">
      {/* Details */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Details
        </legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-foreground-muted">
            Title *
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g. Energy Transition Overview"
            className={errors.title ? errorInputClass : inputClass}
          />
          {errors.title && (
            <span className="text-xs text-red-400">{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-foreground-muted">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Optional description..."
            rows={4}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Image */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Image
        </legend>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground-muted">Cover Image *</Label>
            <ImageSearchPopover
              onSelectImage={handleUnsplashSelect}
              eventName={titleValue}
            />
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageFileChange}
            className="hidden"
          />

          {hasImage ? (
            <div className="flex flex-col gap-3">
              <div
                className="relative w-full h-48 rounded-lg overflow-hidden bg-surface-sunken group"
                onDragOver={handleImageDragOver}
                onDragEnter={handleImageDragEnter}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
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
                {isImageDragging && (
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
                  onClick={() => imageInputRef.current?.click()}
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
                onClick={() => imageInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    imageInputRef.current?.click();
                  }
                }}
                onDragOver={handleImageDragOver}
                onDragEnter={handleImageDragEnter}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                className={`flex flex-col items-center justify-center gap-3 w-full h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                  isImageDragging
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
      </fieldset>

      {/* File */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-accent tracking-[2px] uppercase mb-1">
          Presentation File
        </legend>

        <div className="flex flex-col gap-2">
          <Label className="text-foreground-muted">File *</Label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            onChange={handleDocumentFileChange}
            className="hidden"
          />

          {hasDocument ? (
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-sunken border border-border-accent-light"
                onDragOver={handleFileDragOver}
                onDragEnter={handleFileDragEnter}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-10 shrink-0">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {displayFileName}
                  </p>
                  <p className="text-xs text-foreground-faint">
                    {displayFileExt} file
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveDocument}
                  className="p-1.5 rounded-md text-foreground-muted hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
                {isFileDragging && (
                  <div className="absolute inset-0 bg-accent/20 border-2 border-dashed border-accent rounded-lg flex items-center justify-center">
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
                  Change file
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
                onDragOver={handleFileDragOver}
                onDragEnter={handleFileDragEnter}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}
                className={`flex flex-col items-center justify-center gap-3 w-full h-36 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                  isFileDragging
                    ? "border-accent bg-accent/10"
                    : errors.file_path
                      ? "border-red-500 hover:border-red-400"
                      : "border-border-accent hover:border-accent hover:bg-accent-10"
                }`}
              >
                <div className="p-3 rounded-full bg-accent-10">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground-muted">
                    Drag & drop a file here, or click to browse
                  </p>
                  <p className="text-xs text-foreground-faint mt-1">
                    PDF, PPT, PPTX, DOC, DOCX &middot; Max 50MB
                  </p>
                </div>
              </div>
              {errors.file_path && (
                <span className="text-xs text-red-400">
                  {errors.file_path.message}
                </span>
              )}
            </div>
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
              ? "Uploading..."
              : "Saving..."
            : isEdit
              ? "Update Presentation"
              : "Create Presentation"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/presentations")}
          className="border-border-accent text-foreground-muted hover:bg-accent-10 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
