import { TabNavigation } from "@/components/features/MainVideoList/TabNavigation";
import VideoItem from "@/components/features/MainVideoList/VideoItem";
import { Video } from "@/entities/video/entity";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

interface LikeVideoListPresenterProps {
  setLikeVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  likeVideos: Video[];
  likeVideo: (id: number) => void;
  commentVideo: (id: number, comment: string) => void;
}

export function LikeVideoListPresenter({
  setLikeVideos,
  likeVideos,
  likeVideo,
  commentVideo,
}: LikeVideoListPresenterProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(true);

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

  // モーダルが開いたタイミングでクリックした動画位置からスクロールする
  useLayoutEffect(() => {
    if (isVideoModalOpen && containerRef.current) {
      // 各動画が h-screen と仮定して、その位置にスクロール
      containerRef.current.scrollTop = activeIndex * window.innerHeight;
    }
  }, [isVideoModalOpen, activeIndex]);

  return (
    <div>
      {isVideoModalOpen ? (
        <div className="relative">
          {/* 戻るボタン */}
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-8 z-50  flex rounded px-3  py-1 font-bold text-white  focus:outline-none"
          >
            <IoIosArrowBack size={24} />
            <div>戻る</div>
          </button>
          {/* モーダル内のコンテンツ領域 */}
          <div
            ref={containerRef}
            className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black pt-20"
          >
            {likeVideos.map((video, index) => {
              // インデックス差によるレンダリング制御（ここでは±10）
              const shouldRenderVideo = Math.abs(index - activeIndex) <= 10;
              return (
                <VideoItem
                  key={`${video.id}-${index}`}
                  setVideos={setLikeVideos}
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
      ) : (
        <div className="relative">
          {/* 固定のタブ領域 */}
          <TabNavigation />
          {/* コンテンツ領域 */}
          <div className="columns-2 gap-[2px] sm:columns-3 md:columns-4 lg:columns-5">
            {likeVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => {
                  setActiveIndex(index);
                  setIsVideoModalOpen(true);
                }}
                className="mb-[2px] cursor-pointer break-inside-avoid"
              >
                <img
                  src={video.thumbnail_url}
                  alt={`Video ${index}`}
                  className="h-auto w-full shadow-sm"
                />
                
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
