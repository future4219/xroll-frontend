import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import { User } from "@/lib/types";
import { Link } from "react-router-dom";

type GofileRegisterPresenterProps = {
  me: User;
  email: string;
  password: string;
  confirmPassword: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  onRegister: () => void;
  error?: string | null;
};

export function GofileRegisterPresenter({
  me,
  email,
  password,
  confirmPassword,
  setEmail,
  setPassword,
  setConfirmPassword,
  onRegister,
  error = null,
}: GofileRegisterPresenterProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onRegister();
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
                Register
              </div>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur">
          {/* タイトル */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                アカウント作成
              </span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Gofile Controller へようこそ
            </p>
          </div>
          {/* ゲストユーザー案内 */}
          {
            <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-300">
              現在はゲストユーザーとして利用中です。
              <br />
              新規会員登録をして、すべての機能をご利用ください。
            </div>
          }

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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="terms" className="text-xs text-zinc-400">
                <a
                  href="/policy"
                  className="underline underline-offset-2 hover:text-zinc-300"
                >
                  利用規約
                </a>
                に同意します
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_5px_20px_-5px_rgba(245,158,11,0.6)] transition hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black"
            >
              アカウント作成
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            すでにアカウントをお持ちですか？{" "}
            <Link
              to="/gofile/login"
              className="font-medium text-amber-400 hover:underline"
            >
              ログイン
            </Link>
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

/* 背景は既存のまま */
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
