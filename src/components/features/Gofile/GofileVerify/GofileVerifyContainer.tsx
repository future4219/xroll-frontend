import { GofileVerifyPresenter } from "@/components/features/Gofile/GofileVerify/GofileVerifyPresenter";
import api from "@/lib/api";
import { VerifyEmailRes } from "@/lib/types";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export function GofileVerifyContainer() {
  const email = new URLSearchParams(window.location.search).get("email");
  const [authenticationCode, setAuthenticationCode] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlerRegister = useCallback(async () => {
    try {
      const { data } = await api.post<VerifyEmailRes>(
        `${apiUrl}/auth/verify-email`,
        {
          email,
          authenticationCode,
        },
      );
      setAuthenticationCode(data.accessToken);

      // ✅ 成功時に /gofile/verify へ遷移（メールをクエリで渡すと親切）
      navigate(`/gofile/vault`);
      alert("メール認証が完了しました。");
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 400) setError("認証コードが正しくありません");
      else setError("認証に失敗しました。時間をおいて再度お試しください");
      console.error("Failed to verify email:", e);
    }
  }, [email, authenticationCode, apiUrl, navigate]);

  return (
    <GofileVerifyPresenter
      email={email}
      authenticationCode={authenticationCode}
      setAuthenticationCode={setAuthenticationCode}
      error={error}
      onSubmit={handlerRegister}
    />
  );
}
