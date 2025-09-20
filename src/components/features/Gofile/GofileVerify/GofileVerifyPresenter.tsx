import { Link } from "react-router-dom";

type GofileVerifyPresenterProps = {
  email: string | null;
  authenticationCode: string;
  setAuthenticationCode: (code: string) => void;
  onSubmit: () => void;
  error?: string | null;
};

export function GofileVerifyPresenter({
  email,
  authenticationCode,
  setAuthenticationCode,
  onSubmit,
  error = null,
}: GofileVerifyPresenterProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-white">
      <BackgroundDeco />

      <main className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-xl backdrop-blur">
          {/* タイトル */}
          <h1 className="text-center text-xl font-bold text-amber-400">
            メールを送信しました
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-300">
            {email ?? "(メールアドレス不明)"} に確認コードを送信しました。
            <br />
            メールを確認し、以下に4桁のコードを入力してください。
          </p>

          {/* エラーバナー */}
          {error && (
            <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* 認証コード入力 */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={authenticationCode}
              onChange={(e) =>
                setAuthenticationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 4),
                )
              }
              placeholder="4桁のコード"
              className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-center text-lg font-semibold tracking-widest text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />

            <button
              type="submit"
              disabled={authenticationCode.length !== 4}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-black shadow-[0_5px_20px_-5px_rgba(245,158,11,0.6)] transition hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              認証する
            </button>
          </form>

          {/* 再送信 */}
          <div className="mt-4 text-center text-sm text-zinc-400">
            メールが届いていませんか？{" "}
            <Link
              to="/gofile/resend"
              className="font-medium text-amber-400 hover:underline"
            >
              再送信する
            </Link>
          </div>
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
