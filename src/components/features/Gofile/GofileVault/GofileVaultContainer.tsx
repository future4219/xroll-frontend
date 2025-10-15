import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  GofileCreateRes,
  GofileVideoListRes,
  GofileVideoRes,
  UploadTask,
  GofileVideo,
  Visibility,
  GofileUpdateReq,
  GofileVideoView,
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
  // 置き換え（useMemo 部分）
  const items = useMemo<GofileVideoView[]>(() => {
    // API 由来（実アイテム）
    const base: GofileVideoView[] = [...rawItems]
      .sort((a, b) => +new Date(b.CreatedAt!) - +new Date(a.CreatedAt!))
      .map((v) => ({ ...v })); // as GofileVideoView でもOK

    // 進行中タスク → 仮アイテム化（done は除外。error は残す／消すは好みで）
    const tempFromQueue: GofileVideoView[] = queue
      .filter((t) => t.status !== "done")
      .map((t) => ({
        Id: t.id, // 一意キーは task.id（サーバIDではない）
        Name: t.name,
        GofileId: "",
        GofileDirectUrl: null,
        VideoUrl: null,
        ThumbnailUrl: null,
        Description: null,
        PlayCount: 0,
        LikeCount: 0,
        IsShared: false,
        GofileTags: [],
        GofileVideoComments: [],
        UserId: USER_ID || "",
        User: { Id: USER_ID || "" },
        HasLike: false,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        // ▼ UI専用
        __tempUploading: true,
        __uploadTaskId: t.id,
        __uploadStatus: t.status,
        __uploadProgress: t.progress ?? 0,
        __uploadError: t.error ?? null,
        size: t.file?.size,
        // previewUrl: t.previewUrl, // 使うなら UploadTask に追加して渡す
      }));

    const merged = [...tempFromQueue, ...base];

    // 検索（タグ名で引っかかるように修正）
    const q = query.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((i) =>
      [
        i.Name,
        ...(Array.isArray(i.GofileTags)
          ? (i.GofileTags as any[]).map((x) => x?.Name || "")
          : []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rawItems, queue, query, USER_ID]);

  // 置き換え（onToggleVisibility）
  const onToggleVisibility = async (id: string) => {
    const item = rawItems.find((it) => it.Id === id);
    if (!item) return;
    const next = !item.IsShared;

    // 楽観的更新（UI先行→失敗なら戻す）
    setRawItems((prev) =>
      prev.map((it) => (it.Id === id ? { ...it, IsShared: next } : it)),
    );
    try {
      await updateIsShared(item, next);
    } catch {
      setRawItems((prev) =>
        prev.map((it) => (it.Id === id ? { ...it, IsShared: !next } : it)),
      );
    }
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

  //////////////// Chatgptがかいたが、理解できてない(アップロード中だった動画の復元するための実装) //////////////////////////
  // UploadTask の status ユニオンを使う
  type UploadStatus = "queued" | "uploading" | "paused" | "error" | "done";

  // localStorage に保存する軽量版（File, controller は保存しない）
  type StoredTask = Omit<UploadTask, "file" | "controller" | "status"> & {
    status: string; // 保存時は string になっている想定
  };

  // 許可ステータス判定
  const isStatus = (s: any): s is UploadStatus =>
    s === "queued" ||
    s === "uploading" ||
    s === "paused" ||
    s === "error" ||
    s === "done";

  // 文字列を UploadStatus に正規化（不正値は "paused" に寄せる等）
  const normalizeStatus = (s: string): UploadStatus =>
    isStatus(s) ? s : "paused";

  // --- 保存 ---
  const saveQueue = (queue: UploadTask[]) => {
    const dump: StoredTask[] = queue.map(({ file, controller, ...rest }) => ({
      ...rest,
      // status は string で保存されてもOK（復元時に正規化する）
      status: rest.status,
    }));
    localStorage.setItem("xfile.uploadQueue", JSON.stringify(dump));
  };

  // --- 復元 ---
  const loadQueue = (): UploadTask[] => {
    const raw = localStorage.getItem("xfile.uploadQueue");
    if (!raw) return [];
    try {
      const saved = JSON.parse(raw) as StoredTask[];
      const recovered: UploadTask[] = saved.map((t) => ({
        ...t,
        file: undefined,
        controller: undefined,
        // "uploading" だったものはページ再読込後は実際には止まっているので "paused" に寄せる
        status:
          normalizeStatus(t.status) === "uploading"
            ? ("paused" as const)
            : normalizeStatus(t.status),
        // 進捗・エラーはそのまま
        progress: typeof t.progress === "number" ? t.progress : 0,
      }));
      return recovered;
    } catch {
      return [];
    }
  };

  // 復元（初回マウント時）
  useEffect(() => {
    const recovered = loadQueue();
    if (recovered.length) setQueue(recovered); // ← 型OK（UploadTask[]）
  }, []);

  // 変更のたび保存
  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  const pauseTask = (taskId: string) => {
    setQueue((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        try {
          t.controller?.abort();
        } catch {}
        return { ...t, controller: undefined, status: "paused" as const };
      }),
    );
  };

  const resumeTask = (taskId: string, file?: File) => {
    const t = queue.find((x) => x.id === taskId);
    if (!t) return;

    // リロード後など file が無い場合は再選択が必要
    const useFile = file ?? t.file;
    if (!useFile) {
      // ここでは「ファイル選択を促す」UIへ委譲（下の 3) を参照）
      // 例: setPendingResumeTaskId(taskId); openFilePicker();
      return;
    }

    const controller = new AbortController();
    setQueue((prev) =>
      prev.map((x) =>
        x.id === taskId
          ? { ...x, controller, file: useFile, status: "uploading" }
          : x,
      ),
    );
    console.log("Resuming upload for task:", taskId);

    // 既存の uploadOne を再利用
    uploadOne(taskId, useFile, controller);
  };

  // 全部再開（file があるものだけ）
  const resumeAll = () => {
    queue
      .filter((t) => t.status === "paused" && t.file)
      .forEach((t) => resumeTask(t.id));
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingResumeTaskId, setPendingResumeTaskId] = useState<string | null>(
    null,
  );

  const askFileAndResume = (taskId: string) => {
    setPendingResumeTaskId(taskId);
    fileInputRef.current?.click();
  };

  const onPickResumeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // 次回も同名でトリガーできるようクリア
    if (!f || !pendingResumeTaskId) return;

    // （任意）名前やサイズでのざっくり検証
    const t = queue.find((q) => q.id === pendingResumeTaskId);
    if (t && t.size && f.size !== t.size) {
      alert(
        "ファイルサイズが元のタスクと異なります。正しいファイルを選んでください。",
      );
      return;
    }
    resumeTask(pendingResumeTaskId, f);
    setPendingResumeTaskId(null);
  };

  const cancelTask = (taskId: string) => {
    setQueue((prev) => {
      const t = prev.find((x) => x.id === taskId);
      try {
        t?.controller?.abort();
      } catch {}
      return prev.filter((x) => x.id !== taskId);
    });
  };

  ////////////////////////////////////////////////////////

  return (
    <>
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
        onResumeTask={(id) => {
          const t = queue.find((q) => q.id === id);
          if (t?.file) resumeTask(id);
          else askFileAndResume(id);
        }}
        onPauseTask={pauseTask}
        onCancelTask={cancelTask} // ← 追加
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={onPickResumeFile}
      />
      ;
    </>
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
        GofileVideoID: c.gofile_video_id,
        UserID: c.user_id,
        User: adaptVideoToGofileVideo(c.user),
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
