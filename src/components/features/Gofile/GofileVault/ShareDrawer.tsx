import { X, LinkIcon, Copy, Hash, Clock, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { VaultItem } from "@/components/features/Gofile/GofileVault/types";
import { copy } from "./utils";

export function ShareDrawer({
  item,
  onClose,
  onUpdate,
}: {
  item: VaultItem | null;
  onClose: () => void;
  onUpdate: (patch: Partial<VaultItem>) => void;
}) {
  const [pwd, setPwd] = useState(item?.share?.password || "");
  const [enabled, setEnabled] = useState(!!item?.share?.enabled);
  const [maxPlays, setMaxPlays] = useState<number | "" | null>(
    item?.share?.maxPlays ?? "",
  );
  const [expire, setExpire] = useState<string | null>(
    item?.share?.expireAt || null,
  );

  useEffect(() => {
    setPwd(item?.share?.password || "");
    setEnabled(!!item?.share?.enabled);
    setMaxPlays(item?.share?.maxPlays ?? "");
    setExpire(item?.share?.expireAt || null);
  }, [item?.id]);

  if (!item) return null;
  const url = import.meta.env.VITE_FRONTEND_URL + "/gofile/watch?id=" + item.id;

  const save = () => {
    onUpdate({
      visibility: enabled ? "shared" : "private",
      share: {
        url,
        password: pwd || null,
        maxPlays: maxPlays === "" ? null : Number(maxPlays),
        expireAt: expire,
        enabled,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/50">
      <div className="bg-zinc-950 h-full w-full max-w-md border-l border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="font-semibold">共有設定</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">共有リンク</label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
              <LinkIcon className="h-4 w-4 text-zinc-400" />
              <input
                readOnly
                value={url}
                className="w-full bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => copy(url)}
                className="rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/40 p-3">
            <div>
              <div className="text-sm font-medium">共有を有効にする</div>
              <div className="text-xs text-zinc-400">
                非公開 ⇄ 共有 を切り替えます
              </div>
            </div>
            <button
              onClick={() => setEnabled((v) => !v)}
              className={`relative h-6 w-11 rounded-full ${
                enabled ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 ${
                  enabled ? "left-6" : "left-0.5"
                } inline-block h-5 w-5 rounded-full bg-white transition`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">
                パスワード（任意）
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                <Lock className="h-4 w-4 text-zinc-400" />
                <input
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="設定しない場合は空欄"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">
                視聴回数制限（任意）
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                <Hash className="h-4 w-4 text-zinc-400" />
                <input
                  value={maxPlays === null ? "" : String(maxPlays)}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") setMaxPlays("");
                    else if (/^\d+$/.test(v)) setMaxPlays(Number(v));
                  }}
                  placeholder="例: 5"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs text-zinc-400">
                期限（任意 / ISO日時）
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                <input
                  value={expire ?? ""}
                  onChange={(e) => setExpire(e.target.value || null)}
                  placeholder="2025-12-31T23:59:59Z"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              キャンセル
            </button>
            <button
              onClick={save}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black"
            >
              保存
            </button>
          </div>

          <div className="text-xs text-zinc-500">
            ※
            共有リンクはいつでも失効できます。拡散時は失効後に再発行してください。
          </div>
        </div>
      </div>
    </div>
  );
}
