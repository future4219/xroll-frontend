import React, { useEffect, useRef } from "react";

const InterstitialAd = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 前回の script を削除
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.setAttribute("data-id", "juicyads-native-ads");
    script.setAttribute("data-ad-zone", "1092151");
    script.setAttribute("data-targets", "a");
    script.src = "https://js.juicyads.com/juicyads.native-ads.min.js";

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} className="w-full" />;
};

export default InterstitialAd;
