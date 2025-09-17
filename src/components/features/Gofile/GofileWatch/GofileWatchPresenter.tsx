import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import React, { useEffect, useState } from "react";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";
import { Link } from "react-router-dom";
import { GofileVideo } from "@/lib/types";

export type WatchComment = {
  id: string;
  user: { id: string; name: string; avatarUrl?: string };
  content: string;
  createdAt: string; // human readable
};

export interface GofileWatchPresenterProps {
  item?: GofileVideo;
  loading: boolean;
  error?: string | null;
  videoRef?: React.RefObject<HTMLVideoElement>;

  onLoadMoreComments?: () => void;
  comments?: WatchComment[];
  hasMoreComments?: boolean;

  updateVideo: (next: GofileVideo) => Promise<void> | void;
  likeVideo: (videoId: string | undefined) => Promise<void> | void;
  unlikeVideo: (videoId: string | undefined) => Promise<void> | void;
}

export const GofileWatchPresenter: React.FC<GofileWatchPresenterProps> = ({
  item,
  loading,
  error,
  videoRef,
  onLoadMoreComments,
  comments = [],
  hasMoreComments = false,
  updateVideo,
  likeVideo,
  unlikeVideo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item?.Name ?? "");
  const [editDesc, setEditDesc] = useState(item?.Description ?? "");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!item) return;
    setEditName(item.Name ?? "");
    setEditDesc(item.Description ?? "");
  }, [item]);

  const XROLL_API_ENDPOINT = import.meta.env.VITE_API_URL;

  const onClickEdit = () => {
    setLocalError(null);
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setLocalError(null);
    if (item) {
      setEditName(item.Name ?? "");
      setEditDesc(item.Description ?? "");
    }
    setIsEditing(false);
  };

  const onSave = async () => {
    if (!item) return;
    const trimmed = editName.trim();
    if (trimmed.length === 0) {
      setLocalError("タイトルは1文字以上で入力してください。");
      return;
    }
    setSaving(true);
    setLocalError(null);
    try {
      await updateVideo({
        ...item,
        Name: trimmed,
        Description: editDesc ?? "",
      });
      setIsEditing(false);
    } catch (e: any) {
      setLocalError(e?.message ?? "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="supports-[backdrop-filter]:bg-black/60 fixed top-0 left-0 z-50 w-full bg-black/90 backdrop-blur">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-sm font-semibold tracking-tight sm:text-[15px]">
              Watch
            </div>
          </div>
        </div>
      </header>

      <div className="h-14 sm:h-16" />

      {/* Page */}
      <main className="pt-18 mx-auto w-full max-w-6xl px-0 pb-16 sm:px-4 sm:pt-24">
        {/* Player */}
        {/* モバイルは左右フルブリードにして存在感UP */}
        <div className="-mx-0 sm:mx-0">
          <div className="overflow-hidden rounded-none bg-black shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] ring-0 sm:rounded-3xl sm:ring-1 sm:ring-white/10">
            <video
              ref={videoRef}
              // ★モバイルは高さ基準（約45vh）。PCはこれまで通り aspect-video。
              className="h-[45vh] w-full bg-black object-contain sm:aspect-video sm:h-auto"
              src={
                item?.Id
                  ? `${XROLL_API_ENDPOINT}/gofile/proxy?id=${item.Id}`
                  : undefined
              }
              poster={item?.ThumbnailUrl ?? undefined}
              controls
              playsInline
              autoPlay
              preload="metadata"
            />
          </div>
        </div>

        {/* Title / Edit field */}
        {!isEditing ? (
          <h1 className="mt-4 text-[18px] font-semibold leading-snug tracking-tight sm:mt-5 sm:text-[22px]">
            {item?.Name || (loading ? "\u00A0" : "(無題)")}
          </h1>
        ) : (
          <div className="mt-4 sm:mt-5">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[16px] text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              placeholder="タイトルを入力"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={200}
            />
          </div>
        )}

        {/* Meta + Actions */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 sm:mt-4 sm:gap-3 sm:text-sm">
          <Link to={`/gofile/user?id=${item?.UserId}`} className="shrink-0">
            <img
              alt="avatar"
              className="h-7 w-7 rounded-full bg-white/5 object-cover sm:h-8 sm:w-8"
              src={ProfileIcon}
            />
          </Link>

          <Link to={`/gofile/user?id=${item?.UserId}`} className="min-w-0">
            <span className="truncate text-zinc-100">{item?.User.Name}</span>
          </Link>

          <span className="hidden opacity-50 sm:inline">•</span>
          <span>{(item?.PlayCount ?? 0).toLocaleString()} 回視聴</span>

          {item?.CreatedAt && (
            <>
              <span className="opacity-50">•</span>
              <span className="truncate">{item.CreatedAt}</span>
            </>
          )}

          {/* Like button */}
          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (!item?.Id) return;
                if (item?.HasLike) unlikeVideo(item.Id);
                else likeVideo(item.Id);
              }}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12] sm:w-auto sm:text-sm"
            >
              <span className="i-lucide-thumbs-up mr-0.5" />
              いいね {item?.LikeCount ?? 0}
            </button>

            {/* Edit buttons (owner only) */}
            {item?.UserId === USER_ID && (
              <>
                {!isEditing ? (
                  <button
                    onClick={onClickEdit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12] sm:w-auto sm:text-sm"
                    disabled={!item}
                  >
                    編集
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onSave}
                      disabled={saving}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-xs text-blue-100 hover:bg-blue-500/30 disabled:opacity-60 sm:w-auto sm:text-sm"
                    >
                      {saving ? "保存中…" : "保存"}
                    </button>
                    <button
                      onClick={onCancelEdit}
                      disabled={saving}
                      className="inline-flex w-full　items-center justify-center gap-2 whitespace-nowrap whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12] disabled:opacity-60 sm:w-auto sm:text-sm"
                    >
                      キャンセル
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-3 text-sm text-zinc-400">読み込み中…</div>
        )}
        {!!error && (
          <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {!!localError && (
          <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {localError}
          </div>
        )}

        {/* Description / Tags */}
        {!isEditing ? (
          <>
            {(item?.Description ||
              (item?.GofileTags && item.GofileTags.length > 0)) && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200 sm:mt-6 sm:p-5">
                {item?.Description && (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {item.Description}
                  </p>
                )}
                {item?.GofileTags && item.GofileTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.GofileTags.map((t) => (
                      <span
                        key={t.ID}
                        className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-zinc-300"
                      >
                        #{t.Name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {item?.Description === "" && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200 sm:mt-6 sm:p-5">
                <p className="leading-relaxed">説明はありません。</p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-6 sm:p-5">
            <label className="mb-2 block text-xs font-semibold text-zinc-300">
              説明
            </label>
            <textarea
              className="h-28 w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none sm:h-32"
              placeholder="説明を入力"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <div className="mt-2 text-right text-xs text-zinc-400">
              {editDesc.length} 文字
            </div>
          </div>
        )}

        {/* Comments */}
        <section className="mt-7 sm:mt-8">
          <h2 className="mb-2 text-xs font-semibold text-zinc-300 sm:mb-3 sm:text-sm">
            コメント
          </h2>

          <div className="mt-2">
            <textarea
              className="w-full resize-none rounded-md border border-white/10 bg-white/5 p-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="コメントを書く..."
            />
          </div>

          {comments.length === 0 ? (
            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
              まだコメントはありません。
            </div>
          ) : (
            <ul className="mt-3 space-y-3">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/10">
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
                    <div className="min-w-0 text-[11px] text-zinc-400 sm:text-xs">
                      <span className="truncate text-zinc-200">
                        {c.user.name}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{c.createdAt}</span>
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
      </main>
    </div>
  );
};
