import React, { useEffect, useMemo, useState } from "react";
import type {
  GofileCreateRes,
  GofileVideoListRes,
  GofileVideoRes,
  UploadTask,
  VaultItem,
  Visibility,
} from "@/components/features/Gofile/GofileVault/types";
import axios from "axios";
import { GofileVaultPresenter } from "@/components/features/Gofile/GofileVault/GofileVaultPresenter";

export function GofileVaultContainer() {
  const [rawItems, setRawItems] = useState<VaultItem[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Visibility | "recent">("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareFor, setShareFor] = useState<VaultItem | null>(null);
  const [queue, setQueue] = useState<UploadTask[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const UPLOAD_URL = "https://upload.gofile.io/uploadfile"; // Gofile直アップロード
  const BACKEND_CREATE_URL = `${apiUrl}/gofile/create`;
  const BACKEND_LIST_BASE = `${apiUrl}/gofile`;
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // 初回一覧取得
  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await axios.get<GofileVideoListRes>(
          `${BACKEND_LIST_BASE}/${USER_ID}`,
        );
        const videos = (data?.videos ?? []) as GofileVideoRes[]; // 型を確定
        const list: VaultItem[] = videos.map(adaptVideoToVaultItem);
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
          await axios
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
          const { data } = await axios.get<GofileVideoListRes>(
            `${BACKEND_LIST_BASE}/${USER_ID}`,
          );
          const videos = (data?.videos ?? []) as GofileVideoRes[];
          const list: VaultItem[] = videos.map(adaptVideoToVaultItem);
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
    async (item: VaultItem, isShared: boolean) => {
      try {
        const res = await axios.patch(
          `${BACKEND_LIST_BASE}/update-is-shared`,
          { is_shared: isShared, video_id: item.id },
        );
        if (res.status === 200) {
          setRawItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, isShared } : i)),
          );
        } else {
          console.error("Failed to update share status:", res);
        }
      } catch (e) {
        console.error("PATCH /api/gofile/:id/share failed:", e);
      }
    },
    [],
  );

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
      (a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!),
    );
    if (tab !== "recent") all = all.filter((i) => i.visibility === tab);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) =>
      [i.title, i.tags?.join(" ") || ""].join(" ").toLowerCase().includes(q),
    );
  }, [rawItems, tab, query]);

  // 表示トグル（デモ）
  const onToggleVisibility = (id: string) => {
    setRawItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              visibility: it.visibility === "shared" ? "private" : "shared",
              share:
                it.visibility === "shared"
                  ? { enabled: false }
                  : {
                      ...(it.share || {}),
                      enabled: true,
                      url: it.share?.url || `https://xfile.to/s/${id}`,
                    },
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
    const newOnes: VaultItem[] = dones.map((t) => ({
      id: t.id,
      name: t.name,
      gofile_id: t.gofile?.fileId || "",
      gofile_direct_url: t.gofile?.directLink || null,
      video_url: t.gofile?.directLink || null,
      thumbnail_url: "",
      like_count: 0,
      is_shared: false,
      gofile_tags: [],
      gofile_video_comments: [],
      user_id: USER_ID ?? null,
      user: { id: "mock", name: "mock", email: "" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: t.name,
      size: t.size,
      isShared: false,
      createdAt: new Date().toISOString(),
      visibility: "private",
      duration: "",
      thumbnail: "",
      mp4Url: t.gofile?.directLink || "",
      tags: [],
      share: { url: t.gofile?.downloadPage || "", enabled: false },
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
            shareFor && i.id === shareFor.id ? { ...i, ...patch } : i,
          ),
        )
      }
      onToggleVisibility={onToggleVisibility}
      updateIsShared={updateIsShared}
    />
  );
}

export const adaptVideoToVaultItem = (v: GofileVideoRes): VaultItem => {
  const mp4Url = v.video_url || undefined;
  const createdAtISO = v.created_at;
  return {
    ...v,
    title: v.name,
    mp4Url,
    thumbnail: v.thumbnail_url || undefined,
    createdAt: createdAtISO,
    visibility: "private",
    tags: v.gofile_tags?.map((t) => t.name) ?? [],
    isShared: v.is_shared,
    share: v.gofile_direct_url
      ? { url: v.gofile_direct_url, enabled: false }
      : undefined,
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
