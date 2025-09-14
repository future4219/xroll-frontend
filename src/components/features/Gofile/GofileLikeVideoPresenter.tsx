import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { Search } from "lucide-react";
import { GofileVideo } from "./GofileVault/types";
import { VaultGrid } from "./GofileVault/VaultGrid";

type GofileLikeVideoPresenterProps = {
  items: GofileVideo[];
  query: string; // 検索文字列
  onQueryChange: (v: string) => void;
};

export function GofileLikeVideoPresenter({
  items,
  query,
  onQueryChange,
}: GofileLikeVideoPresenterProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              Liked Videos
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
          </div>
        </div>
        {/* UploadBar（進捗） */}
      </header>
      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16">
        {/* ===== Channel Header (画像のUI) ===== */}
        <div className="mx-auto w-full max-w-7xl px-4  pb-16">
          {/* itemがなかったら、 */}
          {items.length === 0 ? (
            <div className="py-10 text-center text-zinc-500">
              <p>いいねした動画はまだありません。</p>
            </div>
          ) : (
            <VaultGrid items={items} />
          )}
        </div>
      </main>
    </div>
  );
}
