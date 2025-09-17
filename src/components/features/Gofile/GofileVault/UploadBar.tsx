import { Dispatch } from "react";
import { UploadTask } from "@/lib/types";

export function UploadBar({
  queue,
  setQueue,
}: {
  queue: UploadTask[];
  setQueue: React.Dispatch<React.SetStateAction<UploadTask[]>>;
}) {
  const active = queue.filter((t) => t.status !== "error");
  if (active.length === 0) return null;
  const done = active.filter((t) => t.status === "done").length;
  const all = active.length;

  return (
    <div className="sticky top-16 z-40 w-full border-b border-amber-500/20 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-300">
          アップロード
        </span>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              style={{ width: `${Math.round((done / all) * 100)}%` }}
            />
          </div>
        </div>
        <div className="text-zinc-400">
          {done}/{all}
        </div>
        <button
          onClick={() => setQueue([])}
          className="rounded px-2 py-1 text-zinc-300 hover:bg-zinc-800"
        >
          非表示
        </button>
      </div>
    </div>
  );
}
