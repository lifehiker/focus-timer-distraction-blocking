import type { BlockingPreset } from "./types";

export const BLOCKING_PRESETS: BlockingPreset[] = [
  {
    id: "youtube",
    name: "YouTube / Shorts",
    description: "Block YouTube and YouTube Shorts feed",
    icon: "▶",
    domains: ["youtube.com", "youtu.be"],
  },
  {
    id: "instagram",
    name: "Instagram / Reels",
    description: "Block Instagram and Reels feed",
    icon: "📷",
    domains: ["instagram.com"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Block TikTok feed",
    icon: "🎵",
    domains: ["tiktok.com"],
  },
  {
    id: "twitter",
    name: "X / Twitter",
    description: "Block X (Twitter) feed",
    icon: "✕",
    domains: ["x.com", "twitter.com"],
  },
  {
    id: "reddit",
    name: "Reddit",
    description: "Block Reddit feed",
    icon: "🔴",
    domains: ["reddit.com"],
  },
];

export const PRESET_BUNDLES = [
  {
    id: "social-feeds",
    name: "Social Feeds",
    description: "All social media feeds",
    presetIds: ["instagram", "twitter", "reddit"],
  },
  {
    id: "video-feeds",
    name: "Video Feeds",
    description: "YouTube and TikTok",
    presetIds: ["youtube", "tiktok"],
  },
  {
    id: "all-distractions",
    name: "All Distractions",
    description: "Block everything",
    presetIds: ["youtube", "instagram", "tiktok", "twitter", "reddit"],
  },
];
