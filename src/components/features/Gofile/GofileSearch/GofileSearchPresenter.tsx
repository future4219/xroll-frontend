import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { Search } from "lucide-react";
import { GofileVideo } from "@/lib/types";
import { VaultGrid } from "@/components/features/Gofile/GofileVault/VaultGrid";
import { JuicyAdsBanner } from "@/components/ads/juicyAds";

type Order = "asc" | "desc";
type OrderBy = "created_at" | "updated_at" | "like_count" | "play_count";

type Props = {
  items: GofileVideo[];
  loading: boolean;
  revalidating: boolean;

  query: string;
  onQueryChange: (v: string) => void;

  order: Order;
  orderBy: OrderBy;
  onOrderChange: (v: Order) => void;
  onOrderByChange: (v: OrderBy) => void;

  onLoadMore: () => void;
  hasMore: boolean;

  isEmptyForThisQuery: boolean;
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
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-sm font-semibold tracking-tight sm:text-[15px]">
              Search
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-3 pt-20 pb-16 sm:px-4 sm:pt-24">
        {/* Search + Sort */}
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-3">
          {/* Search box */}
          <label className="sr-only" htmlFor="search-input">
            検索
          </label>
          <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 sm:px-4 sm:py-2">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              id="search-input"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="検索キーワード（タイトル / 説明 / タグ）"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </div>

          {/* Sort UI (stacks on mobile) */}
          <div className="flex w-full gap-2 sm:w-auto">
            <label className="sr-only" htmlFor="order-by">
              並び替え項目
            </label>
            <select
              id="order-by"
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1.5 text-sm sm:w-auto"
              value={orderBy}
              onChange={(e) => onOrderByChange(e.target.value as OrderBy)}
              aria-label="order-by"
            >
              <option value="updated_at">更新日</option>
              <option value="created_at">作成日</option>
              <option value="like_count">いいね数</option>
              <option value="play_count">再生数</option>
            </select>

            <label className="sr-only" htmlFor="order">
              並び順
            </label>
            <select
              id="order"
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1.5 text-sm sm:w-auto"
              value={order}
              onChange={(e) => onOrderChange(e.target.value as Order)}
              aria-label="order"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>

        {/* 0件メッセージ（直近のクエリ結果が空） */}
        {isEmptyForThisQuery && (
          <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300 sm:mb-4">
            検索条件に一致する動画が見つかりませんでした。
          </div>
        )}

        {/* Grid / Skeleton */}
        {loading && items.length === 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video w-full animate-pulse rounded-xl bg-zinc-800"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-zinc-500">
            表示できる動画がありません。
          </div>
        ) : (
          <>
            {/* Revalidating bar */}
            {revalidating && (
              <div className="mb-2 h-0.5 w-full animate-pulse bg-zinc-700" />
            )}

            {/* Optional ad banner for larger screens */}
            {/* <div className="my-4 hidden justify-center sm:flex">
              <JuicyAdsBanner />
            </div> */}

            <VaultGrid items={items} />

            <div className="mt-6 flex items-center justify-center sm:mt-8">
              <button
                onClick={onLoadMore}
                disabled={!hasMore || revalidating}
                className="w-full whitespace-nowrap rounded-full border border-zinc-800 px-5 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
