import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import AdBanner, { JuicyAdsBanner } from "@/components/ads/juicyAds";
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  Play,
  X,
  Link,
} from "lucide-react";
import { SideBarMenuXroll } from "@/components/ui/SideBarMenuXroll";
import { appUrl } from "@/config/url";
import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";

// --- Types ---
interface VideoItem {
  id: string;
  title: string;
  channel: string;
  views: number;
  uploadedAt: string; // ISO string
  duration: string; // e.g., "12:34"
  thumbnail?: string; // optional url
  mp4Url?: string; // optional test url
  tags?: string[];
}

// --- Mock Data (replace with Gofile API data later) ---
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "【デモ】Gofile + React で作る動画プラットフォームのUIサンプル",
    channel: "xroll dev",
    views: 12345,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    duration: "8:11",
    thumbnail:
      "https://cold4.gofile.io/download/web/7215e03b-d93e-4628-8ca9-859bd51eabb2/thumb_e1946fc16649ead4502111c32c30d694",
    mp4Url:
      "https://video.twimg.com/ext_tw_video/1947983208534151168/pu/vid/avc1/720x1244/Ku6zYYJGUyYZ9lP_.mp4?tag=12", // テスト再生用（入れ替えOK）
    tags: ["デモ", "Gofile", "React"],
  },
  {
    id: "v2",
    title: "UIだけでYouTubeっぽくする・カード/グリッド/メタ情報の設計",
    channel: "xroll dev",
    views: 9876,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    duration: "12:03",
    thumbnail: undefined,
    tags: ["UI", "設計"],
  },
  {
    id: "v3",
    title: "モーダルで再生・オートプレイ・ショートカット実装（テスト）",
    channel: "frontend tips",
    views: 3321,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration: "3:59",
    thumbnail: undefined,
    mp4Url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    tags: ["再生", "モーダル"],
  },
  {
    id: "v4",
    title: "無限スクロールの骨組み（ダミー）",
    channel: "xroll ui",
    views: 1986,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    duration: "6:20",
    thumbnail: undefined,
    tags: ["UX", "LazyLoad"],
  },
];

// --- Utils ---
const formatViews = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(1)}K`
    : `${v}`;

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
};

// --- Small UI pieces ---
const Chip: React.FC<{
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${
      active
        ? "border-white bg-white text-black"
        : "border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
    }`}
  >
    {label}
  </button>
);

const SkeletonThumb: React.FC = () => (
  <div className="aspect-video w-full animate-pulse rounded-xl bg-zinc-800" />
);

// --- Video Card ---
const VideoCard: React.FC<{
  item: VideoItem;
  onPlay: (item: VideoItem) => void;
}> = ({ item, onPlay }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative">
        {/* Thumbnail */}
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="aspect-video w-full rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900" />
        )}
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {item.duration}
        </span>
        {/* Play overlay on hover */}
        <div className="absolute inset-0 hidden items-center justify-center rounded-xl bg-black/0 transition group-hover:flex group-hover:bg-black/30">
          <Play className="h-8 w-8" />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex gap-3">
        {/* Avatar placeholder */}
        <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-700" />
        <div className="min-w-0 flex-1">
          <h3
            className="line-clamp-2 text-[15px] font-medium text-zinc-50"
            onClick={() => onPlay(item)}
          >
            {item.title}
          </h3>
          <div className="mt-1 text-xs text-zinc-400">
            <span className="hover:text-zinc-200">{item.channel}</span>
            <span className="mx-1">•</span>
            <span>{formatViews(item.views)} 回視聴</span>
            <span className="mx-1">•</span>
            <span>{timeAgo(item.uploadedAt)}</span>
          </div>
        </div>
        <button className="self-start rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// --- Player Modal ---
const PlayerModal: React.FC<{
  open: boolean;
  onClose: () => void;
  video?: VideoItem | null;
}> = ({ open, onClose, video }) => {
  if (!open || !video) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-950 w-full max-w-5xl rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0 pr-4">
            <div className="truncate text-sm text-zinc-400">
              {video.channel}
            </div>
            <div className="truncate text-lg font-semibold text-zinc-50">
              {video.title}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            {video.mp4Url ? (
              <video
                src={video.mp4Url}
                className="h-full w-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">
                この動画にはテスト用の再生URLがありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---
export function GofileSearchPresenter() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  // simulate fetch
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    MOCK_VIDEOS.forEach((v) => v.tags?.forEach((t) => set.add(t)));
    return ["すべて", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_VIDEOS.filter((v) => {
      const inTag =
        !activeTag || activeTag === "すべて" || v.tags?.includes(activeTag);
      const inQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q);
      return inTag && inQuery;
    });
  }, [query, activeTag]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          {/* 左：ロゴとメニュー */}
          <div className="flex shrink-0 items-center gap-2">
            <SideBarMenuXfile />
            <div>Gofile Controller</div>
          </div>

          {/* 中央〜右：検索バー */}
          <div className="flex flex-1 items-center gap-2">
            <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索（タイトル / チャンネル）"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>
            <a
              href={appUrl.gofileUpload}
              className="hidden items-center whitespace-nowrap rounded-full border border-zinc-800 bg-white px-4 py-2 text-sm text-black sm:inline-flex"
            >
              投稿する
            </a>
          </div>
        </div>
      </header>
      {/* Top search + filters */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="sticky top-16 z-10 -mx-4 border-b border-zinc-800 bg-black/80 px-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-3">
            {tags.map((t) => (
              <Chip
                key={t}
                label={t}
                active={activeTag === t || (t === "すべて" && !activeTag)}
                onClick={() => setActiveTag(t === "すべて" ? null : t)}
              />
            ))}
          </div>
        </div>

        {/* Banners (optional) */}
        {/* <div className="my-4 flex w-full justify-center">
          <AdBanner />
        </div> */}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <SkeletonThumb />
                <div className="mt-3 flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-zinc-800" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded bg-zinc-800" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VideoCard key={v.id} item={v} onPlay={setPlaying} />
            ))}
          </div>
        )}

        <div className="my-10 flex justify-center">
          <JuicyAdsBanner />
        </div>

        {/* Load more (dummy) */}
        <div className="flex items-center justify-center py-10">
          <button
            className="rounded-full border border-zinc-800 px-5 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            onClick={() => setLoading(true)}
          >
            さらに表示（ダミー）
          </button>
        </div>
      </main>

      <Footer />

      <PlayerModal
        open={!!playing}
        onClose={() => setPlaying(null)}
        video={playing}
      />
    </div>
  );
}
