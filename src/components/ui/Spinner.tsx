// ① 使い回しできるスピナーを追加（ファイル先頭のimport群の下あたりに置く）
export const Spinner: React.FC<{
  message?: React.ReactNode;
  size?: number;
  full?: boolean;
}> = ({ message = "読み込み中…", size = 40, full = true }) => (
  <div
    className={
      full
        ? "flex h-screen flex-col items-center justify-center bg-black text-center"
        : "flex flex-col items-center justify-center py-4 text-center"
    }
  >
    <div
      className="animate-spin rounded-full border-4 border-white/30 border-t-white"
      style={{ width: size, height: size }}
    />
    <div className="mt-3 text-sm leading-relaxed text-white/80">{message}</div>
  </div>
);
