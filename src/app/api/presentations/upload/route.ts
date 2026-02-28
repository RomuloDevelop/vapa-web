import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { captureError } from "@/lib/error-tracking";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const ALLOWED_EXTENSIONS = ["pdf", "ppt", "pptx", "doc", "docx"];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, PPT, PPTX, DOC, DOCX" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const supabase = createServerClient();

    const { error: uploadError } = await supabase.storage
      .from("presentations")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Return only the file path, NOT a public URL (bucket is private)
    return NextResponse.json({
      filePath: fileName,
      originalName: file.name,
    });
  } catch (error) {
    captureError(error, { tags: { area: "presentation-upload" } });
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
