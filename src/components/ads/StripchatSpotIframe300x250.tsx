import React, { useEffect, useState } from "react";

const STRIPCHAT_IFRAME_URL =
  "https://creative.mavrtracktor.com/widgets/Player?tag=girls&autoplay=all&hideLiveBadge=1&userId=3a43ec976d7f513c2bd3e3019041edf8c12c016056dc22074d25c7907abb93fc";

// 👇 こっちが「本体に飛ばす用」

function randomViewers() {
  const v = 2 + Math.random() * 1.9; // 2.0〜3.9K
  return `${v.toFixed(1)}K`;
}

export function StripchatSpotIframe300x250() {
  const [viewers, setViewers] = useState(() => randomViewers());

  // 視聴人数をゆっくり変動
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((prev) => {
        const base = parseFloat(prev.replace("K", ""));
        let next = base + (Math.random() - 0.5) * 0.2;
        next = Math.min(3.9, Math.max(2.0, next));
        return `${next.toFixed(1)}K`;
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[250px] w-[300px] overflow-hidden rounded-xl bg-black">
      {/* iframe本体 */}
      <iframe
        key={"stripchat-spot-300x250"}
        src={STRIPCHAT_IFRAME_URL}
        className="h-full w-full"
        style={{ border: 0, display: "block", pointerEvents: "auto" }}
        allow="autoplay; fullscreen"
        scrolling="no"
      />

      {/* ✅ LIVEタグ（左下） */}
      <div className="pointer-events-none absolute left-2 top-2 z-30 flex items-center gap-1.5">
        <span className="rounded bg-red-600 px-1.5 py-[3px] text-[10px] font-bold leading-none text-white shadow">
          LIVE
        </span>

        <span className="rounded bg-black/70 px-1.5 py-[3px] text-[10px] font-bold leading-none text-white shadow">
          {viewers} 視聴中
        </span>
      </div>
      {/* ✅ CTA（下中央） */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/50 bg-black/30 px-4 py-2 backdrop-blur-md">
          <Equalizer />
          <span className="whitespace-nowrap text-[11px] font-semibold text-white">
            クリックしてLIVEを楽しもう
          </span>
        </div>
      </div>
    </div>
  );
}

/* ===== イコライザ ===== */
function Equalizer() {
  return (
    <div className="flex h-4 items-end gap-[2px]">
      <span className="eq-bar eq-1" />
      <span className="eq-bar eq-2" />
      <span className="eq-bar eq-3" />
    </div>
  );
}
