import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export function USC2257Presenter() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header bgColor="bg-black" />

      <div className="mx-auto max-w-3xl px-4 py-8 pt-24 text-sm leading-relaxed text-gray-800">
        <h1 className="mb-4 text-2xl font-bold">
          2257 Exemption Statement (English)
        </h1>

        <p className="mb-4">Last Updated: June 10, 2025</p>

        <p className="mb-6">
          Xroll does not produce, upload, or host any sexually explicit content.
          The content displayed on this site consists solely of links and
          metadata automatically or manually gathered from public posts on X
          (formerly Twitter).
        </p>

        <p className="mb-6">
          As such, the materials shown on this site are exempt from the
          requirements of 18 U.S.C. §2257 and 28 C.F.R. 75 for the following
          reasons:
        </p>

        <ul className="mb-6 list-disc pl-6">
          <li>
            Xroll is not a “producer” of any content under the definition set
            forth in the statute.
          </li>
          <li>
            All displayed content is limited to externally hosted links found on
            X/Twitter.
          </li>
          <li>
            Xroll does not host, reproduce, re-distribute, or re-post any actual
            videos or images.
          </li>
        </ul>

        <p className="mb-6">
          Therefore, Xroll is not subject to the record-keeping requirements of
          18 U.S.C. §2257.
        </p>

        <h2 className="mb-2 text-xl font-semibold">About age verification:</h2>
        <p className="mb-6">
          Ensuring that all individuals appearing in linked content are 18 years
          or older is the responsibility of the originating platform. Xroll
          makes no guarantees as to the accuracy or reliability of third-party
          content.
        </p>

        <p className="mb-6">For questions, please contact us at:</p>

        <p className="mb-6">
          <strong>xroll.net@gmail.com</strong>
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          Note on Xroll's service model:
        </h2>
        <p>
          Xroll is a link aggregation service that presents trending videos from
          X (Twitter) in a vertical “reels” format. We do not store, replicate,
          distribute, or embed any video files. All media is hosted on Twitter’s
          own infrastructure.
        </p>

        <hr className="my-12 border-t border-gray-300" />

        <h1 className="mb-4 text-2xl font-bold">
          2257 免責条項（Exemption Statement）
        </h1>

        <p className="mb-4">最終更新日：2025年6月10日</p>

        <p className="mb-6">
          Xrollでは、性的なコンテンツを自ら制作・アップロード・ホスティングすることは一切ありません。
          当サイトに掲載されているのは、ユーザーまたは自動システムにより取得されたX（旧Twitter）上の動画リンクとメタ情報です。
        </p>

        <p className="mb-6">
          当サイトのコンテンツは、18 U.S.C. §2257および28 C.F.R.
          75の要件から以下の理由により免除されます：
        </p>

        <ul className="mb-6 list-disc pl-6">
          <li>
            当サイトは性的コンテンツの「製作者（producer）」ではありません。
          </li>
          <li>
            表示しているのは外部サイト（X/Twitter）にあるコンテンツのリンク情報のみです。
          </li>
          <li>
            実際の動画や画像のホスティング、再配信、再投稿などは行っていません。
          </li>
        </ul>

        <p className="mb-6">
          したがって、18 U.S.C. §2257に基づく記録保持義務の対象ではありません。
        </p>

        <h2 className="mb-2 text-xl font-semibold">年齢確認について：</h2>
        <p className="mb-6">
          リンク先コンテンツに登場する人物が18歳以上であることは、各プラットフォームの責任のもとで確認されるべき事項です。
          Xrollではその内容や信頼性を保証することはできません。
        </p>

        <p className="mb-6">
          ご質問がある場合は、以下のアドレスまでお問い合わせください：
        </p>

        <p className="mb-6">
          <strong>xroll.net@gmail.com</strong>
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          補足：Xrollのサービス形態について
        </h2>
        <p>
          Xrollは、ユーザーが人気のX（Twitter）動画をリール形式で一覧表示できるUIを提供するリンク集サービスです。
          動画ファイルの保存・複製・配信・埋め込みは行っておらず、すべてのメディアファイルはTwitterのサーバー上に存在するものです。
        </p>
      </div>

      <Footer />
    </div>
  );
}
