import { Copy, Settings, EyeOff, Eye } from "lucide-react";
import {
  UploadTask,
  VaultItem,
  Visibility,
} from "@/components/features/Gofile/GofileVault/types";
import { VisibilityBadge } from "./VisibilityBadge";
import {
  formatBytes,
  timeAgo,
  copy,
} from "@/components/features/Gofile/GofileVault/utils";

export function VaultList({
  items,
  onShare,
  onToggleVisibility,
}: {
  items: VaultItem[];
  onShare: (it: VaultItem) => void;
  onToggleVisibility: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03] text-zinc-300">
          <tr>
            <th className="px-3 py-2 text-left">タイトル</th>
            <th className="px-3 py-2 text-left">状態</th>
            <th className="px-3 py-2 text-left">サイズ</th>
            <th className="px-3 py-2 text-left">作成</th>
            <th className="px-3 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t border-white/5">
              <td className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded bg-zinc-800" />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-zinc-100">
                      {it.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {it.duration || "--:--"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2">
                <VisibilityBadge v={it.visibility} />
              </td>
              {/* <td className="px-3 py-2 text-zinc-300">
                {formatBytes(it.size)}
              </td> */}
              <td className="px-3 py-2 text-zinc-400">
                {timeAgo(it.createdAt!)}
              </td>
              <td className="px-3 py-2 text-right">
                <div className="inline-flex items-center gap-2">
                  {it.visibility === "shared" && it.share?.url && (
                    <button
                      onClick={() => copy(it.share?.url)}
                      className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onShare(it)}
                    className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(it.id)}
                    className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
                  >
                    {it.visibility === "shared" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
