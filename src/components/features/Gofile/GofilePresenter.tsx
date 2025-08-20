import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { appUrl } from "@/config/url";
import { SideBarMenuXroll } from "@/components/ui/SideBarMenuXroll";
import { Link } from "react-router-dom";
import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";

/**
 * Xfile - Home (Cloudflare-like hero)
 * - 左テキスト / 右ビジュアルの2カラム
 * - 太い見出し・短いサブコピー・プライマリ/セカンダリCTA
 * - 下部に“信頼の証”ストリップ
 *
 * 追加: 安心の仕様（Trust/Specs）セクションを本ページ下部に実装
 */
export function GofilePresenter() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <BackgroundDeco />

      <header className={"fixed top-0 left-0 z-50 w-full bg-black  text-white"}>
        <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between ">
          {/* 左：ロゴとメニュー */}
          <div className="flex items-center ">
            <SideBarMenuXfile />
            <Link to="/">
              <div></div>
              Xfile
            </Link>
          </div>

          {/* 中央：リール / サムネイル切り替え */}

          {/* 右側の空き領域 */}
          <div className="w-8" />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20">
        {/* ===== Hero ===== */}
        <section className="grid items-center gap-10 md:grid-cols-[1.15fr,0.85fr]">
          {/* Left: copy */}
          <div>
            {/* pill/badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-zinc-300">
              新しい動画ロッカー
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              共有コントロール完備
            </div>

            {/* headline */}
            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                あなたの動画、
                <br className="hidden sm:block" />
                あなたのルール「
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Xfile
                </span>
                」
              </span>
            </h1>

            {/* subcopy */}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-300">
              プライベートに保管。見せたいときだけ共有。必要になったら、検索で他の投稿も見つけられます。
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={appUrl.gofileUpload}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 text-base font-semibold text-black shadow-[0_10px_30px_-10px_rgba(245,158,11,0.6)] transition hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="My Vault（自分の保存庫）へ"
              >
                <LockIcon className="h-5 w-5" />
                今すぐアップロード
              </a>

              <a
                href={appUrl.gofileSearch}
                className="border-white/15 inline-flex items-center justify-center gap-2 rounded-2xl border bg-white/5 px-7 py-3.5 text-base font-semibold backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Search（検索）へ"
              >
                <SearchIcon className="h-5 w-5" />
                検索してみる
              </a>
            </div>

            {/* key points */}
            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-zinc-300 sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                非公開がデフォルト
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                パス/期限/回数で共有制御
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                年齢・同意の厳格運用
              </li>
            </ul>
          </div>

          {/* Right: visual (abstract orb like Cloudflare) */}
        </section>

        {/* ===== Trust strip ===== */}
        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              Trusted by creators & studios
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-80">
              <span className="text-zinc-400">Creator A</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-zinc-400">Studio B</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-zinc-400">Team C</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-zinc-400">Producer D</span>
            </div>
          </div>
        </section>

        {/* note */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-zinc-400">
          ※
          索引（検索掲載）は段階的に開放されます。まずは非公開で安全にお試しください。
        </p>

        {/* ===== Trust / Specs ===== */}
        <TrustSpecs />
      </main>

      <Footer />
    </div>
  );
}

/* ----------------------------- Trust Specs ----------------------------- */
function TrustSpecs() {
  return (
    <section id="trust" className="mt-20 space-y-12">
      {/* Anchor nav */}
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300">
          <a className="hover:text-white" href="#trust-pillars">
            保管・制御・共有
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <a className="hover:text-white" href="#trust-security">
            セキュリティ
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <a className="hover:text-white" href="#trust-privacy">
            プライバシー
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <a className="hover:text-white" href="#trust-transparency">
            透明性
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <a className="hover:text-white" href="#trust-policy">
            コンテンツポリシー
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <a className="hover:text-white" href="#trust-faq">
            FAQ
          </a>
        </div>
      </div>

      {/* Pillars */}
      <div id="trust-pillars" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">Xfile のコア設計</h2>
        <p className="mt-2 text-zinc-300">
          「非公開がデフォルト」「共有の細かなコントロール」「必要な時だけ共有」の3軸で設計しています。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2 text-zinc-200">
              <LockIcon className="h-5 w-5" />
              <span className="font-semibold">保管（非公開）</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              アップロード直後は自分だけの閲覧。公開前提の設計はしていません。
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-zinc-200">
              <ShieldIcon className="h-5 w-5" />
              <span className="font-semibold">制御（共有設定）</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              パスワード、期限、視聴回数、ワンタップ無効化でリンクを制御できます。
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-zinc-200">
              <EyeIcon className="h-5 w-5" />
              <span className="font-semibold">共有（必要な時だけ）</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              見せたい相手にだけ共有。検索露出は段階的に開放し、手動で切替可能。
            </p>
          </Card>
        </div>
      </div>

      {/* Security */}
      <div id="trust-security" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">
          セキュリティ（技術面）
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-zinc-200">通信・認証</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                全画面・APIをHTTPSで提供
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                メール＋パスワード（TOTP二段階認証は段階導入）
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                共有リンクにパスワード/期限/視聴回数/即時失効
              </li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-zinc-200">保護・監視</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                異常アクセスのレート制限・総当たり防止
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                ログイン/共有変更/視聴の内部監査ログ
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                障害復旧用の短期スナップショット保持
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Privacy */}
      <div id="trust-privacy" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">
          プライバシー（データの扱い）
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-zinc-200">最小収集と目的限定</h3>
            <p className="mt-2 text-sm text-zinc-300">
              アカウント運用に必要な基礎情報と、セキュリティ目的の技術ログのみを扱い、運用・法令遵守以外に利用しません。
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                第三者提供は必要最小限の委託先に限定
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                追跡目的のサードパーティCookieは不使用
              </li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-zinc-200">コントロール権</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                データのエクスポート申請
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                アカウント/動画の削除（短期復旧猶予後に完全消去）
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Transparency */}
      <div id="trust-transparency" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">透明性と運用</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <h3 className="font-semibold text-zinc-200">ステータス公開</h3>
            <p className="mt-2 text-sm text-zinc-300">
              稼働状況、障害、メンテ情報はステータスページで公開します。
            </p>
            <div className="mt-3">
              <a
                href="/status"
                className="text-sm underline underline-offset-4 hover:text-white"
              >
                /status
              </a>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-zinc-200">変更履歴 / 連絡先</h3>
            <p className="mt-2 text-sm text-zinc-300">
              セキュリティ関連の重要変更は公開ノートで告知。緊急連絡は
              security@… へ。
            </p>
            <div className="mt-3 space-x-4 text-sm">
              <a
                href="/changelog"
                className="underline underline-offset-4 hover:text-white"
              >
                /changelog
              </a>
              <a
                href="mailto:security@example.com"
                className="underline underline-offset-4 hover:text-white"
              >
                security@example.com
              </a>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-zinc-200">透明性レポート</h3>
            <p className="mt-2 text-sm text-zinc-300">
              当局要請や削除要請の件数を可能な範囲で定期公表します。
            </p>
            <div className="mt-3">
              <a
                href="/transparency"
                className="text-sm underline underline-offset-4 hover:text-white"
              >
                /transparency
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Policy */}
      <div id="trust-policy" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">
          コンテンツポリシー
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2 text-zinc-200">
              <FileIcon className="h-5 w-5" />
              <span className="font-semibold">年齢・同意・著作権</span>
            </div>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                成人当事者の明確な同意がないものは禁止
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                未成年表現・搾取・違法性が疑われる場合は停止
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                権利侵害の通知（DMCA等）に迅速対応
              </li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-zinc-200">
              <AlertIcon className="h-5 w-5" />
              <span className="font-semibold">禁止事項と報告</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              違法/有害行為の助長、リベンジポルノ、個人情報晒し等を禁止。違反が疑われる場合は報告フォームへ。
            </p>
            <div className="mt-3">
              <a
                href="/report"
                className="text-sm underline underline-offset-4 hover:text-white"
              >
                /report
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div id="trust-faq" className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight">よくある質問</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FaqCard
            q="アップロード直後に他人から見えますか？"
            a="見えません。非公開がデフォルトです。共有設定をした相手にだけ届きます。"
          />
          <FaqCard
            q="共有リンクは安全ですか？"
            a="パスワード、期限、視聴回数、即時失効で制御可能です。拡散時はすぐ失効してください。"
          />
          <FaqCard
            q="違法・同意のないコンテンツを見つけたら？"
            a="報告フォームからお知らせください。確認の上、必要に応じて即時停止・通報します。"
          />
          <FaqCard
            q="データは削除できますか？"
            a="いつでも削除できます。短期の復旧猶予後に完全消去されます。"
          />
          <FaqCard
            q="自分の情報のコピーは取得できますか？"
            a="できます。ダッシュボードからエクスポートを申請してください。"
          />
        </div>
      </div>

      {/* Footer CTA links */}
      <div className="mx-auto max-w-6xl">
        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <a
            href="/legal"
            className="underline underline-offset-4 hover:text-white"
          >
            利用規約 / プライバシー
          </a>
          <span className="h-3 w-px bg-white/10" />
          <a
            href="/dmca"
            className="underline underline-offset-4 hover:text-white"
          >
            DMCA
          </a>
          <span className="h-3 w-px bg-white/10" />
          <a
            href="/2257"
            className="underline underline-offset-4 hover:text-white"
          >
            2257
          </a>
          <span className="h-3 w-px bg-white/10" />
          <a
            href="/status"
            className="underline underline-offset-4 hover:text-white"
          >
            ステータス
          </a>
          <span className="h-3 w-px bg-white/10" />
          <a
            href="/transparency"
            className="underline underline-offset-4 hover:text-white"
          >
            透明性レポート
          </a>
        </div>
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
      {children}
    </div>
  );
}

function FaqCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
      <p className="font-semibold text-zinc-200">{q}</p>
      <p className="mt-2 text-sm text-zinc-300">{a}</p>
    </div>
  );
}

/* ----------------------------- Background ----------------------------- */
function BackgroundDeco() {
  return (
    <>
      {/* top glow */}
      <div
        aria-hidden
        className="bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),rgba(0,0,0,0)_60%)] pointer-events-none fixed top-[-8rem] left-1/2 z-0 h-[36rem] w-[64rem] -translate-x-1/2 rounded-[100%]
                   blur-3xl"
      />
      {/* soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-24 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-24 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/10 blur-3xl"
      />
      {/* subtle grid */}
      <div
        aria-hidden
        className="bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed
                   inset-0
                   z-0"
      />
    </>
  );
}

/* ------------------------------ Icons ------------------------------ */
function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  );
}
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
    </svg>
  );
}
function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  );
}
