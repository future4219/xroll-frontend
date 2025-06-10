import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export function DMCAPresenter() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header bgColor="bg-black" />

      <div className="mx-auto max-w-3xl px-4 py-8 pt-24 text-sm leading-relaxed text-gray-800">
        <h1 className="mb-4 text-2xl font-bold">
          DMCA Takedown Notice (English)
        </h1>

        <p className="mb-4">Last Updated: June 10, 2025</p>

        <p className="mb-6">
          Xroll ("this site") complies with the United States Digital Millennium
          Copyright Act of 1998 (DMCA), and responds promptly and honestly to
          legitimate claims of copyright infringement.
        </p>

        <p className="mb-6">
          We do not host or distribute any video files. We only index and
          display links to videos posted on X (formerly Twitter). If you believe
          that a link leads to content that infringes your copyright, please
          provide us with the following information:
        </p>

        <h2 className="mb-2 text-xl font-semibold">Required information:</h2>
        <ul className="mb-6 list-disc pl-6">
          <li>
            A physical or electronic signature of the copyright holder or an
            authorized representative
          </li>
          <li>
            Identification of the copyrighted work claimed to be infringed
            (title or link)
          </li>
          <li>
            The URL of the allegedly infringing content, including the
            corresponding Xroll page
          </li>
          <li>
            Contact information of the copyright owner (name, address, phone
            number, email)
          </li>
          <li>
            A good-faith statement that the use of the material is not
            authorized by the copyright owner, its agent, or the law
          </li>
          <li>
            A statement that the information provided is accurate and, under
            penalty of perjury, that you are authorized to act on behalf of the
            copyright owner
          </li>
        </ul>

        <p className="mb-6">Please send your DMCA takedown requests to:</p>

        <p className="mb-6">
          <strong>xroll.net@gmail.com</strong>
        </p>

        <p>
          Upon confirmation of a valid copyright infringement claim, we will
          promptly remove the relevant link and take preventive measures against
          recurrence.
        </p>

        <hr className="my-12 border-t border-gray-300" />

        <h1 className="mb-4 text-2xl font-bold">
          DMCA（著作権侵害申し立て）通知
        </h1>

        <p className="mb-4">最終更新日：2025年6月10日</p>

        <p className="mb-6">
          Xroll（以下「当サイト」）は、米国著作権法「Digital Millennium
          Copyright Act of 1998（DMCA）」に基づき、
          著作権侵害の申し立てに対して迅速かつ誠実に対応いたします。
        </p>

        <p className="mb-6">
          当サイトでは、X（旧Twitter）に投稿された動画のリンクを紹介しているのみであり、実際の動画ファイルのホスティングや配信は一切行っておりません。
          ただし、リンク先のコンテンツが著作権を侵害していると思われる場合は、以下の情報を明記の上、ご連絡ください。
        </p>

        <h2 className="mb-2 text-xl font-semibold">必要な情報：</h2>
        <ul className="mb-6 list-disc pl-6">
          <li>著作権者（またはその代理人）の物理的または電子署名</li>
          <li>
            著作権を侵害されたとされるコンテンツの特定（該当する動画タイトルやリンク）
          </li>
          <li>問題のリンク先URL（Xroll上の表示URLを含む）</li>
          <li>著作権者の連絡先（氏名、住所、電話番号、メールアドレス）</li>
          <li>
            「正当な権利なしに使用されていると誠実に信じている」という明言
          </li>
          <li>
            上記の情報が正確であり、虚偽ではないとする宣誓（偽証罪が適用されます）
          </li>
        </ul>

        <p className="mb-6">
          著作権侵害に関する申し立ては、以下のメールアドレスにお送りください：
        </p>

        <p className="mb-6">
          <strong>xroll.net@gmail.com</strong>
        </p>

        <p>
          当サイトでは、著作権違反が明確に確認された場合、該当リンクを迅速に削除し、再発防止に努めます。
        </p>
      </div>

      <Footer />
    </div>
  );
}
