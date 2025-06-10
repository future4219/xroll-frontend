import AdBanner from "@/components/ads/juicyAds";
import JuicyAdsPopup from "@/components/ads/juicyAdsPopup";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
import { Header } from "@/components/ui/Header";
import PopupManager from "@/components/ui/PopupManager";
import { Video } from "@/entities/video/entity";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface MainVideoListPresenterProps {
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  videos: Video[];
  loadMore: () => void;
  likeVideo: (id: number) => void;
  commentVideo: (id: number, comment: string) => void;
}

export function MainVideoListPresenter({
  setVideos,
  videos,
  loadMore,
  likeVideo,
  commentVideo,
}: MainVideoListPresenterProps) {
  // activeIndex の初期値を localStorage から取得（存在しなければ 0）
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const stored = localStorage.getItem("lastActiveIndex");
    return stored ? Number(stored) : 0;
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const hasRestoredRef = useRef(false);
  const [showAd, setShowAd] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  // マウント時に localStorage を確認
  useEffect(() => {
    const agreed = localStorage.getItem("agreedToTerms");
    if (!agreed) {
      // 一度も同意していなければ true にしてポップアップを出す
      setShowTermsOfService(true);
    }
  }, []);

  // 同意ボタン押下時に呼ばれるハンドラ
  const handleAgree = () => {
    localStorage.setItem("agreedToTerms", "true");
    setShowTermsOfService(false);
  };

  // 広告の表示後にカウントダウン開始
  useEffect(() => {
    if (!showAd) return;

    if (countdown === 0) {
      setCanClose(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showAd]);

  // 定期的に広告を表示するためのカウントダウンと✕ボタンの制御
  // useEffect(() => {
  //   if (!showAd && canClose) {
  //     const timer = setTimeout(() => {
  //       setCountdown(5); // カウントダウン初期化
  //       setCanClose(false); // ✕ボタンを非表示に
  //       setShowAd(true); // 広告再表示
  //     }, 60_000); // 1分後（60000ms）

  //     return () => clearTimeout(timer);
  //   }
  // }, [showAd, canClose]);

  // activeIndex を localStorage に保存
  useEffect(() => {
    localStorage.setItem("lastActiveIndex", activeIndex.toString());
  }, [activeIndex]);

  // マウント時に保存された activeIndex に基づいてスクロール位置を復元
  useLayoutEffect(() => {
    if (!hasRestoredRef.current && containerRef.current && videos.length > 0) {
      // 動画が更新されたかどうかを localStorage の lastUpdatedAt と比較
      if (
        localStorage.getItem("lastUpdatedAt") !==
        videos[0].created_at?.toString()
      ) {
        // 動画が更新された場合、activeIndex を 0 にリセット
        setActiveIndex(0);
        containerRef.current.scrollTop = 0;
      } else {
        // 動画が更新されていない場合、保存された activeIndex に基づいてスクロール位置を復元
        containerRef.current.scrollTop = activeIndex * window.innerHeight;
      }

      localStorage.setItem(
        "lastUpdatedAt",
        videos[0].created_at?.toString() || "",
      );
      hasRestoredRef.current = true;
    }
  }, [videos]);

  // スクロール時に各動画要素の中心との距離を計算して、最も近い動画を activeIndex に設定
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      let closestIndex = 0;
      let minDiff = Infinity;
      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const diff = Math.abs(
          rect.top + rect.height / 2 - window.innerHeight / 2,
        );
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // activeIndex が動画リストの最後に到達したら loadMore を呼び出す
  useEffect(() => {
    if (activeIndex === videos.length - 1) {
      loadMore();
    }
  }, [activeIndex, videos.length, loadMore]);

  return (
    <div>
      {showTermsOfService && (
        <PopupManager
          initialDelay={0}
          enableCountdown={false} // カウントダウン不要
          showCloseButton={false} // ✕ボタン不要
        >
          <div className="max-w-md rounded-xl bg-white p-4 text-black shadow-md">
            <h2 className="mb-2 text-lg font-bold">利用規約</h2>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>当サイトは18歳未満の方のご利用を固くお断りしています。</li>
              <li>
                以下のような違法・不適切コンテンツを発見した場合は、
                お手数ですが運営までご通報ください。
                <ul className="list-outside list-disc space-y-1 pl-8">
                  <li>児童ポルノまたは未成年者が登場するコンテンツ</li>
                  <li>性的暴力・同意のない行為を描いたコンテンツ</li>
                  <li>法律に反するその他の素材</li>
                </ul>
              </li>
              <li>
                当サイトは動画へのリンク提供のみを行っており、
                18&nbsp;U.S.C.&nbsp;§2257（記録保持義務）および
                DMCA（著作権侵害対応）について一切の責任を負いません。
              </li>
            </ul>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAgree}
                className="rounded-md bg-blue-500 py-2 px-6 font-medium text-white transition hover:bg-blue-600"
              >
                同意して続行
              </button>
            </div>
          </div>
        </PopupManager>
      )}

      <PopupManager>
        <AdBanner />
      </PopupManager>

      <div className="relative">
        {/* 固定のタブボタン領域 */}
        {/* <TabNavigation /> */}
        <Header />
        {/* ヘッダーの高さ分、上部にパディングを追加（例：p-t-20） */}
        <div
          ref={containerRef}
          className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20"
        >
          {videos.length == 0 && (
            <div className="flex h-screen flex-col items-center justify-center bg-black px-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              <p className="mt-4 text-center text-sm leading-snug text-white">
                動画を読み込み中...
              </p>
              <p className="mt-2 max-w-xs text-center text-sm text-gray-400">
                ネットワーク状況が不安定な場合、読み込みに時間がかかることがあります。
              </p>
            </div>
          )}
          {videos.length !== 0 &&
            videos.map((video, index) => {
              // インデックス差によるレンダリング制御（ここでは±10）
              const shouldRenderVideo = Math.abs(index - activeIndex) <= 10;
              return (
                <>
                  {/* {(index + 1) % 3 === 0 && (
                  <VideoItem
                    setVideos={setVideos}
                    video={video}
                    isActive={index === activeIndex}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    shouldRenderVideo={shouldRenderVideo}
                    likeVideo={likeVideo}
                    commentVideo={commentVideo}
                    isAd={true} // 3件ごとに広告を表示するフラグ
                  />
                )} */}
                  <VideoItem
                    key={video.id}
                    setVideos={setVideos}
                    video={video}
                    isActive={index === activeIndex}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    shouldRenderVideo={shouldRenderVideo}
                    likeVideo={likeVideo}
                    commentVideo={commentVideo}
                    isAd={false} // 3件ごとに広告を表示するフラグ
                  />
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default MainVideoListPresenter;
