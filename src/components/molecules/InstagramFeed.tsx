"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Instagram, Play, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { InstagramPost } from "@/lib/services/instagram";
import { fadeInUp, defaultViewport, staggerDelay } from "../utils/animations";

const POSTS_PER_PAGE = 8; // 4 columns × 2 rows

interface InstagramFeedProps {
  posts: InstagramPost[];
}

export function InstagramFeed({ posts }: InstagramFeedProps) {
  const t = useTranslations("Instagram");
  const [expanded, setExpanded] = useState(false);

  if (!posts.length) return null;

  const visiblePosts = posts.slice(0, expanded ? POSTS_PER_PAGE * 2 : POSTS_PER_PAGE);
  const hasMore = posts.length > POSTS_PER_PAGE && !expanded;

  return (
    <div className="flex flex-col items-center gap-4">
      <a
        href="https://www.instagram.com/vapa.us"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 bg-accent text-surface text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity"
      >
        <Instagram className="w-5 h-5" />
        {t("followUs")}
      </a>
      <div className="instagram-grid gap-2 md:gap-3 mx-auto">
        {visiblePosts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram post${post.like_count != null ? ` — ${post.like_count.toLocaleString()} likes` : ""}${post.comments_count != null ? `, ${post.comments_count.toLocaleString()} comments` : ""} (opens in new tab)`}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            transition={staggerDelay(index)}
            className="group relative aspect-square overflow-hidden rounded bg-surface-raised"
          >
            <img
              src={post.thumbnail_url || post.media_url}
              alt={post.caption?.slice(0, 80) ?? "VAPA Instagram post"}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {post.media_type === "VIDEO" && (
              <div className="absolute bottom-2 left-2 bg-black/50 rounded-full p-1">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3" aria-hidden="true">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                {post.like_count != null && (
                  <span className="text-white text-sm font-semibold">
                    {post.like_count.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
                {post.comments_count != null && (
                  <span className="text-white text-sm font-semibold">
                    {post.comments_count.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mt-2">
        {hasMore && (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 text-base font-medium text-foreground-muted hover:text-accent transition-colors"
            aria-label={t("seeMore")}
          >
            {t("seeMore")}
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>
      </div>
  );
}
