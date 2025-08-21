import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import React from "react";

export type WatchItem = {
  id: string;
  title: string;
  mp4Url?: string;
  thumbnail?: string;
  channel?: string;
  uploadedAt?: string;
  description?: string;
  tags?: string[];
  likeCount?: number;
  views?: number; // ★追加
};

export type WatchComment = {
  id: string;
  user: { id: string; name: string; avatarUrl?: string };
  content: string;
  createdAt: string; // human readable
};

export interface GofileWatchPresenterProps {
  item?: WatchItem;
  loading: boolean;
  error?: string | null;
  videoRef?: React.RefObject<HTMLVideoElement>;

  // ★追加: インタラクション
  onLike?: () => void;
  onLoadMoreComments?: () => void;

  // ★追加: コメント閲覧用
  comments?: WatchComment[];
  hasMoreComments?: boolean;
}

export const GofileWatchPresenter: React.FC<GofileWatchPresenterProps> = ({
  item,
  loading,
  error,
  videoRef,
  onLike,
  onLoadMoreComments,
  comments = [],
  hasMoreComments = false,
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 z-50 w-full bg-black text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              Watch
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto mt-8 w-full max-w-6xl px-4 py-10">
        {/* Player */}
        <div className="overflow-hidden rounded-3xl bg-black shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          <video
            ref={videoRef}
            className="aspect-video w-full bg-black"
            src={item?.mp4Url}
            poster={item?.thumbnail}
            controls
            playsInline
            autoPlay
            preload="metadata"
          />
        </div>

        {/* タイトル */}
        <h1 className="mt-5 text-[22px] font-semibold leading-snug tracking-tight">
          {item?.title || (loading ? "\u00A0" : "(無題)")}
        </h1>

        {/* メタ＋アクション */}
        {(item?.channel || item?.uploadedAt || item?.views !== undefined) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            {item?.channel && <span>{item.channel}</span>}
            {item?.channel &&
              (item?.uploadedAt || item?.views !== undefined) && (
                <span className="opacity-50">•</span>
              )}
            {item?.views !== undefined && (
              <span>{item.views.toLocaleString()} 回視聴</span>
            )}
            {item?.uploadedAt && (
              <>
                <span className="opacity-50">•</span>
                <span>{item.uploadedAt}</span>
              </>
            )}

            {/* いいねボタン */}
            <button
              onClick={onLike}
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12]"
            >
              <span className="i-lucide-thumbs-up mr-0.5" />
              いいね {item?.likeCount ? item.likeCount.toLocaleString() : ""}
            </button>
          </div>
        )}

        {/* エラー / ローディング */}
        {loading && (
          <div className="mt-3 text-sm text-zinc-400">読み込み中…</div>
        )}
        {!!error && (
          <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* 説明・タグ */}
        {(item?.description || (item?.tags && item.tags.length > 0)) && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
            {item?.description && (
              <p className="leading-relaxed">{item.description}</p>
            )}
            {item?.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* コメント（閲覧） */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">コメント</h2>

          {comments.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
              まだコメントはありません。
            </div>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-6 w-6 overflow-hidden rounded-full bg-white/10">
                      {c.user.avatarUrl ? (
                        <img
                          src={c.user.avatarUrl}
                          alt={c.user.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="text-xs text-zinc-400">
                      <span className="text-zinc-200">{c.user.name}</span>
                      <span className="mx-1">•</span>
                      <span>{c.createdAt}</span>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-zinc-100">
                    {c.content}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {hasMoreComments && (
            <button
              onClick={onLoadMoreComments}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 hover:bg-white/[0.08]"
            >
              さらに表示
            </button>
          )}
        </section>
      </div>
    </div>
  );
};
