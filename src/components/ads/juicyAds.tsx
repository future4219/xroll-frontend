import React, { useEffect, useRef } from "react";

const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // クリア（再マウント対策）
    adRef.current.innerHTML = "";

    const script1 = document.createElement("script");
    script1.src = "https://poweredby.jads.co/js/jads.js";
    script1.async = true;
    script1.setAttribute("data-cfasync", "false");

    const ins = document.createElement("ins");
    ins.id = "1089004";
    ins.setAttribute("data-width", "300");
    ins.setAttribute("data-height", "250");

    const script2 = document.createElement("script");
    script2.innerHTML = `(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1089004});`;
    script2.async = true;
    script2.setAttribute("data-cfasync", "false");

    adRef.current.appendChild(script1);
    adRef.current.appendChild(ins);
    adRef.current.appendChild(script2);
  }, []);

  return (
    <div
      ref={adRef}
      className="flex h-[250px] w-full items-center justify-center bg-black"
    />
  );
};

export default AdBanner;



declare global {
  interface Window {
    adsbyjuicy: any[];
  }
}

export function JuicyAdsBanner() {
  useEffect(() => {
    // jads.js を読み込む
    const script = document.createElement("script");
    script.src = "https://poweredby.jads.co/js/jads.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    // 広告を表示する
    (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: 1090510 });

    return () => {
      // scriptタグを削除（クリーンアップ）
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ins
      id="1090510"
      data-width="908"
      data-height="258"
      style={{ display: "block", width: "908px", height: "258px" }}
    ></ins>
  );
}
