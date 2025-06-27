import AdBanner, { JuicyAdsBanner } from "@/components/ads/juicyAds";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";

interface TwitterVideoSavePresenterProps {
  getTwitterVideoByUrl: (url: string) => Promise<void>;
  tweetUrl: string;
  setTweetUrl: React.Dispatch<React.SetStateAction<string>>;
  videoUrl: string;
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  isLoading: boolean;
}

export function TwitterVideoSavePresenter({
  getTwitterVideoByUrl,
  tweetUrl,
  setTweetUrl,
  videoUrl,
  setVideoUrl,
  error,
  isLoading,
}: TwitterVideoSavePresenterProps) {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header bgColor="bg-black" />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 pt-24">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Twitter動画保存ツール
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Twitter（X）に投稿された動画のURLを入力するだけで、簡単に再生＆保存リンクを取得できます。
          </p>
          <form
            className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap"
            onSubmit={(e) => {
              e.preventDefault();
              getTwitterVideoByUrl(tweetUrl);
            }}
          >
            <input
              type="text"
              placeholder="ここにツイートのURLを入力"
              className="h-10 w-full max-w-md rounded-lg border border-gray-300 px-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
            />
            <button
              type="submit"
              className="h-10 whitespace-nowrap rounded-lg bg-blue-600 px-4 text-white shadow hover:bg-blue-700"
            >
              取得
            </button>
          </form>
          {error && (
            <div className="mt-4 mb-2 text-sm text-red-500">{error}</div>
          )}
          {isLoading && (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-2 text-sm text-gray-600">
                動画を取得中です。しばらくお待ちください...
              </p>
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-500"></div>
            </div>
          )}
        </div>
        <AdBanner />
        {/* 取得した動画のリンクを表示する部分 */}
        {videoUrl !== "" && (
          <div className="mt-8 rounded-lg border border-gray-300 bg-white p-6 shadow">
            <h2 className=" font-semibold text-gray-900">取得した動画</h2>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 break-all text-sm text-blue-600 hover:underline"
            >
              {videoUrl}
            </a>
            <video
              src={videoUrl}
              controls
              className="mx-auto mt-4 rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}

        <div className="mt-12 text-xs text-gray-500">
          <p>
            ※
            当サイトは動画ファイルを直接保存しているわけではなく、Twitterに投稿された動画へのリンクを提供しています。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
