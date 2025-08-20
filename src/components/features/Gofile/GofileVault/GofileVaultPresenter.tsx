import { EmptyState } from "@/components/features/Gofile/GofileVault/EmptyState";
import { ShareDrawer } from "@/components/features/Gofile/GofileVault/ShareDrawer";
import {
  GofileCreateRes,
  GofileVideoListRes,
  GofileVideoRes,
  UploadTask,
  VaultItem,
  Visibility,
} from "@/components/features/Gofile/GofileVault/types";
import { UploadBar } from "@/components/features/Gofile/GofileVault/UploadBar";
import { UploadDialog } from "@/components/features/Gofile/GofileVault/UploadDialog";
import { VaultGrid } from "@/components/features/Gofile/GofileVault/VaultGrid";
import { VaultList } from "@/components/features/Gofile/GofileVault/VaultList";
import { VaultTabs } from "@/components/features/Gofile/GofileVault/VaultTabs";
import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import axios from "axios";
import { Search, Upload } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Xfile — Vault Page (v1)
 *
 * 目的:
 *  - 非公開デフォルトのアップロード体験
 *  - 直後に "共有設定" or "Vaultで確認" を迷わず選べる導線
 *  - 最近/共有中/非公開/失敗 タブ + フィルタ/並び替え
 *  - 進捗を常時見せる UploadBar + フルスクリーン UploadDialog
 *  - 共有ドロワーで パス/期限/回数/即時失効 を設定
 *
 * NOTE: API接続は未実装。tus/S3/Gofileを繋ぐ箇所は TODO コメントを配置。
 */

// // ============================== Mock Data ==============================
// const MOCK_ITEMS: VaultItem[] = [
//   {
//     id: "i1",
//     title: "旅行Vlog_01",
//     size: 1280 * 1024 * 5,
//     createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
//     visibility: "processing",
//     duration: "8:11",
//     thumbnail:
//       "https://cold4.gofile.io/download/web/7215e03b-d93e-4628-8ca9-859bd51eabb2/thumb_e1946fc16649ead4502111c32c30d694",
//   },
//   {
//     id: "i2",
//     title: "プレゼン録画",
//     size: 1024 * 1024 * 180,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
//     visibility: "shared",
//     duration: "12:03",
//     mp4Url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
//     tags: ["業務", "共有中"],
//     share: {
//       url: "https://xfile.to/s/abc123",
//       password: null,
//       expireAt: null,
//       maxPlays: 20,
//       plays: 3,
//       enabled: true,
//     },
//   },
//   {
//     id: "i3",
//     title: "素材_clips",
//     size: 1024 * 1024 * 20,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
//     visibility: "private",
//     duration: "3:59",
//     mp4Url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
//   },
//   {
//     id: "i4",
//     title: "エンコード失敗テスト",
//     size: 1024 * 1024 * 50,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
//     visibility: "failed",
//   },
// ];

// adapters.ts などに分離してもOK。今回は Presenter 内に置いても可。

/** "2006-01-02 15:04:05" → ISO 文字列にざっくり変換（タイムゾーン無し前提） */
const toISO = (s: string | null | undefined): string | undefined => {
  if (!s) return undefined;
  // "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ss"
  const t = s.replace(" ", "T");
  // ブラウザ実装差吸収のため try
  try {
    return new Date(t).toISOString();
  } catch {
    return t;
  }
};

export const adaptVideoToVaultItem = (v: GofileVideoRes): VaultItem => {
  const mp4Url = v.video_url || undefined;
  const createdAtISO = toISO(v.created_at);
  return {
    ...v,
    title: v.name,
    mp4Url,
    thumbnail: v.thumbnail_url || undefined,
    createdAt: createdAtISO,
    visibility: "private", // 既定（共有管理は今後の機能）
    tags: v.gofile_tags?.map((t) => t.name) ?? [],
    share: v.gofile_direct_url
      ? { url: v.gofile_direct_url, enabled: false }
      : undefined,
  };
};

// ============================== Main Presenter ==============================
export function GofileVaultPresenter() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Visibility | "recent">("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareFor, setShareFor] = useState<VaultItem | null>(null);
  const [queue, setQueue] = useState<UploadTask[]>([]);

  const UPLOAD_URL = "https://upload.gofile.io/uploadfile"; // ★追加
  const BACKEND_CREATE_URL = "http://localhost:8000/api/gofile/create";
  const USER_ID = localStorage.getItem("userId") || null;
  const BACKEND_LIST_BASE = "http://localhost:8000/api/gofile"; // ユーザーIDを含むベースURL

  // 起動時に一覧取得
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<GofileVideoListRes>(
          "http://localhost:8000/api/gofile/" + USER_ID,
        );
        const list = (data?.videos ?? []).map(adaptVideoToVaultItem);
        setItems(list);
      } catch (e) {
        console.error("GET /api/gofile/user/:userId failed:", e);
        setItems([]); // フォールバック
      }
    })();
  }, []);

  // アップロード（1件）
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

        const go = res?.data?.data ?? {};
        // UI更新（完了）
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

        // バックエンドへ登録（await するが UI は既に done 済み）
        try {
          const res = await axios.post<GofileCreateRes>(BACKEND_CREATE_URL, {
            name: file.name,
            gofile_id: go.id,
            tag_ids: [], // 今は空
            user_id: USER_ID, // 認証から取得するのが正
            gofile_token: go.guestToken,
          });
          localStorage.setItem("userId", res.data.user_id!);
        } catch (e) {
          console.error("POST /api/gofile/create failed:", e);
        }

        // 登録後に一覧を再フェッチ（即時反映したい場合）
        try {
          const { data } = await axios.get<GofileVideoListRes>(
            `${BACKEND_LIST_BASE}/${USER_ID}`,
          );
          const list = (data?.videos ?? []).map(adaptVideoToVaultItem);
          setItems(list);
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
    [setQueue],
  );

  // "?upload=1" でモーダル自動起動
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("upload") === "1") setUploadOpen(true);
    } catch {}
  }, []);

  // フィルタリング
  const filtered = useMemo(() => {
    let all = [...items].sort(
      (a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!),
    );
    if (tab !== "recent") all = all.filter((i) => i.visibility === tab);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) =>
      [i.title, i.tags?.join(" ") || ""].join(" ").toLowerCase().includes(q),
    );
  }, [items, tab, query]);

  // 共有状態のトグル（デモ）
  const toggleVisibility = (id: string) => {
    setItems((prev) =>
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

  // アップロードキューに追加（ダミー）
  // 旧: file情報を持たないダミータスク生成 -> 破棄
  // 新: fileとcontroller付きでqueued投入（上限3並列で自動開始）
  const onAddFiles = (files: File[]) => {
    const tasks: UploadTask[] = files.map((f) => ({
      id: `${f.name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      progress: 0,
      status: "queued",
      file: f, // ★追加
      // controllerは開始時に付与
    }));
    setQueue((q) => [...tasks, ...q]);
  };

  // queued → uploading へ昇格して uploadOne を起動（最大3並列）
  useEffect(() => {
    const running = queue.filter((t) => t.status === "uploading").length;
    const slots = Math.max(0, 3 - running);
    if (slots <= 0) return;

    const next = queue.filter((t) => t.status === "queued").slice(0, slots);
    next.forEach((t) => {
      if (!t.file) return;
      const controller = new AbortController();
      // 先にuploadingへ（多重起動防止）
      setQueue((prev) =>
        prev.map((x) =>
          x.id === t.id ? { ...x, status: "uploading", controller } : x,
        ),
      );
      uploadOne(t.id, t.file, controller);
    });
  }, [queue, uploadOne]);

  // 完了タスクを VaultItem に反映（ダミー生成）
  useEffect(() => {
    const dones = queue.filter((t) => t.status === "done");
    if (dones.length === 0) return;
    const newOnes: VaultItem[] = dones.map((t) => ({
      id: t.id,
      name: t.name, // 既存の name を使用
      gofile_id: t.gofile?.fileId || "", // ダミー値（必要に応じて後で更新）
      gofile_direct_url: t.gofile?.directLink || null, // ダミー値（必要に応じて後で更新）
      video_url: t.gofile?.directLink || null, // ダミー値（必要に応じて後で更新）
      thumbnail_url: "", // ダミー値（必要に応じて後で更新）
      like_count: 0, // 初期は0
      gofile_tags: [], // 初期は空
      gofile_video_comments: [], // 初期は空
      user_id: USER_ID, // ユーザーID（認証から取得するのが正）
      user: {
        id: "mock", // 仮のユーザーID（認証から取得するのが正）
        name: "mock", // 仮のユーザー名
        email: "", // 仮のメールアドレス
      },
      created_at: new Date().toISOString(), // 現在時刻を使用
      updated_at: new Date().toISOString(), // 現在時刻を使用

      title: t.name,
      size: t.size,
      createdAt: new Date().toISOString(), // 現在時刻を使用
      visibility: "private", // 新規は非公開
      duration: "", // ダミー値（必要に応じて後で更新）
      thumbnail: "", // ダミー値（必要に応じて後で更新）
      mp4Url: t.gofile?.directLink || "", // ダミー値（必要に応じて後で更新）
      tags: [], // 初期は空
      share: {
        url: t.gofile?.downloadPage || "",
        enabled: false, // 初期は非共有
      },
    }));

    // 1回だけ反映→キューから削除
    setItems((prev) => [...newOnes, ...prev]);
    setQueue((prev) => prev.filter((t) => t.status !== "done"));
  }, [queue]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* ===== Header ===== */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              Vault
            </div>
          </div>

          {/* 検索 */}
          <div className="ml-2 flex flex-1 items-center gap-2">
            <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索（タイトル / タグ）"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* アップロード（モバイル=アイコン、デスクトップ=ラベル付き） */}
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md hover:from-amber-400 hover:to-orange-400 sm:hidden"
              aria-label="アップロード"
            >
              <Upload className="h-5 w-5" />
            </button>
            <button
              onClick={() => setUploadOpen(true)}
              className="hidden h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-sm font-semibold text-black shadow-md hover:from-amber-400 hover:to-orange-400 sm:inline-flex"
            >
              <Upload className="h-4 w-4" /> アップロード
            </button>
          </div>
        </div>
        {/* UploadBar（進捗） */}
        <UploadBar queue={queue} setQueue={setQueue} />
      </header>

      {/* ===== Main ===== */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-16">
        <VaultTabs tab={tab} onChange={setTab} view={view} setView={setView} />

        {filtered.length === 0 ? (
          <EmptyState onUpload={() => setUploadOpen(true)} />
        ) : view === "grid" ? (
          <VaultGrid
            items={filtered}
            onShare={(it) => setShareFor(it)}
            onToggleVisibility={toggleVisibility}
          />
        ) : (
          <VaultList
            items={filtered}
            onShare={(it) => setShareFor(it)}
            onToggleVisibility={toggleVisibility}
          />
        )}
      </main>

      {/* Mobile FAB (small screens) */}
      <button
        onClick={() => setUploadOpen(true)}
        className="fixed bottom-20 right-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-xl sm:hidden"
        aria-label="アップロード"
      >
        <Upload className="h-6 w-6" />
      </button>

      {/* Dialogs */}
      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onAddFiles={onAddFiles}
        queue={queue} // ★追加
      />

      <ShareDrawer
        item={shareFor}
        onClose={() => setShareFor(null)}
        onUpdate={(patch) =>
          setItems((prev) =>
            prev.map((i) => (i.id === shareFor?.id ? { ...i, ...patch } : i)),
          )
        }
      />
    </div>
  );
}
