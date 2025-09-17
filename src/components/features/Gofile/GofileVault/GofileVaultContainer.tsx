import React, { useEffect, useMemo, useState } from "react";
import type {
  GofileCreateRes,
  GofileVideoListRes,
  GofileVideoRes,
  UploadTask,
  GofileVideo,
  Visibility,
  GofileUpdateReq,
} from "@/lib/types";
import axios from "axios";
import { GofileVaultPresenter } from "@/components/features/Gofile/GofileVault/GofileVaultPresenter";
// 変更点のみ（ファイル先頭部）
import api from "@/lib/api";
import { setAuthTokenCookie } from "@/lib/auth";

export function GofileVaultContainer() {
  const [rawItems, setRawItems] = useState<GofileVideo[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Visibility | "recent">("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareFor, setShareFor] = useState<GofileVideo | null>(null);
  const [queue, setQueue] = useState<UploadTask[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const UPLOAD_URL = "https://upload.gofile.io/uploadfile"; // Gofile直アップロード
  const BACKEND_CREATE_URL = `${apiUrl}/gofile/create`;
  const BACKEND_LIST_BASE = `${apiUrl}/gofile`;
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // 既存：初回一覧取得（boot完了後に発火するように）
  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<GofileVideoListRes>(
          `${BACKEND_LIST_BASE}/${USER_ID}`,
        );
        const videos = (data?.videos ?? []) as GofileVideoRes[];
        const list: GofileVideo[] = videos.map(adaptVideoToGofileVideo);
        setRawItems(list);
      } catch (e) {
        console.error("GET /api/gofile/:userId failed:", e);
        setRawItems([]);
      }
    })();
  }, [USER_ID]);

  // アップロード 1件
  const uploadOne = React.useCallback(
    async (taskId: string, file: File, controller: AbortController) => {
      try {
        const fd = new FormData();
        fd.append("file", file);

        const res = await axios.post(UPLOAD_URL, fd, {
          onUploadProgress: (evt) => {
            const total = evt.total ?? file.size ?? 1;
            const pct = Math.min(100, Math.round((evt.loaded * 100) / total));
            setQueue((prev) =>
              prev.map((t) =>
                t.id === taskId
                  ? { ...t, progress: pct, status: "uploading" }
                  : t,
              ),
            );
          },
          signal: controller.signal,
          timeout: 0,
        });

        const go: { id?: string; downloadPage?: string; guestToken?: string } =
          res?.data?.data ?? {};
        setQueue((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  progress: 100,
                  status: "done",
                  gofile: {
                    fileId: go.id,
                    downloadPage: go.downloadPage,
                    directLink: undefined,
                    guestToken: go.guestToken,
                  },
                }
              : t,
          ),
        );

        // バックエンド登録
        try {
          await api
            .post<GofileCreateRes>(BACKEND_CREATE_URL, {
              name: file.name,
              gofile_id: go.id,
              tag_ids: [],
              user_id: USER_ID,
              gofile_token: go.guestToken,
            })
            .then((r) => {
              if (r?.data?.user_id)
                localStorage.setItem("userId", r.data.user_id);
            });
        } catch (e) {
          console.error("POST /api/gofile/create failed:", e);
        }

        // 再フェッチ
        try {
          if (!USER_ID) return;
          const { data } = await api.get<GofileVideoListRes>(
            `${BACKEND_LIST_BASE}/${USER_ID}`,
          );
          const videos = (data?.videos ?? []) as GofileVideoRes[];
          const list: GofileVideo[] = videos.map(adaptVideoToGofileVideo);
          setRawItems(list);
        } catch (e) {
          console.error("re-fetch list failed:", e);
        }
      } catch (err: any) {
        const isAbort = err?.code === "ERR_CANCELED";
        setQueue((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: isAbort ? "paused" : "error",
                  error: isAbort
                    ? "一時停止しました"
                    : err?.message || "アップロード失敗",
                }
              : t,
          ),
        );
      }
    },
    [],
  );

  const updateIsShared = React.useCallback(
    async (item: GofileVideo, isShared: boolean) => {
      try {
        const res = await api.patch(`${BACKEND_LIST_BASE}/update-is-shared`, {
          is_shared: isShared,
          video_id: item.Id,
        });
        if (res.status === 200) {
          setRawItems((prev) =>
            prev.map((i) =>
              i.Id === item.Id ? { ...i, IsShared: isShared } : i,
            ),
          );
          console.log("Updated share status:", isShared);
        } else {
          console.error("Failed to update share status:", res);
        }
      } catch (e) {
        console.error("PATCH /api/gofile/:id/share failed:", e);
      }
    },
    [],
  );

  const deleteVideo = React.useCallback(async (videoId: string) => {
    try {
      const res = await api.delete(`${BACKEND_LIST_BASE}/delete/${videoId}`);
      if (res.status === 200) {
        setRawItems((prev) => prev.filter((i) => i.Id !== videoId));
      } else {
        console.error("Failed to delete video:", res);
      }
    } catch (e) {
      console.error("DELETE /api/gofile/:id failed:", e);
    }
  }, []);

  // URL パラメータでアップロードダイアログ起動
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("upload") === "1") setUploadOpen(true);
    } catch {}
  }, []);

  // フィルタリング（Presenter に渡す最終 items）
  const items = useMemo(() => {
    let all = [...rawItems].sort(
      (a, b) => +new Date(b.CreatedAt!) - +new Date(a.CreatedAt!),
    );

    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) =>
      [i.Name, i.GofileTags?.join(" ") || ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rawItems, tab, query]);

  // 表示トグル（デモ）
  const onToggleVisibility = (id: string) => {
    setRawItems((prev) =>
      prev.map((it) =>
        it.Id === id
          ? {
              ...it,
              visibility: it.IsShared === false ? "private" : "shared",
            }
          : it,
      ),
    );
  };

  // アップロードキューに追加
  const onAddFiles = (files: File[]) => {
    const tasks: UploadTask[] = files.map((f) => ({
      id: `${f.name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      progress: 0,
      status: "queued",
      file: f,
    }));
    setQueue((q) => [...tasks, ...q]);
  };

  // 最大3並列でアップロード開始
  useEffect(() => {
    const running = queue.filter((t) => t.status === "uploading").length;
    const slots = Math.max(0, 3 - running);
    if (slots <= 0) return;
    const next = queue.filter((t) => t.status === "queued").slice(0, slots);
    next.forEach((t) => {
      if (!t.file) return;
      const controller = new AbortController();
      setQueue((prev) =>
        prev.map((x) =>
          x.id === t.id ? { ...x, status: "uploading", controller } : x,
        ),
      );
      uploadOne(t.id, t.file, controller);
    });
  }, [queue]);

  // 完了タスクを表示に反映（簡易）
  useEffect(() => {
    const dones = queue.filter((t) => t.status === "done");
    if (dones.length === 0) return;
    const newOnes: GofileVideo[] = dones.map((t) => ({
      Id: t.id,
      Name: t.name,
      GofileId: t.gofile?.fileId || "",
      GofileDirectUrl: t.gofile?.directLink || null,
      VideoUrl: null,
      ThumbnailUrl: null,
      Description: null,
      PlayCount: 0,
      LikeCount: 0,
      IsShared: false,
      GofileTags: [],
      GofileVideoComments: [],
      UserId: USER_ID,
      User: { Id: USER_ID || "" },
      HasLike: false,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    }));
    setRawItems((prev) => [...newOnes, ...prev]);
    setQueue((prev) => prev.filter((t) => t.status !== "done"));
  }, [queue]);

  return (
    <GofileVaultPresenter
      items={items}
      query={query}
      onQueryChange={setQuery}
      tab={tab}
      onTabChange={setTab}
      view={view}
      onViewChange={setView}
      uploadOpen={uploadOpen}
      onUploadOpen={() => setUploadOpen(true)}
      onUploadClose={() => setUploadOpen(false)}
      queue={queue}
      setQueue={setQueue}
      onAddFiles={onAddFiles}
      shareFor={shareFor}
      onOpenShare={(it) => setShareFor(it)}
      onCloseShare={() => setShareFor(null)}
      onPatchShare={(patch) =>
        setRawItems((prev) =>
          prev.map((i) =>
            shareFor && i.Id === shareFor.Id ? { ...i, ...patch } : i,
          ),
        )
      }
      onToggleVisibility={onToggleVisibility}
      updateIsShared={updateIsShared}
      deleteVideo={deleteVideo}
    />
  );
}

export const adaptVideoToGofileVideo = (v: GofileVideoRes): GofileVideo => {
  return {
    Id: v.id,
    Name: v.name,
    GofileId: v.gofile_id,
    GofileDirectUrl: v.gofile_direct_url,
    VideoUrl: v.video_url,
    ThumbnailUrl: v.thumbnail_url,
    Description: v.description,
    PlayCount: v.play_count,
    LikeCount: v.like_count,
    IsShared: v.is_shared,
    GofileTags:
      v.gofile_tags?.map((t: any) => ({ ID: t.id, Name: t.name })) || [],
    GofileVideoComments:
      v.gofile_video_comments?.map((c: any) => ({
        ID: c.id,
        Comment: c.comment,
        LikeCount: c.like_count,
        CreatedAt: c.created_at,
        UpdatedAt: c.updated_at,
      })) || [],
    UserId: v.user_id,
    User: {
      Id: v.user?.id || "",
      Name: v.user?.name || "",
      IconUrl: v.user?.icon_url || "",
      UserType: v.user?.user_type || "",
    },
    HasLike: v.has_like,
    CreatedAt: toISO(v.created_at) || "",
    UpdatedAt: toISO(v.updated_at) || "",
  };
};

const toISO = (s: string | null | undefined): string | undefined => {
  if (!s) return undefined;
  const t = s.replace(" ", "T");
  try {
    return new Date(t).toISOString();
  } catch {
    return t;
  }
};
