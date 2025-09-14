import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
import { adaptVideoToGofileVideo } from "@/components/features/Gofile/GofileVault/GofileVaultContainer";
import {
  GofileVideoListRes,
  GofileVideoRes,
  GofileVideo,
} from "@/components/features/Gofile/GofileVault/types";
import { GofileSearchPresenter } from "./GofileSearchPresenter";

const DEFAULT_LIMIT = 30;

type Order = "asc" | "desc";
type OrderBy = "created_at" | "updated_at" | "like_count" | "play_count";

export function GofileSearchContainer() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const BACKEND_LIST_BASE = `${apiUrl}/gofile`;

  // 取得した最新データ
  const [rawItems, setRawItems] = useState<GofileVideo[]>([]);
  // 画面に表示するデータ（取得中は差し替えない）
  const [displayItems, setDisplayItems] = useState<GofileVideo[]>([]);

  const [loading, setLoading] = useState(false); // 初回 or 先頭からの取得
  const [isRevalidating, setIsRevalidating] = useState(false); // 追加・並び替え・検索中の上書き

  // クエリ・ソート
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("updated_at");

  // ページング
  const [skip, setSkip] = useState(0);
  const [limit] = useState(DEFAULT_LIMIT);
  const [hasMore, setHasMore] = useState(true);

  // 0件メッセージ制御
  const [isEmptyForThisQuery, setIsEmptyForThisQuery] = useState(false);

  // デバウンス
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // クエリ or ソートが変わったら先頭から
  useEffect(() => {
    setSkip(0);
    setHasMore(true);
  }, [debouncedQuery, order, orderBy]);

  // レース・キャンセル対策
  const reqIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const isFirstPage = skip === 0;
      // 前のリクエストをキャンセル
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const reqId = ++reqIdRef.current;

      // ローディングフラグ
      if (isFirstPage) setLoading(true);
      else setIsRevalidating(true);

      try {
        const { data } = await api.get<GofileVideoListRes>(
          `${BACKEND_LIST_BASE}/search`,
          {
            params: {
              q: debouncedQuery || undefined,
              skip,
              limit,
              order,
              "order-by": orderBy,
            },
            signal: controller.signal as any, // axios v1 では AbortController 対応済み
          },
        );

        // 古いレスポンスは破棄
        if (reqId !== reqIdRef.current) return;

        const videos = (data?.videos ?? []) as GofileVideoRes[];
        const list = videos.map(adaptVideoToGofileVideo);

        setRawItems((prev) => (isFirstPage ? list : [...prev, ...list]));
        setHasMore(list.length === limit);

        // 0件メッセージ制御
        setIsEmptyForThisQuery(isFirstPage && list.length === 0);

        // 画面表示を差し替え（取得成功時のみ）
        setDisplayItems((prev) => (isFirstPage ? list : [...prev, ...list]));
      } catch (e: any) {
        if (e?.name !== "CanceledError" && e?.code !== "ERR_CANCELED") {
          console.error("GET /gofile/search failed:", e?.response ?? e);
          if (skip === 0) {
            // 先頭からの取得が失敗しても、直前の displayItems は維持
            setIsEmptyForThisQuery(false);
            setHasMore(false);
          }
        }
      } finally {
        if (isFirstPage) setLoading(false);
        else setIsRevalidating(false);
      }
    };

    fetch();
    // クリーンアップ（次のリクエストでキャンセル）
    return () => {
      abortRef.current?.abort();
    };
  }, [BACKEND_LIST_BASE, debouncedQuery, order, orderBy, skip, limit]);

  const items = useMemo(() => displayItems, [displayItems]);

  const handleLoadMore = () => {
    if (isRevalidating || loading || !hasMore) return;
    setSkip((s) => s + limit);
  };

  return (
    <GofileSearchPresenter
      items={items}
      loading={loading}
      revalidating={isRevalidating}
      query={query}
      onQueryChange={setQuery}
      order={order}
      orderBy={orderBy}
      onOrderChange={setOrder}
      onOrderByChange={setOrderBy}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      isEmptyForThisQuery={isEmptyForThisQuery}
    />
  );
}
