import React, { useState, useRef, useEffect } from "react";
import { Video } from "@/entities/video/entity";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { useInView } from "react-intersection-observer";

interface MainVideoListPresenterProps {
  videos: Video[];
  loadMore: () => void;
}

export function MainVideoListPresenter({
  videos,
  loadMore,
}: MainVideoListPresenterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

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
    <div
      ref={containerRef}
      className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black"
    >
      {videos.map((video, index) => {
        // インデックス差によるレンダリング制御（±5）
        const shouldRenderVideo = Math.abs(index - activeIndex) <= 10;
        return (
          <VideoItem
            key={`${video.id}-${index}`}
            video={video}
            isActive={index === activeIndex}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            shouldRenderVideo={shouldRenderVideo}
          />
        );
      })}
    </div>
  );
}

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  shouldRenderVideo: boolean;
}

function VideoItem({
  video,
  isActive,
  isMuted,
  setIsMuted,
  shouldRenderVideo,
}: VideoItemProps) {
  // フックは常に呼ぶ
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(false);

  // IntersectionObserver で実際の可視性を取得
  const { ref, inView } = useInView({
    threshold: 0.5, // 50%以上表示されているかどうか
    triggerOnce: false,
  });

  // フックの順序は常に一定
  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch((err) => {
        if (err.name !== "AbortError") console.error("再生エラー:", err);
      });
      setIsPlaying(true);
    } else {
      v.pause();
      v.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.error("再生エラー:", err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    console.log("いいね clicked for video", video.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("コメント clicked for video", video.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("保存 clicked for video", video.id);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // deviceFix() の結果をメモ化
  const deviceClass = React.useMemo(() => {
    const ua = navigator.userAgent;
    if (
      ua.indexOf("iPhone") > 0 ||
      ua.indexOf("iPod") > 0 ||
      (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)
    ) {
      return "safari-bottom-fix";
    }
    return "";
  }, []);

  // 両方の条件を満たす場合にコンテンツをレンダリング
  const shouldRenderContent = shouldRenderVideo && inView;

  return (
    // IntersectionObserver の ref をコンテナ div に設定
    <div
      ref={ref}
      className={`${deviceClass} relative flex h-screen snap-start items-center justify-center`}
    >
      {shouldRenderContent ? (
        <>
          {/* 動画本体 */}
          <video
            ref={videoRef}
            src={video.video_url}
            className="h-full w-full object-contain"
            loop
            playsInline
            preload={isActive ? "auto" : "metadata"}
            muted={isMuted}
            controls
          />
          {/* 画面右下のボタン群 */}
          <div
            className="absolute bottom-40 right-4 flex flex-col items-center space-y-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleLike} className="flex flex-col items-center">
              <div className="mb-1 flex h-6 w-8 items-center justify-center text-3xl font-light">
                {isLiked ? (
                  <div className="text-red-500">
                    <BsHeartFill size={20} />
                  </div>
                ) : (
                  <BsHeart size={20} />
                )}
              </div>
              <span className="text-xs">12.3k</span>
            </button>
            <button
              onClick={handleComment}
              className="flex flex-col items-center"
            >
              <div className="mb-1 flex items-center justify-center font-thin">
                <FaRegCommentDots size={24} />
              </div>
              <span className="text-xs">433</span>
            </button>
            <button onClick={handleSave} className="flex flex-col items-center">
              <div className="mb-1 flex items-center justify-center">
                <MdOutlineSaveAlt size={24} />
              </div>
              <span className="text-xs">4432</span>
            </button>
            <button onClick={toggleMute} className="flex flex-col items-center">
              <div className="mb-1 flex items-center justify-center">
                {isMuted ? (
                  <IoVolumeMuteOutline size={24} />
                ) : (
                  <IoVolumeHighOutline size={24} />
                )}
              </div>
            </button>
          </div>
        </>
      ) : (
        // プレースホルダー（コンテンツが表示されない場合）
        <div className="h-full w-full bg-black"></div>
      )}
    </div>
  );
}

export default MainVideoListPresenter;
