import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import React, { useEffect, useMemo, useState } from "react";
import { GofileVideo } from "@/components/features/Gofile/GofileVault/types";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";
import { Link } from "react-router-dom";
import { appUrl } from "@/config/url";

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
  item?: GofileVideo;
  loading: boolean;
  error?: string | null;
  videoRef?: React.RefObject<HTMLVideoElement>;

  // ★追加: インタラクション
  onLoadMoreComments?: () => void;

  // ★追加: コメント閲覧用
  comments?: WatchComment[];
  hasMoreComments?: boolean;

  // ★追加: 動画の更新
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
            src={`${XROLL_API_ENDPOINT}/gofile/proxy?id=${item?.Id}`}
            poster={item?.ThumbnailUrl ?? undefined}
            controls
            playsInline
            autoPlay
            preload="metadata"
          />
        </div>

        {/* タイトル or 編集フィールド */}
        {!isEditing ? (
          <h1 className="mt-5 text-[22px] font-semibold leading-snug tracking-tight">
            {item?.Name || (loading ? "\u00A0" : "(無題)")}
          </h1>
        ) : (
          <div className="mt-5">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[16px] text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              placeholder="タイトルを入力"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={200}
            />
          </div>
        )}

        {/* メタ＋アクション */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <Link to={`/gofile/user?id=${item?.UserId}`}>
            <img
              alt="avatar"
              className="h-8 w-8 rounded-full bg-white/5 object-cover"
              src={ProfileIcon}
            />
          </Link>
          <Link to={`?id=${item?.UserId}`}>
            <span className="text-zinc-100">{item?.User.Name}</span>
          </Link>
          <span className="opacity-50">•</span>
          <span>{item?.PlayCount.toLocaleString()} 回視聴</span>
          {item?.CreatedAt && (
            <>
              <span className="opacity-50">•</span>
              <span>{item.CreatedAt}</span>
            </>
          )}
          {/* 日時の横に配置（いいね） */}
          <span className="opacity-50">•</span>
          <button
            onClick={() => {
              if (item?.HasLike) {
                unlikeVideo(item?.Id);
              } else {
                likeVideo(item?.Id);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12]"
          >
            <span className="i-lucide-thumbs-up mr-0.5" />
            いいね {item?.LikeCount}
          </button>

          {item?.UserId === USER_ID && (
            <>
              {!isEditing ? (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={onClickEdit}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12]"
                    disabled={!item}
                  >
                    編集
                  </button>
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-xs text-blue-100 hover:bg-blue-500/30 disabled:opacity-60"
                  >
                    {saving ? "保存中…" : "保存"}
                  </button>
                  <button
                    onClick={onCancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.12] disabled:opacity-60"
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* エラー / ローディング */}
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

        {/* 説明・タグ（閲覧 or 編集） */}
        {!isEditing ? (
          <>
            {(item?.Description ||
              (item?.GofileTags && item.GofileTags.length > 0)) && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
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
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
                <p className="leading-relaxed">説明はありません。</p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="mb-2 block text-xs font-semibold text-zinc-300">
              説明
            </label>
            <textarea
              className="h-32 w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              placeholder="説明を入力"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <div className="mt-2 text-right text-xs text-zinc-400">
              {editDesc.length} 文字
            </div>
          </div>
        )}

        {/* コメント（閲覧） */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">コメント</h2>
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
