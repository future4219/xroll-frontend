import { X, Upload, CheckCircle2, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { UploadTask } from "@/lib/types";
import { formatBytes } from "@/components/features/Gofile/GofileVault/utils";

export function UploadDialog({
  open,
  onClose,
  onAddFiles,
  queue,
}: {
  open: boolean;
  onClose: () => void;
  onAddFiles: (files: File[]) => void;
  queue: UploadTask[];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ステージ中のファイル
  const [local, setLocal] = useState<
    Array<{ id: string; name: string; size: number; file: File }>
  >([]);

  // どのファイルを「アップロード開始」したかを記録（name+size でキー化）
  const startedKeys = useRef<Set<string>>(new Set());
  const [startedOnce, setStartedOnce] = useState(false);
  const keyOf = (n: string, s: number) => `${n}__${s}`;

  useEffect(() => {
    if (!open) {
      setLocal([]);
      startedKeys.current.clear();
      setStartedOnce(false);
    }
  }, [open]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith("video/"));

    if (validFiles.length < files.length) {
      alert("動画ファイル（mp4, mov, avi など）のみアップロードできます。");
    }

    const staged = validFiles.map((f) => ({
      id: `${f.name}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      file: f,
    }));
    setLocal((l) => [...staged, ...l]);
  };

  // 行ごとの完了判定：開始済み かつ （queue上でdone もしくは queueから消えている）
  const isDone = (name: string, size: number) => {
    const k = keyOf(name, size);
    if (!startedKeys.current.has(k)) return false; // 未開始なら完了扱いしない
    const q = queue.find((qq) => qq.name === name && qq.size === size);
    return !q || q.status === "done";
  };

  // アップロード開始：未開始のものだけキュー投入
  const startUpload = () => {
    const targets = local.filter(
      (l) => !startedKeys.current.has(keyOf(l.name, l.size)),
    );
    if (targets.length === 0) return;
    targets.forEach((t) => startedKeys.current.add(keyOf(t.name, t.size)));
    setStartedOnce(true);
    onAddFiles(targets.map((t) => t.file));
  };

  // 「全て完了したら」アップロードボタンを無効化
  const allDone =
    local.length > 0 && local.every((l) => isDone(l.name, l.size));
  const uploadDisabled = local.length === 0 || (startedOnce && allDone);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-950 w-full max-w-2xl rounded-2xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="font-semibold">アップロード</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="m-4 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center"
        >
          <Upload className="mx-auto h-8 w-8 text-zinc-400" />
          <div className="mt-2 text-sm text-zinc-300">
            ファイルをドラッグ＆ドロップ
          </div>
          <div className="text-xs text-zinc-500">または</div>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black"
          >
            ファイルを選ぶ
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="video/*" // ★動画ならOK（mp4, mov など）
            onChange={(e) =>
              e.target.files && handleFiles(Array.from(e.target.files))
            }
            className="hidden"
          />
          <div className="mt-4 text-xs text-zinc-400">
            アップロードは{" "}
            <span className="font-semibold text-white">非公開</span>{" "}
            で開始されます。共有は後から設定できます。
          </div>
        </div>

        {local.length > 0 && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {local.map((t) => {
                const q = queue.find(
                  (qq) => qq.name === t.name && qq.size === t.size,
                );
                const pct = q ? q.progress : 0;
                const done = isDone(t.name, t.size);
                const barClass =
                  q?.status === "error"
                    ? "bg-rose-500"
                    : q?.status === "done"
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500";

                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 p-3"
                  >
                    {/* サムネイル部分 */}
                    {t.file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(t.file)}
                        alt={t.name}
                        className="h-10 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-500">
                        {t.file.type.split("/")[0].toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-zinc-200">
                        {t.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {formatBytes(t.size)}
                      </div>

                      {/* 進捗 or 完了表示 */}
                      {!done ? (
                        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-zinc-800">
                          <div
                            className={`h-full ${barClass}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      ) : (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-500">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          完了
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setLocal((l) => l.filter((x) => x.id !== t.id))
                      }
                      className="rounded p-2 text-zinc-400 hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            閉じる
          </button>
          <button
            onClick={startUpload}
            disabled={uploadDisabled}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              uploadDisabled
                ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                : "bg-white text-black"
            }`}
          >
            アップロード
          </button>
        </div>
      </div>
    </div>
  );
}
