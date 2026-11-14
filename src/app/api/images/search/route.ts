import { NextRequest, NextResponse } from "next/server";
import { captureError } from "@/lib/error-tracking";
import { searchImages, ImageSearchError } from "@/lib/services/image-search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const eventName = request.nextUrl.searchParams.get("eventName") ?? undefined;

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    return NextResponse.json(await searchImages(query, eventName));
  } catch (error) {
    if (error instanceof ImageSearchError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    captureError(error, { tags: { area: "image-search" } });
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
