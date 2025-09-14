import { LayoutGrid, List } from "lucide-react";
import {
  UploadTask,
  GofileVideo,
  Visibility,
} from "@/components/features/Gofile/GofileVault/types";

// ============================== Sub Components ==============================
export function VaultTabs({
  tab,
  onChange,
  view,
  setView,
}: {
  tab: Visibility | "recent";
  onChange: (t: Visibility | "recent") => void;
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}) {
  const tabs: { key: Visibility | "recent"; label: string }[] = [
    { key: "recent", label: "最近" },
    { key: "shared", label: "共有中" },
    { key: "private", label: "非公開" },
    { key: "processing", label: "処理中" },
    { key: "failed", label: "失敗/要対応" },
  ];
  return (
    <div className="sticky top-[64px] z-40 -mx-4 border-b border-zinc-800 bg-black/80 px-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key as string}
              onClick={() => onChange(t.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${
                tab === t.key
                  ? "border-white bg-white text-black"
                  : "border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm ${
              view === "grid" ? "bg-zinc-800" : "hover:bg-zinc-900"
            }`}
            title="グリッド"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">グリッド</span>
          </button>
          <button
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm ${
              view === "list" ? "bg-zinc-800" : "hover:bg-zinc-900"
            }`}
            title="リスト"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">リスト</span>
          </button>
        </div>
      </div>
    </div>
  );
}
