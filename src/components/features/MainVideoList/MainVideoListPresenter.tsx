import { TabNavigation } from "@/components/features/MainVideoList/TabNavigation";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
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

  // activeIndex を localStorage に保存
  useEffect(() => {
    localStorage.setItem("lastActiveIndex", activeIndex.toString());
  }, [activeIndex]);

  // マウント時に保存された activeIndex に基づいてスクロール位置を復元
  useLayoutEffect(() => {
    if (!hasRestoredRef.current && containerRef.current && videos.length > 0) {
      containerRef.current.scrollTop = activeIndex * window.innerHeight;
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
    <div className="relative">
      {/* 固定のタブボタン領域 */}
      <TabNavigation />
      {/* ヘッダーの高さ分、上部にパディングを追加（例：p-t-20） */}
      <div
        ref={containerRef}
        className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20"
      >
        {videos.map((video, index) => {
          // インデックス差によるレンダリング制御（ここでは±10）
          const shouldRenderVideo = Math.abs(index - activeIndex) <= 10;
          return (
            <VideoItem
              key={`${video.id}-${index}`}
              setVideos={setVideos}
              video={video}
              isActive={index === activeIndex}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              shouldRenderVideo={shouldRenderVideo}
              likeVideo={likeVideo}
              commentVideo={commentVideo}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MainVideoListPresenter;
