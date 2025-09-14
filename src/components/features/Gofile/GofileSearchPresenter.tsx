import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { Search } from "lucide-react";
import { GofileVideo } from "@/components/features/Gofile/GofileVault/types";
import { VaultGrid } from "@/components/features/Gofile/GofileVault/VaultGrid";
import { JuicyAdsBanner } from "@/components/ads/juicyAds";

type Order = "asc" | "desc";
type OrderBy = "created_at" | "updated_at" | "like_count" | "play_count";

type Props = {
  items: GofileVideo[];
  loading: boolean; // 初回 or 先頭からの取得
  revalidating: boolean; // 追加取得やクエリ変更中の再検証

  query: string;
  onQueryChange: (v: string) => void;

  order: Order;
  orderBy: OrderBy;
  onOrderChange: (v: Order) => void;
  onOrderByChange: (v: OrderBy) => void;

  onLoadMore: () => void;
  hasMore: boolean;

  isEmptyForThisQuery: boolean; // 0件メッセージ表示
};

export function GofileSearchPresenter({
  items,
  loading,
  revalidating,
  query,
  onQueryChange,
  order,
  orderBy,
  onOrderChange,
  onOrderByChange,
  onLoadMore,
  hasMore,
  isEmptyForThisQuery,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              Search
            </div>
          </div>

          {/* 検索 */}
          <div className="ml-2 flex flex-1 items-center gap-2">
            <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="検索キーワード（タイトル / 説明 / タグ）"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* ソートUI */}
            <select
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-sm"
              value={orderBy}
              onChange={(e) => onOrderByChange(e.target.value as OrderBy)}
              aria-label="order-by"
              title="order-by"
            >
              <option value="updated_at">更新日</option>
              <option value="created_at">作成日</option>
              <option value="like_count">いいね数</option>
              <option value="play_count">再生数</option>
            </select>
            <select
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-sm"
              value={order}
              onChange={(e) => onOrderChange(e.target.value as Order)}
              aria-label="order"
              title="order"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16">
        {/* 0件メッセージ（直近のクエリ結果が空） */}
        {isEmptyForThisQuery && (
          <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
            検索条件に一致する動画が見つかりませんでした。
          </div>
        )}

        {/* グリッド */}
        {loading && items.length === 0 ? (
          // 初回のみスケルトン
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-40 w-full animate-pulse rounded bg-zinc-800"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          // ここは基本通らない（displayItemsを保持するため）
          <div className="py-10 text-center text-zinc-500">
            表示できる動画がありません。
          </div>
        ) : (
          <>
            {/* 上に薄いローディングバー（再検証中） */}
            {revalidating && (
              <div className="mb-2 h-0.5 w-full animate-pulse bg-zinc-700" />
            )}

            <VaultGrid items={items} />

            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={onLoadMore}
                disabled={!hasMore || revalidating}
                className="rounded-full border border-zinc-800 px-5 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {revalidating
                  ? "読み込み中..."
                  : hasMore
                  ? "さらに表示"
                  : "これ以上ありません"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
