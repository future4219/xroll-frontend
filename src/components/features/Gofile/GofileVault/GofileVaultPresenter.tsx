// =============================================
// File: GofileVaultPresenter.tsx (Presentational)
// =============================================
import React from "react";
import { Search, Upload } from "lucide-react";
import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { UploadBar } from "@/components/features/Gofile/GofileVault/UploadBar";
import { UploadDialog } from "@/components/features/Gofile/GofileVault/UploadDialog";
import { ShareDrawer } from "@/components/features/Gofile/GofileVault/ShareDrawer";
import { VaultGrid } from "@/components/features/Gofile/GofileVault/VaultGrid";
import { VaultList } from "@/components/features/Gofile/GofileVault/VaultList";
import { VaultTabs } from "@/components/features/Gofile/GofileVault/VaultTabs";
import { EmptyState } from "@/components/features/Gofile/GofileVault/EmptyState";
import type { UploadTask, GofileVideo, Visibility } from "@/lib/types";

export interface GofileVaultPresenterProps {
  items: GofileVideo[]; // 表示対象（フィルタ後）
  query: string; // 検索文字列
  onQueryChange: (v: string) => void;
  tab: Visibility | "recent"; // タブ状態
  onTabChange: (v: Visibility | "recent") => void;
  view: "grid" | "list"; // 表示切替
  onViewChange: (v: "grid" | "list") => void;

  // アップロード周り
  uploadOpen: boolean;
  onUploadOpen: () => void;
  onUploadClose: () => void;
  queue: UploadTask[];
  setQueue: React.Dispatch<React.SetStateAction<UploadTask[]>>;
  onAddFiles: (files: File[]) => void;

  // 共有／可視性
  shareFor: GofileVideo | null;
  onOpenShare: (item: GofileVideo) => void;
  onCloseShare: () => void;
  onPatchShare: (patch: Partial<GofileVideo>) => void;
  onToggleVisibility: (id: string) => void;
  updateIsShared: (item: GofileVideo, isShared: boolean) => void;
  deleteVideo: (videoId: string) => void;
}

export const GofileVaultPresenter: React.FC<GofileVaultPresenterProps> = ({
  items,
  query,
  onQueryChange,
  tab,
  onTabChange,
  view,
  onViewChange,
  uploadOpen,
  onUploadOpen,
  onUploadClose,
  queue,
  setQueue,
  onAddFiles,
  shareFor,
  onOpenShare,
  onCloseShare,
  onPatchShare,
  onToggleVisibility,
  updateIsShared,
  deleteVideo,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* ===== Header ===== */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              Vault
            </div>
          </div>

          {/* 検索 */}
          <div className="ml-2 flex flex-1 items-center gap-2">
            <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="検索（タイトル / タグ）"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* アップロード（モバイル=アイコン、デスクトップ=ラベル付き） */}
            <button
              onClick={onUploadOpen}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md hover:from-amber-400 hover:to-orange-400 sm:hidden"
              aria-label="アップロード"
            >
              <Upload className="h-5 w-5" />
            </button>
            <button
              onClick={onUploadOpen}
              className="hidden h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-sm font-semibold text-black shadow-md hover:from-amber-400 hover:to-orange-400 sm:inline-flex"
            >
              <Upload className="h-4 w-4" /> アップロード
            </button>
          </div>
        </div>
        {/* UploadBar（進捗） */}
        <UploadBar queue={queue} setQueue={setQueue} />
      </header>

      {/* ===== Main ===== */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-16">
        <VaultTabs
          tab={tab}
          onChange={onTabChange}
          view={view}
          setView={onViewChange}
        />

        {items.length === 0 ? (
          <EmptyState onUpload={onUploadOpen} />
        ) : view === "grid" ? (
          <VaultGrid
            items={items}
            onShare={onOpenShare}
            onToggleVisibility={onToggleVisibility}
            updateIsShared={updateIsShared}
            deleteVideo={deleteVideo}
          />
        ) : (
          <VaultList
            items={items}
            onShare={onOpenShare}
            onToggleVisibility={onToggleVisibility}
          />
        )}
      </main>

      {/* Mobile FAB (small screens) */}
      <button
        onClick={onUploadOpen}
        className="fixed bottom-20 right-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-xl sm:hidden"
        aria-label="アップロード"
      >
        <Upload className="h-6 w-6" />
      </button>

      {/* Dialogs */}
      <UploadDialog
        open={uploadOpen}
        onClose={onUploadClose}
        onAddFiles={onAddFiles}
        queue={queue}
      />

      <ShareDrawer
        item={shareFor}
        onClose={onCloseShare}
        onUpdate={onPatchShare}
      />
    </div>
  );
};
