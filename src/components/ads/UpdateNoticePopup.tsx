import { useEffect, useState } from "react";
import PopupManager from "@/components/ui/PopupManager";

export function UpdateNoticePopup() {
  const [shouldShow, setShouldShow] = useState(false);
  const now = new Date();

  // 告知の表示期間（適宜変更してな）
  const start = new Date("2025-07-01T00:00:00+09:00");
  const end = new Date("2025-07-03T23:59:59+09:00");

  if (now < start || now > end) return null;

  useEffect(() => {
    const lastShown = localStorage.getItem("update-popup-last-shown");
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > 24 * 60 * 60 * 1000) {
      // 24時間経ってたら表示
      setShouldShow(true);
    }
  }, []);

  const handleClickTweet = () => {
    window.open("https://x.com/xxxx/status/1234567890123456789", "_blank");
  };

  const handleClose = () => {
    localStorage.setItem("update-popup-last-shown", String(Date.now()));
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
          アップデート情報
        </div>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          不具合の修正と機能追加を行いました
        </h2>

        <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>
            動画カードに
            <span className="font-medium">出典ツイート</span>へのリンクを追加
          </li>
          <li>
            「いいねした動画」から遷移した際、
            <span className="font-medium">コメント数が0になる不具合</span>
            を修正
          </li>
        </ul>
      </div>
    </PopupManager>
  );
}
