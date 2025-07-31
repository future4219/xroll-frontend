import AdBanner, { AdBanner1097564 } from "@/components/ads/juicyAds";
import JuicyAdsPopup from "@/components/ads/juicyAdsPopup";
import { StripcashPrPopup } from "@/components/ads/StripcashPrPopup";
import { UpdateNoticePopup } from "@/components/ads/UpdateNoticePopup";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
import { Header } from "@/components/ui/Header";
import PopupManager from "@/components/ui/PopupManager";
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

  useEffect(() => {
    if (view === "reels" && activeIndex === videos.length - 1) {
      loadMore();
    }
  }, [activeIndex, videos.length, loadMore, view]);

  return (
    <div>
      <PopupManager subtleCloseButton>
        <AdBanner1097564 />
      </PopupManager>
      <StripcashPrPopup />
      <UpdateNoticePopup />
      <Header isMainVideoList />

      {view === "reels" && (
        <div
          ref={containerRef}
          className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20"
          style={{ height: "100dvh" }}
        >
          {videos.length === 0 ? (
            <div className="flex h-screen flex-col items-center justify-center bg-black px-4">
              {/* ロード中UI */}
            </div>
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
              <Header isMainVideoList />
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
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Header isMainVideoList />
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
              {isFetchingMore && (
                <div className="py-4 text-center text-sm text-white">
                  さらに読み込み中…
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
  );
}

export default MainVideoListPresenter;
