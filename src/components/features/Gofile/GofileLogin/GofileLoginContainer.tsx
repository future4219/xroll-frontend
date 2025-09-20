import { GofileLoginPresenter } from "@/components/features/Gofile/GofileLogin/GofileLoginPresenter";
import api from "@/lib/api";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthTokenCookie } from "@/lib/auth";
import { adaptUserResToUser, UserRes } from "@/lib/types";
import { appUrl } from "@/config/url";

export function GofileLoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || appUrl.gofileVault; // 好みで変更

  const validate = () => {
    if (!email) return "メールアドレスを入力してください";
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) return "メールアドレスの形式が正しくありません";
    if (!password) return "パスワードを入力してください";
    return null;
  };

  const onLogin = useCallback(async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // /api/auth/access-token でログイン
      const res = await api.post(`${apiUrl}/auth/access-token`, {
        email,
        password,
      });

      // いずれかのプロパティ名に対応
      const token: string | undefined =
        res.data?.access_token || res.data?.accessToken || res.data?.token;

      if (!token) {
        throw new Error("トークンを取得できませんでした");
      }

      // Cookie に AT を保存
      setAuthTokenCookie(token);

      // ついでに /users/me で userId を取得して localStorage へ（サイドバー用）
      try {
        const { data } = await api.get<UserRes>(`${apiUrl}/users/me`);
        const me = adaptUserResToUser(data);
        if (me.Id) localStorage.setItem("userId", me.Id);
      } catch (e) {
        // 取得失敗は致命ではないので握り潰す
        console.warn("Failed to fetch /users/me:", e);
      }

      // 成功 → 遷移
      navigate(redirect);
      alert("ログインしました");
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401)
        setError("メールアドレスまたはパスワードが正しくありません");
      else if (status === 429)
        setError("試行回数が多すぎます。しばらく待ってから再試行してください");
      else setError("ログインに失敗しました。");
      console.error("login failed:", e);
    } finally {
      setLoading(false);
    }
  }, [email, password, apiUrl, navigate, redirect]);

  // 入力でエラーを消す（「直しても残る」を防止）
  const onChangeEmail = (v: string) => {
    setEmail(v);
    if (error) setError(null);
  };
  const onChangePassword = (v: string) => {
    setPassword(v);
    if (error) setError(null);
  };

  return (
    <GofileLoginPresenter
      email={email}
      password={password}
      setEmail={onChangeEmail}
      setPassword={onChangePassword}
      onLogin={onLogin}
      loading={loading}
      error={error}
    />
  );
}
