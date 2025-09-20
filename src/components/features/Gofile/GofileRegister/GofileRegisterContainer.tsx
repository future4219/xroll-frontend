import { GofileRegisterPresenter } from "@/components/features/Gofile/GofileRegister/GofileRegisterPresenter";
import api from "@/lib/api";
import { User, UserRes, adaptUserResToUser, newUser } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← 追加

export function GofileRegisterContainer() {
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPasswordState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User>(newUser());

  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // ログイン済みなら /users/me を取得
  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<UserRes>(`${apiUrl}/users/me`);
        setMe(adaptUserResToUser(data));
      } catch (e) {
        console.error("Failed to fetch user info:", e);
        setMe(newUser());
      }
    })();
  }, []); // USER_ID 変化で再取得したいなら依存に USER_ID を追加

  const setEmail = (v: string) => {
    setEmailState(v);
    if (error) setError(null);
  };
  const setPassword = (v: string) => {
    setPasswordState(v);
    if (error) setError(null);
  };
  const setConfirmPassword = (v: string) => {
    setConfirmPasswordState(v);
    if (error) setError(null);
  };

  const validate = () => {
    if (!email) return "メールアドレスを入力してください";
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) return "メールアドレスの形式が正しくありません";
    if (!password) return "パスワードを入力してください";
    if (password.length < 8) return "パスワードは8文字以上で入力してください";
    if (!confirmPassword) return "確認用パスワードを入力してください";
    if (password !== confirmPassword)
      return "パスワードと確認用パスワードが一致しません";
    return null;
  };

  const handlerRegister = useCallback(async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await api.post(`${apiUrl}/auth/create-by-me`, { email, password });

      // ✅ 成功時に /gofile/verify へ遷移（メールをクエリで渡すと親切）
      navigate(`/gofile/verify?email=${encodeURIComponent(email)}`);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) setError("このメールアドレスは既に登録されています");
      else if (status === 400) setError("入力内容を確認してください");
      else setError("登録に失敗しました。時間をおいて再度お試しください");
      console.error("Failed to create user:", e);
    }
  }, [email, password, confirmPassword, apiUrl, navigate]);

  return (
    <GofileRegisterPresenter
      me={me}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      onRegister={handlerRegister}
      error={error}
    />
  );
}
