import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { Link } from "react-router-dom";
import { useState } from "react";
import { appUrl } from "@/config/url";

type Props = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onLogin: () => void;
  loading?: boolean;
  error?: string | null;
  /** 追加: ゲスト続行ハンドラ（未指定ならボタン非表示） */
};

/**
 * LoginPage
 * - Controlled inputs
 * - Enter submit 対応
 * - エラーバナー & ローディング状態
 * - ゲストとして続ける（任意）
 */
export function GofileLoginPresenter({
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
  loading = false,
  error = null,
}: Props) {
  const [showPw, setShowPw] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-white">
      <BackgroundDeco />

      <main className="relative z-10 w-full max-w-md px-6">
        <header className="supports-[backdrop-filter]:bg-black/60 fixed top-0 left-0 z-50 w-full bg-black/90 backdrop-blur">
          <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
            <div className="flex items-center gap-2">
              <SideBarMenuXfile />
              <div className="text-sm font-semibold tracking-tight sm:text-[15px]">
                Login
              </div>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur">
          {/* ロゴ / タイトル */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Gofile Controller
              </span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">ログインして続ける</p>
          </div>

          {/* エラーバナー */}
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* フォーム */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm text-zinc-300">
                メールアドレス
              </label>
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300">パスワード</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 pr-10 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-2 my-1 rounded px-2 text-xs text-zinc-400 hover:text-zinc-200"
                  aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPw ? "隠す" : "表示"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_5px_20px_-5px_rgba(245,158,11,0.6)] transition hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>

            <div className="my-2 flex items-center gap-3 text-xs text-zinc-500">
              <span className="h-px flex-1 bg-white/10" />
              <span>または</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <Link to={appUrl.gofileVault}>
              <div
                className="mt-4 w-full rounded-lg border border-white/20 bg-black/40 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="ゲストとして続ける"
              >
                ゲストとして続ける
              </div>
            </Link>

            <p className="mt-2 text-center text-[11px] text-zinc-500">
              ※ ゲストは一部機能が制限されます
            </p>
          </form>

          {/* 補助リンク */}
          <div className="mt-6 text-center text-sm text-zinc-400">
            アカウントをお持ちでないですか？{" "}
            <Link
              to="/gofile/register"
              className="font-medium text-amber-400 hover:underline"
            >
              新規登録
            </Link>
            <div className="mt-2">
              <Link
                to="/gofile/reset"
                className="underline underline-offset-2 hover:text-zinc-300"
              >
                パスワードをお忘れですか？
              </Link>
            </div>
          </div>
        </div>

        {/* フッターリンク */}
        <div className="mt-8 flex justify-center gap-4 text-xs text-zinc-500">
          <a
            href="/dmca"
            className="underline underline-offset-2 hover:text-zinc-300"
          >
            DMCA
          </a>
          <a
            href="/usc2257"
            className="underline underline-offset-2 hover:text-zinc-300"
          >
            USC 2257
          </a>
          <a
            href="/policy"
            className="underline underline-offset-2 hover:text-zinc-300"
          >
            利用規約
          </a>
        </div>
      </main>
    </div>
  );
}

/* 背景デコ */
function BackgroundDeco() {
  return (
    <>
      <div
        aria-hidden
        className="bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),rgba(0,0,0,0)_60%)] pointer-events-none fixed top-[-8rem] left-1/2 z-0 h-[36rem] w-[64rem] -translate-x-1/2 rounded-[100%] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-24 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-24 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed inset-0 z-0"
      />
    </>
  );
}
