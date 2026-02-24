export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

const FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";

/**
 * Fetch Instagram posts from the Graph API.
 * Use in Server Components or Server Actions.
 * Returns [] on error so the page still builds if the token is missing or expired.
 */
export async function getInstagramPosts(
  limit = 12
): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${limit}&access_token=${token}`
    );

    if (!res.ok) {
      console.error("[instagram]", res.status, await res.text());
      return [];
    }

    const json = await res.json();
    const posts: InstagramPost[] = json.data ?? [];

    return posts;
  } catch (error) {
    console.error("[instagram] fetch failed:", error);
    return [];
  }
}
