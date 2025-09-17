import api from "@/lib/api";
import { useRef, useMemo, useEffect, useState } from "react";
import {
  GofileUpdateReq,
  GofileVideo,
  GofileVideoRes,
  GofileVideoResToGofileVideo,
} from "../../../../lib/types";
import { GofileWatchPresenter } from "./GofileWatchPresenter";
import React from "react";

export function GofileWatchContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<GofileVideo | undefined>(undefined);
  const [booted, setBooted] = useState(false); // ← Boot完了フラグ

  const apiUrl = import.meta.env.VITE_API_URL;
  const BACKEND_LIST_BASE = `${apiUrl}/gofile`;

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
        console.log("Fetched video detail:", detail);
        if (aborted) return;
        const v = detail.data;
        setItem(GofileVideoResToGofileVideo(v));
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

  const updateVideo = React.useCallback(async (item: GofileVideo) => {
    const update: GofileUpdateReq = {
      name: item.Name,
      description: item.Description || "",
      is_shared: item.IsShared,
      tag_ids: item.GofileTags?.map((t) => t.ID) || [],
    };

    try {
      const res = await api.patch(
        `${BACKEND_LIST_BASE}/update/${item.Id}`,
        update,
      );
      if (res.status === 200) {
        setItem((prev) => (prev?.Id === item.Id ? { ...prev, ...item } : prev));
        console.log("Updated video:", item.Id, item);
      } else {
        console.error("Failed to update video:", res);
      }
    } catch (e) {
      console.error("PATCH /api/gofile/:id failed:", e);
    }
  }, []);

  const likeVideo = React.useCallback(async (videoId: string | undefined) => {
    try {
      const res = await api.post(`${BACKEND_LIST_BASE}/like/${videoId}`);
      if (res.status === 200) {
        setItem((prev) =>
          prev && prev.Id === videoId
            ? { ...prev, LikeCount: (prev.LikeCount || 0) + 1, HasLike: true }
            : prev,
        );
        console.log("Liked video:", videoId);
      } else {
        console.error("Failed to like video:", res);
      }
    } catch (e) {
      console.error("POST /api/gofile/like/:id failed:", e);
    }
  }, []);

  const unlikeVideo = React.useCallback(async (videoId: string | undefined) => {
    if (videoId === undefined) return;
    try {
      const res = await api.post(`${BACKEND_LIST_BASE}/unlike/${videoId}`);
      if (res.status === 200) {
        setItem((prev) =>
          prev && prev.Id === videoId
            ? {
                ...prev,
                LikeCount: Math.max((prev.LikeCount || 1) - 1, 0),
                HasLike: false,
              }
            : prev,
        );
        console.log("Unliked video:", videoId);
      } else {
        console.error("Failed to unlike video:", res);
      }
    } catch (e) {
      console.error("POST /api/gofile/unlike/:id failed:", e);
    }
  }, []);

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
      updateVideo={updateVideo}
      likeVideo={likeVideo}
      unlikeVideo={unlikeVideo}
    />
  );
}
