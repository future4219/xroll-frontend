import { useEffect, useMemo, useState } from "react";
import PopupManager from "@/components/ui/PopupManager";

export function XrollFeaturePopup() {
  const [shouldShow, setShouldShow] = useState(false);

  // 表示期間
  const start = useMemo(() => new Date("2025-09-27T00:00:00+09:00"), []);
  const end = useMemo(() => new Date("2025-10-30T23:59:59+09:00"), []);
  const now = new Date();

  if (now < start || now > end) return null;

  useEffect(() => {
    const KEY = "xroll-feature-popup-last-shown";
    const lastShown = localStorage.getItem(KEY);
    const cooldown = 6 * 60 * 60 * 1000; // 6時間クールダウン

    if (!lastShown || Date.now() - Number(lastShown) > cooldown) {
      setShouldShow(true);
    }
  }, []);

  const handleClick = () => {
    window.location.href = "/gofile/vault"; // 内部リンク or LPに差し替え
  };

  const handleClose = () => {
    localStorage.setItem("xroll-feature-popup-last-shown", String(Date.now()));
    setShouldShow(false);
  };

  if (!shouldShow) return null;

  return (
    <PopupManager enableCountdown={false} showCloseButton={false}>
      <div className="relative mx-auto max-w-md rounded-lg bg-white p-6 text-sm leading-relaxed text-gray-900 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
          新機能リリース
        </div>

        <h2 className="mb-4 text-2xl font-bold leading-snug text-gray-900">
          Xrollに動画の
          <br />
          <span className="text-red-500">投稿・検索・保管</span>
          機能が追加！
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          これまでの「リンク集」に加えて、あなた自身の動画を
          <span className="font-semibold">アップロード＆整理</span>可能に。
          <br />
          <span className="font-semibold">キーワード検索</span>や
          <span className="font-semibold">Vault保管</span>で見つけやすく、
          シェアもワンクリック。
        </p>

        <p className="mb-6 text-xs tracking-wide text-gray-400">
          先行ユーザー限定で利用開始できます。
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="rounded-md bg-black px-6 py-2 text-sm text-white transition hover:opacity-80"
          >
            今すぐ試す
          </button>
        </div>
      </div>
    </PopupManager>
  );
}
