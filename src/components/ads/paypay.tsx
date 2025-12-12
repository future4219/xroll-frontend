import { useEffect, useMemo, useState } from "react";
import PopupManager from "@/components/ui/PopupManager";

export function XrollDonatePopup() {
  const [shouldShow, setShouldShow] = useState(false);

  const PAYPAY_LINK = "https://qr.paypay.ne.jp/p2p01_xv5ERfwKV7GAWANK";

  // 表示期間
  const start = useMemo(() => new Date("2025-12-12T00:00:00+09:00"), []);
  const end = useMemo(() => new Date("2026-01-31T23:59:59+09:00"), []);
  const now = new Date();

  if (now < start || now > end) return null;

  // ★ ここが肝
  useEffect(() => {
    setShouldShow(true);
  }, []);

  const handleDonate = () => {
    window.open(PAYPAY_LINK, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    setShouldShow(false);
  };

  if (!shouldShow) return null;

  return (
    <PopupManager enableCountdown={false} showCloseButton={false}>
      <div className="relative mx-auto max-w-md rounded-lg bg-white p-6 text-sm leading-relaxed text-gray-900 shadow-lg">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-sm text-gray-400 hover:text-gray-600"
          aria-label="閉じる"
        >
          ✕
        </button>

        <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
          開発者支援
        </div>

        <h2 className="mb-4 text-2xl font-bold leading-snug text-gray-900">
          Xrollの運営を
          <br />
          <span className="text-red-500">PayPayで応援</span>しませんか？
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          Xrollは個人開発で運営しています。
          <br />
          サーバー費・改善開発の継続のため、任意でご支援いただけると助かります。
        </p>

        <p className="mb-6 text-xs tracking-wide text-gray-400">
          ※ご支援は任意です。支援の有無で利用体験は変わりません。
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDonate}
            className="rounded-md bg-black px-6 py-2 text-sm text-white transition hover:opacity-80"
          >
            PayPayで支援する
          </button>

          <button
            onClick={handleClose}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            今はしない
          </button>
        </div>
      </div>
    </PopupManager>
  );
}
