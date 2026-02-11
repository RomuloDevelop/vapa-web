import { NextRequest, NextResponse } from "next/server";

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string | null;
  description: string | null;
  user: { name: string; links: { html: string } };
}

async function refineQueryWithGemini(
  userPrompt: string,
  eventName?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return userPrompt;

  const context = eventName
    ? `Event name: ${eventName}\nUser prompt: ${userPrompt}`
    : `User prompt: ${userPrompt}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a search query optimizer for Unsplash stock photos.
Given this context, generate a single optimized search query (3-6 words) for finding professional stock photos.

${context}

Return ONLY the search query, nothing else.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) return userPrompt;

    const data = await res.json();
    const refined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    return refined || userPrompt;
  } catch {
    return userPrompt;
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const eventName = request.nextUrl.searchParams.get("eventName") ?? undefined;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    return NextResponse.json(
      { error: "Unsplash API not configured" },
      { status: 500 }
    );
  }

  try {
    const refinedQuery = await refineQueryWithGemini(query, eventName);

    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", refinedQuery);
    url.searchParams.set("per_page", "9");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${unsplashKey}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unsplash API error" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const results = data.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      alt:
        photo.alt_description || photo.description || "Unsplash photo",
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));

    return NextResponse.json({ results, query: refinedQuery });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
