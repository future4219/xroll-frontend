import { VisibilityBadge } from "@/components/features/Gofile/GofileVault/VisibilityBadge";
import { GofileVideo } from "@/lib/types";
import { copy, timeAgo } from "@/components/features/Gofile/GofileVault/utils";
import { BadgeCheck, Copy, Eye, EyeOff, Settings } from "lucide-react";
import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";

export function VaultGrid({
  items,
  onShare,
  onToggleVisibility,
  buildWatchHref = (it) => `/gofile/watch?id=${it.Id}`,
  updateIsShared,
  deleteVideo,
}: {
  items: GofileVideo[];
  onShare?: (it: GofileVideo) => void;
  onToggleVisibility?: (id: string) => void;
  buildWatchHref?: (it: GofileVideo) => string;
  updateIsShared?: (item: GofileVideo, isShared: boolean) => void;
  deleteVideo?: (videoId: string) => void;
}) {
  const stop: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  console.log("VaultGrid items:", items);
  const [shareConfirmModalOpen, setShareConfirmModalOpen] =
    React.useState(false);

  const [selectedItem, setSelectedItem] = React.useState<GofileVideo>({
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
    User: {
      Id: "",
      Name: "",
      Email: "",
      CreatedAt: "",
      UpdatedAt: "",
    },
    HasLike: false,
    CreatedAt: "",
    UpdatedAt: "",
  });

  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] =
    React.useState(false);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const href = buildWatchHref(it);
        return (
          <Link
            key={it.Id}
            to={href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          >
            <div className="relative">
              {it.ThumbnailUrl ? (
                <img
                  src={it.ThumbnailUrl}
                  alt={it.Name}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900" />
              )}
              {onShare && (
                <div className="absolute top-2 left-2">
                  <VisibilityBadge v={it.IsShared ? "shared" : "private"} />
                </div>
              )}
              {/* {it.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs">
                  {3}
                </span>
              )} */}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <Link to={`/gofile/user?id=${it?.UserId}`}>
                <img
                  alt="avatar"
                  className="h-full h-10 w-full w-10 rounded-full bg-white/5 object-cover"
                  src={ProfileIcon} // ここは実際の画像パスに置き換えてください
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[15px] font-medium">
                  {it.Name}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400">
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
                </div>
              </div>
              {onShare && (
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
                      onClick={(e) => {
                        stop(e);
                        setSelectedItem(it);
                        setDeleteConfirmModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                      title="削除"
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
                    copy(
                      import.meta.env.VITE_FRONTEND_URL +
                        "/gofile/watch?id=" +
                        it.Id,
                    );
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  <Copy className="h-3.5 w-3.5" /> コピー
                </button>
              )}
              {onToggleVisibility && (
                <button
                  onClick={(e) => {
                    stop(e);
                    onToggleVisibility(it.Id);
                    if (updateIsShared) {
                      setShareConfirmModalOpen(true);
                      setSelectedItem(it);
                      // updateIsShared(it, !it.isShared);
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
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
                  console.log("Updating share status for:", selectedItem);
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
                  console.log("Deleting video:", selectedItem);
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
