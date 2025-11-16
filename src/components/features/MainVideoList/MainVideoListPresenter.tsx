import { XrollFeaturePopup } from "@/components/ads/GofileControllerPromoPopup";
import AdBanner, { AdBanner1097564 } from "@/components/ads/juicyAds";
import JuicyAdsPopup from "@/components/ads/juicyAdsPopup";
import { OfficialTiktokNotice } from "@/components/ads/OfficialTiktokNotice";
import { StripcashPrPopup } from "@/components/ads/StripcashPrPopup";
import { UpdateNoticePopup } from "@/components/ads/UpdateNoticePopup";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
import { Header } from "@/components/ui/Header";
import PopupManager from "@/components/ui/PopupManager";
import { Spinner } from "@/components/ui/Spinner";
import { Video } from "@/entities/video/entity";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation } from "react-router-dom";

interface MainVideoListPresenterProps {
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  videos: Video[];
  loadMore: () => void;
  likeVideo: (id: number) => void;
  commentVideo: (id: number, comment: string) => void;
  isMainVideoList?: boolean;
  isRealtimeVideoList?: boolean;
}

export function MainVideoListPresenter({
  setVideos,
  videos,
  loadMore,
  likeVideo,
  commentVideo,
  isMainVideoList = false,
  isRealtimeVideoList = false,
}: MainVideoListPresenterProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [view, setView] = useState<string>("reels");

  useEffect(() => {
    const vp = params.get("view");
    setView(vp === "thumbs" ? "thumbs" : "reels");
  }, [params]);

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const stored = localStorage.getItem("lastActiveIndex");
    return stored ? Number(stored) : 0;
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const hasRestoredRef = useRef(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [focusedVideoId, setFocusedVideoId] = useState<number>();
  const [savedScrollY, setSavedScrollY] = useState<number>(0);

  useEffect(() => {
    if (!isVideoModalOpen) {
      window.scrollTo(0, savedScrollY);
    }
  }, [isVideoModalOpen, savedScrollY]);

  useEffect(() => {
    localStorage.setItem("lastActiveIndex", activeIndex.toString());
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (
      view !== "reels" ||
      !containerRef.current ||
      videos.length === 0 ||
      hasRestoredRef.current
    )
      return;
    const idx = Number(localStorage.getItem("lastActiveIndex")) || 0;
    setActiveIndex(idx);
    const waiter = setInterval(() => {
      const children = containerRef.current?.children ?? [];
      if (children.length >= videos.length) {
        clearInterval(waiter);
        requestAnimationFrame(() => {
          if (containerRef.current)
            containerRef.current.scrollTop = idx * window.innerHeight;
          hasRestoredRef.current = true;
        });
      }
    }, 100);
    return () => clearInterval(waiter);
  }, [videos, view]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      let closest = 0;
      let minDiff = Infinity;
      children.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const diff = Math.abs(
          rect.top + rect.height / 2 - window.innerHeight / 2,
        );
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (view !== "thumbs") return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowH = window.innerHeight;
      const fullH = document.body.scrollHeight;
      if (!isFetchingMore && scrollTop + windowH >= fullH - 100) {
        setIsFetchingMore(true);
        loadMore();
        setTimeout(() => setIsFetchingMore(false), 1000);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [view, isFetchingMore, loadMore]);

  // ① 従来の activeIndex 到達トリガー（残す）
  useEffect(() => {
    if (view === "reels" && activeIndex === videos.length - 1) {
      loadMore();
    }
  }, [activeIndex, videos.length, loadMore, view]);

  // ② reels のスクロール量で「底付近」を検知してもフェッチ
  useEffect(() => {
    if (view !== "reels") return;
    const c = containerRef.current;
    if (!c) return;
    const THRESHOLD_PX = 200; // 底から200px 以内で発火
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const nearBottom =
          c.scrollTop + c.clientHeight >= c.scrollHeight - THRESHOLD_PX;
        if (nearBottom) loadMore();
      });
    };
    c.addEventListener("scroll", onScroll);
    return () => c.removeEventListener("scroll", onScroll);
  }, [view, loadMore]);

  return (
    <div>
      <PopupManager enableCountdown={false}>
        <AdBanner1097564 />
      </PopupManager>
      <StripcashPrPopup />
      <UpdateNoticePopup />
      <XrollFeaturePopup />
      <OfficialTiktokNotice />
      <Header
        isRealtimeVideoList={isRealtimeVideoList}
        isMainVideoList={isMainVideoList}
      />

      {view === "reels" && (
        <div
          ref={containerRef}
          className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20"
          style={{ height: "100dvh" }}
        >
          {videos.length === 0 ? (
            <Spinner
              message={
                <>
                  読み込み中です…
                  <br />
                  <span className="text-xs text-gray-400">
                    ※22:00〜24:00の時間帯はアクセス集中により遅くなる場合があります。しばらくお待ち下さい。
                  </span>
                </>
              }
            />
          ) : (
            videos.map((video, idx) => {
              const shouldRender = Math.abs(idx - activeIndex) <= 30;
              return (
                <VideoItem
                  key={video.id}
                  setVideos={setVideos}
                  video={video}
                  isActive={idx === activeIndex}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  shouldRenderVideo={shouldRender}
                  likeVideo={likeVideo}
                  commentVideo={commentVideo}
                  isAd={false}
                  observerRoot={containerRef.current}
                />
              );
            })
          )}
        </div>
      )}

      {view === "thumbs" && (
        <div className="bg-black">
          {isVideoModalOpen ? (
            <div className="relative">
              <Header
                isMainVideoList={isMainVideoList}
                isRealtimeVideoList={isRealtimeVideoList}
              />
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-16 z-50 flex rounded px-2 py-1 font-bold text-white focus:outline-none"
              >
                <IoIosArrowBack size={24} />
                <span>戻る</span>
              </button>
              <div ref={containerRef} className="w-full bg-black">
                <VideoItem
                  key={`${focusedVideoId}-modal`}
                  setVideos={setVideos}
                  video={videos.find((v) => v.id === focusedVideoId)!}
                  isActive
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  shouldRenderVideo
                  likeVideo={likeVideo}
                  commentVideo={commentVideo}
                  isAd={false}
                  observerRoot={containerRef.current}
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Header
                isMainVideoList={isMainVideoList}
                isRealtimeVideoList={isRealtimeVideoList}
              />
              {videos.length === 0 ? (
                <Spinner
                  message={
                    <>
                      読み込み中です…
                      <br />
                      <span className="text-xs text-gray-400">
                        ※22:00〜24:00の時間帯はアクセス集中により遅くなる場合があります。しばらくお待ちください。
                      </span>
                    </>
                  }
                />
              ) : (
                <div className="grid grid-cols-3 gap-[2px] bg-black sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSavedScrollY(window.scrollY);
                        setIsVideoModalOpen(true);
                        setFocusedVideoId(video.id);
                      }}
                      className="mb-1 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail_url}
                        alt="thumbnail"
                        className="mx-auto aspect-[9/16] w-full object-contain shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {isFetchingMore && (
                // テキストの代わりに小さめスピナー
                <Spinner message="さらに読み込み中…" size={28} full={false} />
              )}
              {/* {videos.length === 0 && (
                <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center text-white">
                  <p className="text-lg font-semibold sm:text-xl">
                    {isMainVideoList ? "おすすめ" : "リアルタイム"}
                    の動画はありません。
                  </p>
                  <p className="mt-3 max-w-md text-sm text-gray-300 sm:text-base">
                    現在メンテナンス中です。申し訳ありませんが、
                    <br className="sm:hidden" />
                    しばらくお待ちください。
                  </p>
                </div>
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MainVideoListPresenter;
