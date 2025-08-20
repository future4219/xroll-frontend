import { Upload } from "lucide-react";

export function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="mx-auto mt-20 max-w-md text-center text-zinc-300">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
        <Upload className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-white">
        まだファイルがありません
      </h2>
      <p className="mt-2 text-sm">
        アップロードは非公開で開始されます。共有は後からいつでも設定できます。
      </p>
      <div className="mt-4">
        <button
          onClick={onUpload}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          アップロード
        </button>
      </div>
    </div>
  );
}
