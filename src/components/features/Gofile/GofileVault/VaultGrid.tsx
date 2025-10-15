import { VisibilityBadge } from "@/components/features/Gofile/GofileVault/VisibilityBadge";
import { GofileVideo } from "@/lib/types";
import { copy, timeAgo } from "@/components/features/Gofile/GofileVault/utils";
import { BadgeCheck, Copy, Eye, EyeOff, Settings } from "lucide-react";
import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";

// ★ UI拡張：進捗フィールド付き
type ViewItem = GofileVideo & {
  __tempUploading?: boolean;
  __uploadTaskId?: string;
  __uploadStatus?: "queued" | "uploading" | "paused" | "error" | "done";
  __uploadProgress?: number; // 0-100
  __uploadError?: string | null;
  size?: number;
};

export function VaultGrid({
  items,
  onShare,
  onToggleVisibility,
  buildWatchHref = (it) => `/gofile/watch?id=${it.Id}`,
  updateIsShared,
  deleteVideo,
  onPauseTask,
  onResumeTask,
  onCancelTask,
}: {
  items: ViewItem[]; // ← 進捗対応型に変更
  onShare?: (it: ViewItem) => void;
  onToggleVisibility?: (id: string) => void;
  buildWatchHref?: (it: ViewItem) => string;
  updateIsShared?: (item: ViewItem, isShared: boolean) => void;
  deleteVideo?: (videoId: string) => void;
  onPauseTask?: (uploadTaskId: string) => void;
  onResumeTask?: (uploadTaskId: string) => void;
  onCancelTask?: (uploadTaskId: string) => void;
}) {
  const stop: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const [shareConfirmModalOpen, setShareConfirmModalOpen] =
    React.useState(false);

  const [selectedItem, setSelectedItem] = React.useState<ViewItem>({
    Id: "",
    Name: "",
    GofileId: "",
    GofileDirectUrl: "",
    VideoUrl: "",
    ThumbnailUrl: "",
    Description: null,
    PlayCount: 0,
    LikeCount: 0,
    IsShared: false,
    GofileTags: [],
    GofileVideoComments: [],
    UserId: null,
    User: { Id: "", Name: "", Email: "", CreatedAt: "", UpdatedAt: "" },
    HasLike: false,
    CreatedAt: "",
    UpdatedAt: "",
  });

  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] =
    React.useState(false);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {items.map((it) => {
        const href = buildWatchHref(it);
        const isTemp = !!it.__tempUploading;
        const status = it.__uploadStatus;
        const pct = it.__uploadProgress ?? 0;

        // 進捗バーの見た目（queued でも30%見せる、uploadingは最小2%）
        let barWidth = "0%";
        let barClass = "";
        let barExtra = "";
        if (isTemp) {
          if (status === "error") {
            barWidth = "100%";
            barClass = "bg-rose-500";
          } else if (status === "queued") {
            barWidth = "30%";
            barClass = "bg-gradient-to-r from-amber-500 to-orange-500";
            barExtra = "animate-pulse";
          } else {
            barWidth = `${Math.max(2, pct)}%`;
            barClass = "bg-gradient-to-r from-amber-500 to-orange-500";
          }
        }

        // ステータスバッジ（カード右上 or タイトル横どちらでもOK）
        const statusBadge = isTemp ? (
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
            {status === "queued"
              ? "待機中"
              : status === "uploading"
              ? `アップロード中 ${pct}%`
              : status === "paused"
              ? "一時停止"
              : status === "error"
              ? "エラー"
              : "処理中"}
          </span>
        ) : null;

        return (
          <Link
            key={it.Id}
            to={isTemp ? "#" : href} // アップ中は遷移しないほうが安全
            onClick={isTemp ? stop : undefined}
            className="group block rounded-none border-0 bg-transparent p-0 hover:bg-transparent
                        focus:outline-none focus:ring-0 sm:gap-3
                        sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-3
                        sm:hover:border-white/20 sm:hover:bg-white/[0.05]
                        sm:focus:ring-2 sm:focus:ring-amber-500/60"
          >
            <div className="relative overflow-hidden rounded-xl">
              {it.ThumbnailUrl ? (
                <img
                  src={it.ThumbnailUrl}
                  alt={it.Name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs text-zinc-400">
                  {isTemp ? "アップ中" : "No Thumbnail"}
                </div>
              )}

              {/* 公開/非公開バッジ（既存） */}
              {onShare && (
                <div className="absolute top-2 left-2">
                  <VisibilityBadge v={it.IsShared ? "shared" : "private"} />
                </div>
              )}

              {/* 進捗バー（サムネ下辺） */}
              {isTemp && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/40">
                  <div
                    className={`h-full ${barClass} ${barExtra} transition-[width] duration-200`}
                    style={{ width: barWidth }}
                  />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <Link
                to={`/gofile/user?id=${it?.UserId}`}
                onClick={isTemp ? stop : undefined}
              >
                <img
                  alt="avatar"
                  className="h-10 w-10 rounded-full bg-white/5 object-cover"
                  src={ProfileIcon}
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[15px] font-medium">
                  {it.Name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span>{it.User.Name}</span>
                  {(it.User.UserType == "SystemAdmin" ||
                    it.User.UserType == "OfficialUser") && (
                    <BadgeCheck
                      className="text-blue-400"
                      aria-label="verified"
                      size={16}
                    />
                  )}
                  <span className="opacity-60">•</span>
                  <span>{it.LikeCount} いいね</span>
                  <span className="opacity-60">•</span>
                  <span>{timeAgo(it.CreatedAt)}</span>

                  {/* ステータス表示（アップ中のみ） */}
                  {statusBadge}
                  {isTemp && status === "paused" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onResumeTask?.(it.__uploadTaskId!);
                      }}
                      className="ml-2 rounded-full border border-amber-500/40 px-2 py-0.5 text-[11px] text-amber-200 hover:bg-amber-500/10"
                    >
                      再開
                    </button>
                  )}

                  {isTemp && status === "uploading" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPauseTask?.(it.__uploadTaskId!);
                      }}
                      className="ml-2 rounded-full border border-zinc-600 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                    >
                      一時停止
                    </button>
                  )}
                </div>
              </div>

              {onShare && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      stop(e);
                      if (!isTemp) onShare?.(it);
                    }}
                    disabled={isTemp}
                    className={`rounded-lg p-2 ${
                      isTemp
                        ? "cursor-not-allowed border border-zinc-700 text-zinc-500"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    }`}
                    title={
                      isTemp ? "アップロード完了後に設定できます" : "共有設定"
                    }
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        stop(e);
                        if (isTemp) {
                          // ★ 一時アイテムはアップロード取り消し
                          onCancelTask?.(it.__uploadTaskId ?? it.Id);
                          return;
                        }
                        // 通常アイテムは従来どおり削除モーダル
                        setSelectedItem(it);
                        setDeleteConfirmModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                      title={isTemp ? "アップロードを取り消す" : "削除"}
                    >
                      <IoTrashOutline className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              {onShare && (
                <button
                  onClick={(e) => {
                    stop(e);
                    if (isTemp) return;
                    copy(
                      import.meta.env.VITE_FRONTEND_URL +
                        "/gofile/watch?id=" +
                        it.Id,
                    );
                  }}
                  disabled={isTemp}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                    isTemp
                      ? "cursor-not-allowed border-zinc-700 text-zinc-500"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" /> コピー
                </button>
              )}

              {onToggleVisibility && (
                <button
                  onClick={(e) => {
                    stop(e);
                    if (isTemp) return;
                    onToggleVisibility(it.Id);
                    if (updateIsShared) {
                      setShareConfirmModalOpen(true);
                      setSelectedItem(it);
                    }
                  }}
                  disabled={isTemp}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                    isTemp
                      ? "cursor-not-allowed border-zinc-700 text-zinc-500"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {it.IsShared ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> 非公開にする
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> 共有する
                    </>
                  )}
                </button>
              )}
            </div>
          </Link>
        );
      })}

      {/* 共有確認モーダル */}
      {shareConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">共有設定の確認</h3>
            <p className="mt-3 text-sm text-zinc-300">
              本当にこの動画を
              <span className="font-medium text-white">
                {selectedItem.IsShared ? "非公開" : "共有"}
              </span>
              にしますか？
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShareConfirmModalOpen(false)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                キャンセル
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateIsShared?.(selectedItem, !selectedItem.IsShared);
                  setShareConfirmModalOpen(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {deleteConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">動画削除の確認</h3>
            <p className="mt-3 text-sm text-zinc-300">
              本当にこの動画を削除しますか？
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmModalOpen(false)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                キャンセル
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteVideo?.(selectedItem.Id);
                  setDeleteConfirmModalOpen(false);
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
