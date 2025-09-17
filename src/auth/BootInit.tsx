// src/auth/BootInit.tsx
import { useEffect, useRef } from "react";
import api from "@/lib/api";
import { setAuthTokenCookie, clearAuthTokenCookie } from "@/lib/auth";
import { appUrl } from "@/config/url";
import type { AxiosError } from "axios";

export default function BootInit() {
  const doneRef = useRef(false); // 再実行防止

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    (async () => {
      try {
        // 4xx/5xxでも throw させず、status を自分で見る
        const res = await api.get("/auth/boot", { validateStatus: () => true });

        if (res.status === 200) {
          const at = res.data?.accessToken ?? res.data?.AccessToken;
          const uid = res.data?.userId ?? res.data?.UserID;
          if (at) setAuthTokenCookie(at);
          if (uid) localStorage.setItem("userId", uid);
          return;
        }

        if (res.status === 401) {
          // 未ログイン or 無効トークン：掃除してログインへ
          clearAuthTokenCookie();
          localStorage.removeItem("userId");
          const next = encodeURIComponent(location.pathname + location.search);
          // ログイン後に戻したい場合は ?next= を付与
          location.href = `${appUrl.gofileLogin}?next=${next}`;
          return;
        }

        // 404/500 など想定外
        console.warn("boot unexpected status:", res.status);
      } catch (e) {
        const ax = e as AxiosError;
        console.error("boot failed:", ax?.message);
        // ここにネットワークエラー時のリトライやオフライン表示などを追加してOK
      }
    })();
  }, []);

  return null; // スプラッシュを出したいならここでローディングUIを返す
}
