import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export function PolicyPresenter() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header bgColor="bg-black" />

      <div className="mx-auto max-w-3xl px-4 py-8 pt-24 text-sm leading-relaxed text-gray-800">
        {/* English Version */}
        <h1 className="mb-4 text-2xl font-bold">
          Terms of Service, Disclaimer & Privacy Policy (Xroll)
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">1. Age Restriction</h2>
          <p>
            Xroll is intended only for adults aged 18 years or older. Use by
            minors is strictly prohibited. Accessing this site constitutes
            self-certification of being at least 18 years old.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            2. Nature of Content & Link Provision
          </h2>
          <p>
            Xroll provides information about video links posted on X (formerly
            Twitter). We do not host or distribute actual video or image files
            on our servers; we only list links to third-party sites.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">3. Copyright & DMCA</h2>
          <p>
            All links on this site point to content publicly posted by users on
            X (formerly Twitter). If you have a copyright claim, please contact
            us at <strong className="px-2">xroll.net@gmail.com</strong>. We will
            review and address valid requests promptly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            4. Section 2257 Compliance
          </h2>
          <p>
            Xroll is not a content provider; we simply catalog and display links
            to videos. Therefore, we are not subject to record-keeping
            requirements under 18 U.S.C. §2257. If suspected illegal content is
            found, we will investigate and act swiftly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">5. Third-Party Content</h2>
          <p>
            Xroll has no ownership or control over linked sites. Responsibility
            for content legality and safety lies with each third-party site.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">6. Prohibited Content</h2>
          <p>
            We prohibit links to the following illegal or inappropriate content:
          </p>
          <ul className="list-inside list-disc">
            <li>Child pornography or any content involving minors</li>
            <li>Sexual violence or non-consensual acts</li>
            <li>Other illegal materials</li>
          </ul>
          <p>Any prohibited links discovered will be removed immediately.</p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            7. Privacy & Data Usage
          </h2>
          <p>
            We do not collect personal information from users. However, we may
            use anonymous data like cookies and IP addresses for service
            improvement and analytics.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            8. Geographic Restrictions & VPN
          </h2>
          <p>
            Some linked sites may restrict access by region. Users must comply
            with local laws and terms of service. Check each provider’s policy
            before using VPN services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">9. Disclaimer</h2>
          <p>
            Xroll makes no guarantees regarding the accuracy, legality, or
            safety of linked content. We are not liable for any damages arising
            from site use. Users access and use links at their own risk.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">10. Security</h2>
          <p>
            We implement reasonable security measures, but cannot guarantee
            absolute safety. Please use up-to-date antivirus software when
            browsing.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">11. Changes</h2>
          <p>
            These terms, disclaimer, and privacy policy may change without
            notice. Please review periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">12. Contact</h2>
          <p>
            For reports of inappropriate content, copyright issues, or other
            inquiries, contact us at:
          </p>
          <p className="mt-2 flex items-center">
            <a href="mailto:xroll.net@gmail.com" className="underline">
              xroll.net@gmail.com
            </a>
          </p>
        </section>

        <hr className="my-8" />

        {/* Japanese Version */}
        <h1 className="mb-4 text-2xl font-bold">
          利用規約・免責事項・プライバシーポリシー（Xroll）
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">1. 年齢制限</h2>
          <p>
            Xrollは、18歳以上の成人のみを対象としたサービスです。未成年者の利用は固く禁止しており、当サイトにアクセスすること自体が18歳以上であることの自己証明とみなします。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            2. コンテンツの性質とリンク提供
          </h2>
          <p>
            Xrollは、X（旧Twitter）に投稿された動画のリンク情報を共有・保存するサービスです。当サイトでは実際の動画ファイルや画像などを一切ホスティングしておらず、第三者サイトへのリンクのみを掲載しています。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">3. 著作権とDMCA対応</h2>
          <p>
            当サイトに掲載されている全てのリンクは、ユーザーが投稿したX（旧Twitter）上の公開コンテンツに基づいています。著作権に関する申し立てがある場合は、
            <strong className="px-2">xroll.net@gmail.com</strong>
            までご連絡ください。適切な報告に基づき、速やかに対応を検討いたします。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            4. 2257免責条項への対応
          </h2>
          <p>
            Xrollはコンテンツプロバイダーではなく、動画へのリンク情報を記録・表示するに過ぎません。従って、18
            U.S.C.
            §2257に基づく記録保持義務の対象ではありません。ただし、リンク先が違法コンテンツである疑いがある場合には、調査のうえ速やかに対応します。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            5. 第三者コンテンツとの関係
          </h2>
          <p>
            当サイトはリンク先のサイトに対していかなる所有権・管理権限も有していません。コンテンツの内容や合法性、安全性については各リンク先の運営元に責任があります。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            6. 違法・不適切なコンテンツの非掲載
          </h2>
          <p>
            Xrollでは、以下のような違法または不適切とされるコンテンツへのリンク掲載を禁止・制限しています。
          </p>
          <ul className="list-inside list-disc">
            <li>児童ポルノまたは未成年者が登場するコンテンツ</li>
            <li>性的暴力・同意のない行為を描いたコンテンツ</li>
            <li>法律に反するその他の素材</li>
          </ul>
          <p>
            万が一、違反コンテンツへのリンクが発見された場合は、即時削除の対象とします。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            7. プライバシーとデータの取り扱い
          </h2>
          <p>
            Xrollでは、ユーザーの個人情報を収集することはありません。
            ただし、サービス向上やアクセス解析のために、クッキーやIPアドレスなどの匿名データを利用する場合があります。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">9. 地域的制限とVPN</h2>
          <p>
            Xrollで紹介するリンク先サイトの中には、地域によって閲覧が制限されている場合があります。
            ユーザーは各国の法律および利用規約を順守の上でアクセスしてください。
            VPNの使用については各サービス提供者の規約をご確認ください。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">10. 免責事項</h2>
          <p>
            Xrollは、リンク先の内容の正確性・合法性・安全性に関して一切の保証をいたしません。
            当サイトの利用により生じたいかなる損害に対しても、Xrollは一切責任を負いません。
            ユーザーの責任において閲覧・利用してください。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            11. セキュリティについて
          </h2>
          <p>
            当サイトでは、アクセスの安全性を保つために適切なセキュリティ対策を講じていますが、完全な安全性を保証するものではありません。
            最新のウイルス対策ソフトをご利用ください。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">12. 改定と変更</h2>
          <p>
            本規約・免責事項・プライバシーポリシーは、予告なく変更される場合があります。
            定期的にご確認ください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">13. お問い合わせ先</h2>
          <p>
            不適切なコンテンツの報告、著作権問題、その他のお問い合わせは以下までお願いします：
          </p>
          <p className="mt-2 flex items-center">
            <a href="mailto:xroll.net@gmail.com" className="underline">
              xroll.net@gmail.com
            </a>
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
