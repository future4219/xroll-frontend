// components/PopupManager.tsx
import React, { ReactNode, useEffect, useState } from "react";

type PopupManagerProps = {
  children: ReactNode;
  initialDelay?: number; // マウント後に表示するまでの遅延（秒）
  enableCountdown?: boolean; // カウントダウンUIを有効にするか
  countdownSeconds?: number; // カウントダウン秒数
  showCloseButton?: boolean; // ✕ボタンを表示するか
};

const PopupManager: React.FC<PopupManagerProps> = ({
  children,
  initialDelay = 0,
  enableCountdown = true,
  countdownSeconds = 5,
  showCloseButton = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [canClose, setCanClose] = useState(!enableCountdown);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      if (enableCountdown) {
        setCountdown(countdownSeconds);
        setCanClose(false);
      }
    }, initialDelay * 1000);
    return () => clearTimeout(showTimer);
  }, [initialDelay, enableCountdown, countdownSeconds]);

  useEffect(() => {
    if (!visible || !enableCountdown) return;
    if (countdown <= 0) {
      setCanClose(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [visible, enableCountdown, countdown]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto relative rounded-xl p-4 shadow-lg">
          {/* ✕ボタンやカウントダウン表示部分 */}
          {showCloseButton && (
            <div className="absolute right-4 top-2">
              {canClose ? (
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              ) : (
                enableCountdown && (
                  <span className="rounded bg-black/80 px-2 py-1 text-xs text-white">
                    {countdown}秒後に閉じれます
                  </span>
                )
              )}
            </div>
          )}

          {/* ポップアップする子コンポーネント */}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PopupManager;
