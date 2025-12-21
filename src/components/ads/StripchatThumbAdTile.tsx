import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  joinUrl: string;
  observerRoot?: Element | null;
};

function randomViewers() {
  const v = 2 + Math.random() * 1.9;
  return `${v.toFixed(1)}K`;
}

export function StripchatThumbVideoAdTile({ joinUrl, observerRoot }: Props) {
  const [viewers, setViewers] = useState(() => randomViewers());

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

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    root: observerRoot ?? null,
    rootMargin: "200px 0px", // ← 400pxだと「外れても inView 扱い」が長くなりがち
  });

  // ✅ これが肝：戻ってきたら iframe を作り直す
  const wasInViewRef = useRef(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const was = wasInViewRef.current;

    // 画面外 → 画面内 に戻ってきた瞬間に key を更新（＝iframe再生成）
    if (!was && inView) {
      setIframeKey((k) => k + 1);
    }

    wasInViewRef.current = inView;
  }, [inView]);

  return (
    <div ref={ref} className="relative mb-1 overflow-hidden bg-black shadow-sm">
      <div className="relative aspect-[9/16] w-full bg-black">
        {inView ? (
          <iframe
            key={iframeKey}
            src={joinUrl}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0, display: "block", pointerEvents: "auto" }}
            allow="autoplay; fullscreen"
            scrolling="no"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/40" />
        )}
      </div>

      <div className="pointer-events-none absolute bottom-2 left-2 z-30 flex items-center gap-4">
        <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          LIVE
        </span>
        <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {viewers} 視聴中
        </span>
      </div>

    </div>
  );
}
