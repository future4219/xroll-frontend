import api from "@/lib/api";
import { useRef, useMemo, useEffect, useState } from "react";
import { GofileVideoRes } from "./GofileVault/types";
import { WatchItem, GofileWatchPresenter } from "./GofileWatchPresenter";

export function GofileWatchContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<WatchItem | undefined>(undefined);
  const [booted, setBooted] = useState(false); // ← Boot完了フラグ

  const apiUrl = import.meta.env.VITE_API_URL;
  const videoId = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get("id");
    } catch {
      return null;
    }
  }, []);

  // 1. Boot処理
  useEffect(() => {
    (async () => {
      try {
        await api.get("/auth/boot"); // Cookieにxroll_at保存される
        setBooted(true);
      } catch (e) {
        console.error("boot failed", e);
        setError("認証に失敗しました");
      }
    })();
  }, []);

  // 2. Bootが終わったあとに動画をGET
  useEffect(() => {
    if (!booted) return; // Boot完了前は待つ
    if (!videoId) {
      setError("動画IDが指定されていません");
      setLoading(false);
      return;
    }

    let aborted = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await api.get<GofileVideoRes>(
          `${apiUrl}/gofile/video/${videoId}`,
        );
        if (aborted) return;
        const v = detail.data;
        setItem({
          id: v.id,
          title: v.name,
          mp4Url: v.video_url!,
          thumbnail: v.thumbnail_url || undefined,
          channel: v.user?.name,
          uploadedAt: v.created_at,
          description:
            "あああああああああああああああああああああああああああああああああああああああああああああああああ",
          tags: (v.gofile_tags ?? []).map((t) => t.name),
          views: 80000,
          likeCount: 3424,
        });
      } catch (e: any) {
        if (!aborted) setError(e?.message || "読み込みに失敗しました");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [booted, videoId]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      const el = videoRef.current;
      if (!el) return;
      try {
        el.pause();
      } catch {}
      el.removeAttribute("src");
      el.load();
    };
  }, []);

  return (
    <GofileWatchPresenter
      item={item}
      loading={loading}
      error={error}
      videoRef={videoRef}
    />
  );
}
