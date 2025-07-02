import AdBanner from "@/components/ads/juicyAds";
import JuicyAdsPopup from "@/components/ads/juicyAdsPopup";
import { StripcashPrPopup } from "@/components/ads/StripcashPrPopup";
import { UpdateNoticePopup } from "@/components/ads/UpdateNoticePopup";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
import { Header } from "@/components/ui/Header";
import PopupManager from "@/components/ui/PopupManager";
import { Video } from "@/entities/video/entity";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [view, setView] = useState<string>("reels");

  useEffect(() => {
    const viewParam = params.get("view");
    if (viewParam === "thumbs") {
      setView("thumbs");
    } else {
      setView("reels");
    }
  }, [params]);
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

  // サムネイル表示時用の状態管理
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [forcusedVideoId, setFocusedVideoId] = useState<number>();
  const [savedScrollY, setSavedScrollY] = useState<number>(0); // サムネイル表示時のスクロール位置を保存するための状態

  // videosが変わった時にforcusedVideoを更新


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
    if (
      view !== "reels" ||
      !containerRef.current ||
      videos.length === 0 ||
      hasRestoredRef.current
    ) {
      return;
    }

    const storedIndex = Number(localStorage.getItem("lastActiveIndex")) || 0;
    setActiveIndex(storedIndex); // これを明示的に入れる！

    const restore = () => {
      if (!containerRef.current) return;
      containerRef.current.scrollTop = storedIndex * window.innerHeight;
      hasRestoredRef.current = true;
    };

    setTimeout(() => {
      requestAnimationFrame(restore);
    }, 200);
  }, [videos, view]);

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

  useEffect(() => {
    if (view !== "thumbs") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      if (!isFetchingMore && scrollTop + windowHeight >= fullHeight - 100) {
        setIsFetchingMore(true);
        loadMore();

        setTimeout(() => setIsFetchingMore(false), 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view, isFetchingMore, loadMore]);

  // activeIndex が動画リストの最後に到達したら loadMore を呼び出す
  useEffect(() => {
    if (view !== "reels") return; // reels ビューのみで動作
    if (activeIndex === videos.length - 1) {
      loadMore();
    }
  }, [activeIndex, videos.length, loadMore]);

  useEffect(() => {
    if (view === "thumbs") {
      hasRestoredRef.current = false;
    }
  }, [view]);

  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isVideoModalOpen]);

  /////////////////// thumbのためのスクロール位置の保存と復元 ////////////////////////
  // 保存キー
  const SCROLL_Y_KEY = "thumbsScrollY";
  const SCROLL_TIMESTAMP_KEY = "thumbsScrollSavedAt";

  // 1日（ミリ秒）
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // スクロール保存（throttleとかかけたい場合は必要に応じて）
  const hasRestoredScrollRef = useRef(false);

  useEffect(() => {
    if (view !== "thumbs" || isVideoModalOpen || hasRestoredScrollRef.current)
      return;

    const savedY = localStorage.getItem(SCROLL_Y_KEY);
    const savedAt = localStorage.getItem(SCROLL_TIMESTAMP_KEY);
    if (!savedY || !savedAt) return;

    const now = Date.now();
    if (now - Number(savedAt) >= ONE_DAY_MS) {
      localStorage.removeItem(SCROLL_Y_KEY);
      localStorage.removeItem(SCROLL_TIMESTAMP_KEY);
      return;
    }

    // wait for DOM render
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(savedY));
        hasRestoredScrollRef.current = true;
      });
    }, 300);
  }, [view, isVideoModalOpen, videos.length]);
  /////////////////// スクロール位置の保存と復元 ////////////////////////

  useEffect(() => {
    if (view === "reels") {
      hasRestoredRef.current = false;
    }
  }, [view]);

  return (
    <div>
      <PopupManager subtleCloseButton={true}>
        <AdBanner />
      </PopupManager>

      <StripcashPrPopup />
      <UpdateNoticePopup />

      <div className="relative">
        {/* 固定のタブボタン領域 */}
        {/* <TabNavigation /> */}
        <Header isMainVideoList={true} />
        {/* ヘッダーの高さ分、上部にパディングを追加（例：p-t-20） */}
        {view == "reels" && (
          <div
            ref={containerRef}
            className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20 "
            style={{ height: "100dvh" }} // これ追加！
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
                const shouldRenderVideo = Math.abs(index - activeIndex) <= 30;
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
        )}
        {view == "thumbs" && (
          <div className="bg-black">
            {isVideoModalOpen ? (
              <div className="relative">
                <Header isMainVideoList={true} />
                {/* 戻るボタン */}
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    // 少し delay を入れてからスクロール復元（DOM反映後の方が確実）
                    setTimeout(() => {
                      window.scrollTo(0, savedScrollY);
                    }, 0);
                  }}
                  className="absolute top-16 z-50  flex rounded px-2  py-1 font-bold text-white  focus:outline-none"
                >
                  <IoIosArrowBack size={24} />
                  <div>戻る</div>
                </button>
                {/* モーダル内のコンテンツ領域 */}
                <div ref={containerRef} className=" w-full bg-black">
                  <VideoItem
                    key={`${forcusedVideoId}-modal`}
                    setVideos={setVideos}
                    video={videos.find(
                      (v) => v.id === forcusedVideoId,
                    )!} // focusedVideo が undefined でないことを保証
                    isActive={true}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    shouldRenderVideo={true}
                    likeVideo={likeVideo}
                    commentVideo={commentVideo}
                    isAd={false} // 広告は表示しない
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* 固定のタブ領域 */}
                <Header isMainVideoList={true} />
                {/* コンテンツ領域 */}
                <div className="grid grid-cols-3 gap-[2px] bg-black sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSavedScrollY(window.scrollY); // 今のスクロール位置を保存
                        setIsVideoModalOpen(true);
                        setFocusedVideoId(video.id); // フォーカスした動画のIDを保存
                      }}
                      className="mb-1 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail_url}
                        alt={`Video ${index}`}
                        className="mx-auto aspect-[9/16] w-full bg-black object-contain shadow-sm"
                      />
                    </div>
                  ))}
                </div>
                {isFetchingMore && (
                  <div className="col-span-full py-4 text-center text-sm text-white">
                    さらに読み込み中...
                  </div>
                )}

                {videos.length === 0 && (
                  <div className="flex h-screen items-center justify-center font-bold text-white">
                    いいねした動画はありません
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainVideoListPresenter;
