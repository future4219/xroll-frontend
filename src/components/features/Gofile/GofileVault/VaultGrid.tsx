import { VisibilityBadge } from "@/components/features/Gofile/GofileVault/VisibilityBadge";
import { VaultItem } from "@/components/features/Gofile/GofileVault/types";
import { Copy, Eye, EyeOff, MoreVertical, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { timeAgo, copy } from "./utils";

export function VaultGrid({
  items,
  onShare,
  onToggleVisibility,
  buildWatchHref = (it) => `/gofile/watch?id=${it.id}`,
}: {
  items: VaultItem[];
  onShare: (it: VaultItem) => void;
  onToggleVisibility: (id: string) => void;
  buildWatchHref?: (it: VaultItem) => string;
}) {
  const stop: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const href = buildWatchHref(it);
        return (
          <Link
            key={it.id}
            to={href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          >
            <div className="relative">
              {it.thumbnail ? (
                <img
                  src={it.thumbnail}
                  alt={it.title}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900" />
              )}
              <div className="absolute top-2 left-2">
                <VisibilityBadge v={it.visibility} />
              </div>
              {it.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs">
                  {it.duration}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-700" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[15px] font-medium">
                  {it.title}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400">
                  <span className="opacity-60">•</span>
                  <span>{timeAgo(it.createdAt!)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    stop(e);
                    onShare(it);
                  }}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  title="共有設定"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={stop}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    title="その他"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {it.visibility === "shared" && it.share?.url && (
                <button
                  onClick={(e) => {
                    stop(e);
                    copy(it.gofile_direct_url!);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  <Copy className="h-3.5 w-3.5" /> コピー
                </button>
              )}
              <button
                onClick={(e) => {
                  stop(e);
                  onToggleVisibility(it.id);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                {it.visibility === "shared" ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> 非公開にする
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> 共有する
                  </>
                )}
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
