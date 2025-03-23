import React, { useState, useRef, useEffect } from "react";
import { Video } from "@/entities/video/entity";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";

interface MainVideoListPresenterProps {
  videos: Video[];
}

export function MainVideoListPresenter({
  videos,
}: MainVideoListPresenterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // 初期はミュート

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

  return (
    <div
      ref={containerRef}
      className=" h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black"
    >
      {videos.map((video, index) => (
        <VideoItem
          key={video.id}
          video={video}
          isActive={index === activeIndex}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      ))}
    </div>
  );
}

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

function VideoItem({ video, isActive, isMuted, setIsMuted }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  // 最新の isSeeking 状態を参照するための ref
  const isSeekingRef = useRef(false);
  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  // ミュート状態を video 要素に反映
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // active 状態で自動再生／停止
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

  // timeupdate イベントでは、isSeekingRef を利用してドラッグ中は進捗を更新しない

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
      // スペースキー (e.code === "Space" または e.key === " ")
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

  return (
    <div
      className={`chrome-bottom-fix relative flex h-screen snap-start items-center justify-center`}
    >
      {/* 動画本体 */}
      <video
        ref={videoRef}
        src={video.video_url}
        className="h-full w-full object-contain"
        loop
        playsInline
        preload="auto"
        muted={isMuted}
        controls
      />

      {/* 画面右下のボタン群 */}
      <div
        className="absolute bottom-40 right-4 flex flex-col items-center space-y-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className="mb-1 flex h-6 w-8 items-center justify-center text-3xl font-light text-white">
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
        <button onClick={handleComment} className="flex flex-col items-center">
          <div className="mb-1 flex  items-center justify-center font-thin">
            <FaRegCommentDots size={24} />
          </div>
          <span className="text-xs">433</span>
        </button>
        <button onClick={handleSave} className="flex flex-col items-center">
          <div className="mb-1 flex items-center justify-center ">
            <MdOutlineSaveAlt size={24} />
          </div>
          <span className="text-xs">4432</span>
        </button>
        <button onClick={toggleMute} className="flex flex-col items-center">
          <div className="mb-1 flex  items-center justify-center">
            {isMuted ? (
              <IoVolumeMuteOutline size={24} />
            ) : (
              <IoVolumeHighOutline size={24} />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default MainVideoListPresenter;
