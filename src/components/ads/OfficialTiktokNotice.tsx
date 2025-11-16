import { useEffect, useState } from "react";
import PopupManager from "@/components/ui/PopupManager";

export function OfficialTiktokNotice() {
  const [shouldShow, setShouldShow] = useState(false);
  const now = new Date();

  // 表示期間（必要に応じて変更）
  const start = new Date("2025-11-16T00:00:00+09:00");
  const end = new Date("2025-11-20T23:59:59+09:00");

  // 期間外なら何も表示しない
  if (now < start || now > end) return null;

  // 一度でも表示したら出さない
  useEffect(() => {
    const alreadyShown = localStorage.getItem("tiktok-popup-last-shown");
    if (!alreadyShown) {
      setShouldShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("tiktok-popup-last-shown", "true");
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

        <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500">
          お知らせ
        </div>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Xroll 公式 TikTok アカウントができました！
        </h2>

        <p className="mb-4 text-sm text-gray-700">
          最新情報をアップデートするので、ぜひフォローしてください！
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>ショート動画でXrollの人気投稿を毎日更新</li>
          <li>アプリ開発の裏側やアップデート情報も投稿予定</li>
          <li>TikTok限定の動画企画も準備中！</li>
        </ul>

        <a
          href="https://www.tiktok.com/@xroll_developer"
          target="_blank"
          className="block w-full rounded-md bg-black py-2 text-center text-white transition hover:bg-gray-800"
        >
          TikTok を見る
        </a>
      </div>
    </PopupManager>
  );
}
