// src/auth/BootInit.tsx
import { useEffect, useRef } from "react";
import api from "@/lib/api"; // axios.create したやつ
import { setAuthTokenCookie } from "@/lib/auth";

export default function BootInit() {
  const doneRef = useRef(false); // HMRや再レンダーでの二重実行防止

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    (async () => {
      try {
        const { data } = await api.get("/auth/boot");
        const at = data?.accessToken ?? data?.AccessToken;
        const uid = data?.userId ?? data?.UserID;
        if (at) setAuthTokenCookie(at);
        if (uid) localStorage.setItem("userId", uid);
      } catch (e) {
        console.error("boot failed", e);
      }
    })();
  }, []);

  return null;
}
