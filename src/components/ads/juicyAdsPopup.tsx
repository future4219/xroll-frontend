import React, { useEffect, useState } from "react";
import AdBanner from "@/components/ads/juicyAds";

const JuicyAdsPopup = () => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    if (countdown === 0) {
      setCanClose(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, visible]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-1/2 z-[9999] flex -translate-x-1/2 -translate-y-1/2 flex-col items-end">
      <div className="mb-1 mr-1">
        {canClose ? (
          <button
            onClick={() => setVisible(false)}
            className="flex h-3 w-3 items-center justify-center  text-[10px] font-bold text-black shadow-md hover:bg-gray-200"
          >
            ✕
          </button>
        ) : (
          <div className="rounded bg-black/80 px-2 py-0.5 text-xs text-white shadow-md">
            {countdown}秒後に閉じれます
          </div>
        )}
      </div>

      <AdBanner />
    </div>
  );
};

export default JuicyAdsPopup;
