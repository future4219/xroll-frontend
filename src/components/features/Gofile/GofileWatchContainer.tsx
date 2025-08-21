import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { GofileWatchPresenter, type WatchItem } from "./GofileWatchPresenter";
import { GofileVideoRes } from "./GofileVault/types";

function toHumanDate(s?: string) {
  if (!s) return "";
  const t = s.replace(" ", "T");
  const d = new Date(t);
  if (isNaN(d.getTime())) return s;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "たった今";
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 3600 * 24) return `${Math.floor(diff / 3600)}時間前`;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function GofileWatchContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<WatchItem | undefined>(undefined);

  // resolve id from query string (?id=)
  const videoId = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get("id");
    } catch {
      return null;
    }
  }, []);

  // fetch detail only
  useEffect(() => {
    let aborted = false;
    (async () => {
      if (!videoId) {
        setError("動画IDが指定されていません");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const detail = await axios.get<GofileVideoRes>(
          `http://localhost:8000/api/gofile/video/${videoId}`,
        );
        if (aborted) return;
        const v = detail.data;
        setItem({
          id: v.id,
          title: v.name,
          mp4Url: v.video_url!,
          thumbnail: v.thumbnail_url || undefined,
          channel: v.user?.name,
          uploadedAt: toHumanDate(v.created_at),
          description:
            "ああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
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
  }, [videoId]);

  // cleanup on unmount (keep console quiet)
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

  console.log(item);
  return (
    <GofileWatchPresenter
      item={item}
      loading={loading}
      error={error}
      videoRef={videoRef}
    />
  );
}
