import logo from "@/components/features/Policy/xroll.png";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export function PolicyPresenter() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header bgColor="bg-black" />

      <div className="mx-auto max-w-3xl px-4 py-8 pt-24 text-sm leading-relaxed text-gray-800">
        <h1 className="mb-4 text-2xl font-bold">
          利用規約・プライバシーポリシー・免責事項
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">当サイトについて</h2>
          <p>
            当サイトでは、動画ファイルそのものを自サーバーに保存・配信しているわけではありません。
            提供しているのは、Twitterに投稿された動画へのリンクのみです。
            万が一、不適切なリンクが見つかった場合は、該当ツイートや動画のURLをメール
            <strong className="px-2">xroll.net@gmail.com</strong>
            にてお知らせください。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Cookieについて</h2>
          <p>
            当サイトでは、アクセス解析や広告配信のためにCookieを使用する場合があります。Cookieによって収集された情報は、個人を特定するものではなく、サービスの改善や最適化に使用されます。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">著作権について</h2>
          <p>
            当サイトで紹介されている動画の著作権は、各投稿者およびX（旧Twitter）社に帰属します。当サイトは、リンクのみを表示しており、著作権侵害を目的とした運営は一切行っておりません。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            違法ダウンロードについて
          </h2>
          <p>
            当サイトに掲載されているリンクを利用して、著作権者の許可なく動画をダウンロードする行為は、著作権法により禁止されています。違法にダウンロードされたコンテンツの利用に関して、当サイトは一切の責任を負いません。ご利用の際は、法令を遵守いただくようお願いいたします。{" "}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">広告に関して</h2>
          <p>
            当サイトでは、JuicyAdsなどの第三者広告サービスを利用しています。広告内容に関する責任は広告主に帰属し、当サイトは一切の責任を負いかねます。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">お問い合わせ</h2>
          <p>
            不適切なリンクや削除依頼に関しては、サイト内のお問い合わせフォームまたはメールにてご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">改定について</h2>
          <p>
            本ポリシーは、必要に応じて予告なく変更されることがあります。最新の内容は当ページにてご確認ください。
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
