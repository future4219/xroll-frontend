import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  isActive: boolean;
  prewarm: boolean;
};

export const STRIPCHAT_AD_SRC =
  "https://creative.rmhfrtnd.com/widgets/Player?tag=girls%2Fasian&autoplay=all&thumbFit=contain&userId=3a43ec976d7f513c2bd3e3019041edf8c12c016056dc22074d25c7907abb93fc";

function Spinner() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
    </div>
  );
}

export default function StripchatReelAd({ isActive, prewarm }: Props) {
  const deviceClass = useMemo(() => {
    const ua = navigator.userAgent;
    if (
      ua.indexOf("iPhone") > 0 ||
      ua.indexOf("iPod") > 0 ||
      (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)
    ) {
      return "safari-bottom-fix";
    }
    return "";
  }, []);

  // 先読みが来たら一回だけマウント許可（＝裏でロード開始）
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (prewarm && !mounted) setMounted(true);
  }, [prewarm, mounted]);

  // 表示中iframe(表) と 裏でロードするiframe(裏) のキー
  const [frontKey, setFrontKey] = useState(0);
  const [backKey, setBackKey] = useState<number | null>(null);

  // ロード状態
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  // どっちを表示するか
  const [showFront, setShowFront] = useState(true);

  // 「戻ってきた」検知
  const wasActiveRef = useRef(false);

  // 戻ってきたら裏iframeを作ってロード開始（ここでは暗転させない）
  useEffect(() => {
    const wasActive = wasActiveRef.current;

    if (!wasActive && isActive) {
      // 裏を作る（同時に複数作らないように）
      setBackLoaded(false);
      setBackKey((k) => (k === null ? frontKey + 1 : k + 1));
    }

    wasActiveRef.current = isActive;
  }, [isActive, frontKey]);

  // 裏がロードできたらスワップ（暗転なし）
  useEffect(() => {
    if (!isActive) return;
    if (backKey === null) return;
    if (!backLoaded) return;

    // ここで前後を入れ替え
    setFrontKey(backKey);
    setFrontLoaded(true); // 裏がロード済み＝新frontはロード済み扱い
    setBackKey(null);
    setBackLoaded(false);
    setShowFront(true);
  }, [backLoaded, backKey, isActive]);

  const [viewers, setViewers] = useState<string>(() => randomViewers());

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const base = parseFloat(prev.replace("K", ""));
        // ±0.1 の範囲で変動
        let next = base + (Math.random() - 0.5) * 0.2;
        next = Math.min(3.9, Math.max(2.0, next));
        return `${next.toFixed(1)}K`;
      });
    }, 7000); // 7秒おき（ちょうどいい）

    return () => clearInterval(interval);
  }, []);


  // 表示制御：active のときだけ見せる（inactiveでも消さず opacity）
  const visible = isActive && frontLoaded;

  return (
    <div
      className={`${deviceClass} relative flex h-[100dvh] snap-start items-center justify-center bg-black`}
    >
      <div className="relative h-full w-full bg-black">
        <div className="mx-auto h-full w-full max-w-[480px]">
          <div className="relative h-full w-full overflow-hidden bg-black">
            {!mounted && <div className="h-full w-full bg-black" />}

            {mounted && (
              <>
                {/* 表（表示用） */}
                <iframe
                  key={frontKey}
                  src={STRIPCHAT_AD_SRC}
                  className="absolute inset-0 h-full w-full"
                  style={{
                    border: 0,
                    display: "block",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 120ms ease",
                    pointerEvents: visible ? "auto" : "none",
                  }}
                  allow="autoplay; fullscreen"
                  scrolling="no"
                  onLoad={() => setFrontLoaded(true)}
                />

                {/* 裏（プリロード用：画面には出さない） */}
                {backKey !== null && (
                  <iframe
                    key={backKey}
                    src={STRIPCHAT_AD_SRC}
                    className="absolute -left-[99999px] top-0 h-[1px] w-[1px]"
                    style={{ border: 0 }}
                    allow="autoplay; fullscreen"
                    scrolling="no"
                    onLoad={() => setBackLoaded(true)}
                  />
                )}

                {/* 初回だけロード待ちの時はスピナー（暗転というより最初だけ） */}
                {isActive && !frontLoaded && <Spinner />}
              </>
            )}
          </div>
        </div>
        {visible && <LiveCTA />}

        <div className="absolute right-4 bottom-1 z-30 flex items-center gap-2">
          <span className="pointer-events-none rounded-md bg-gradient-to-r from-pink-500 to-red-600 px-2 py-1 text-[11px] font-extrabold tracking-wide text-white shadow">
            LIVE
          </span>

          <span className="rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white shadow">
            {viewers} 視聴中
          </span>
        </div>
      </div>
    </div>
  );
}

function LiveCTA() {
  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-40 -translate-x-1/2">
      <div className="bg-white/12 flex max-w-[92vw] items-center gap-3 rounded-full border border-white/60 px-6 py-3 backdrop-blur-md">
        <EqualizerBig />
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold tracking-wide text-white">
          クリックしてLIVEを楽しもう
        </span>
      </div>
    </div>
  );
}

function EqualizerBig() {
  return (
    <div className="flex h-5 items-end gap-[3px]">
      <span className="eq-bar eq-1" />
      <span className="eq-bar eq-2" />
      <span className="eq-bar eq-3" />
    </div>
  );
}

function randomViewers() {
  // 2.0〜3.9 の範囲
  const v = 2 + Math.random() * 1.9;
  return `${v.toFixed(1)}K`;
}
