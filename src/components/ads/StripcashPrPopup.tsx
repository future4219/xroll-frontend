import { useEffect, useState } from "react";
import PopupManager from "@/components/ui/PopupManager";

export function StripcashPrPopup() {
  const [shouldShow, setShouldShow] = useState(false);
  const now = new Date();

  // 表示期間（日本時間）
  const start = new Date("2025-06-20T20:00:00+09:00");
  const end = new Date("2025-06-26T21:00:00+09:00");

  // 期間外なら何も表示しない
  if (now < start || now > end) {
    return null;
  }

  useEffect(() => {
    const lastShown = localStorage.getItem("stripchat-popup-last-shown");
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > 3 * 60 * 60 * 1000) {
      // 3時間以上経ってたら表示
      setShouldShow(true);
    }
  }, []);

  const handleClick = () => {
    window.open(
      "https://go.rmhfrtnd.com?userId=3a43ec976d7f513c2bd3e3019041edf8c12c016056dc22074d25c7907abb93fc",
      "_blank",
    );
  };

  const handleClose = () => {
    localStorage.setItem("stripchat-popup-last-shown", String(Date.now()));
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

        {/* <p className="mb-2 text-xs font-semibold text-gray-400">
          Xrollからのお知らせ
        </p> */}
        <div className="mb-3 text-xs font-semibold tracking-wide text-gray-500">
          期間限定セール
        </div>

        <h2 className="mb-4 text-2xl font-light leading-snug text-gray-900">
          ライブチャットが
          <br />
          <span className="font-semibold text-black">最大50%オフ</span>
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          200コイン：
          <span className="ml-1 text-gray-400 line-through">$20.99</span>
          <span className="ml-2 text-base font-semibold text-black">
            $10.50
          </span>
          <br />
          新規・既存、どちらも対象。
        </p>

        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          セール期間中は女の子の大胆度も高め。
          <br />
          そしてミラクルハプニングが起こるかも？
        </p>

        <p className="mb-6 text-xs tracking-wide text-gray-400">
          開催期間：6月20日（金）～ 6月26日（木）
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="rounded-md bg-black px-6 py-2 text-sm text-white transition hover:opacity-80"
          >
            セールを詳しく見る
          </button>
        </div>
      </div>
    </PopupManager>
  );
}
