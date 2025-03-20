import React, { useState, useRef, useEffect } from "react";
import { Video } from "@/entities/video/entity";

interface MainVideoListPresenterProps {
  videos: Video[];
}

export function MainVideoListPresenter({
  videos,
}: MainVideoListPresenterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      className="h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black"
    >
      {videos.map((video, index) => (
        <VideoItem
          key={video.id}
          video={video}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
}

interface VideoItemProps {
  video: Video;
  isActive: boolean;
}

function VideoItem({ video, isActive }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // 初期はミュート
  const [isPlaying, setIsPlaying] = useState(true);
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
      setProgress(0);
    }
  }, [isActive]);

  // timeupdate イベントでは、isSeekingRef を利用してドラッグ中は進捗を更新しない
  useEffect(() => {
    if (!videoRef.current) return;
    const handleTimeUpdate = () => {
      if (
        videoRef.current &&
        videoRef.current.duration &&
        !isSeekingRef.current
      ) {
        setProgress(videoRef.current.currentTime / videoRef.current.duration);
      }
    };
    const videoEl = videoRef.current;
    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // 動画タップで再生/ポーズ切替
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // シーク更新用の共通処理
  const updateSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    // console.log(rect)
    console.log(e.clientX, rect.left);

 console.log("clientX", e.clientX);
 console.log("screenX", e.screenX);
 console.log("pageX", e.nativeEvent.pageX);
  console.log("offsetX", e.nativeEvent.offsetX);
  console.log("e.movement")

    let x = e.clientX - rect.left;
    // console.log(x, rect.width);

    let newProgress = x / rect.width;
    // console.log(newProgress);
    newProgress = Math.max(0, Math.min(1, newProgress));
    // console.log(newProgress);
    setProgress(newProgress);

    if (videoRef.current.duration) {
      // console.log(videoRef.current.duration, newProgress);
      videoRef.current.currentTime = videoRef.current.duration * newProgress;
      // console.log(videoRef.current.currentTime);
    }
  };
  // ドラッグ開始時
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSeeking(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSeek(e);
  };

  // ドラッグ中
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // console.log("pointer move");
    e.stopPropagation();
    if (isSeeking) {
      // console.log("seeking");
      updateSeek(e);
    }
  };

  // ドラッグ終了時
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isSeeking) {
      updateSeek(e);
      setIsSeeking(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative flex h-screen snap-start items-center justify-center"
      onClick={togglePlay}
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

      {/* 再生中でない場合、中央に薄い ▶ アイコンを表示 */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl text-white opacity-50">▶</div>
        </div>
      )}

      {/* 画面右下のボタン群 */}
      <div
        className="absolute bottom-40 right-4 flex flex-col items-center space-y-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            ♡
          </div>
          <span className="text-xs">12.3k</span>
        </button>
        <button onClick={handleComment} className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            💬
          </div>
          <span className="text-xs">433</span>
        </button>
        <button onClick={handleSave} className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            📁
          </div>
          <span className="text-xs">4432</span>
        </button>
        <button onClick={toggleMute} className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            {isMuted ? "🔇" : "🔊"}
          </div>
          <span className="text-xs">{isMuted ? "音声OFF" : "音声ON"}</span>
        </button>
      </div>

      {/* 再生バー：クリック・ドラッグでシーク可能 */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-gray-600"
        ref={progressBarRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* 現在の進捗を示すバー */}
        <div
          className="h-full bg-red-500"
          style={{ width: `${progress * 100}%` }}
        />
        {/* ドラッグ可能なハンドル */}
        <div
          className="absolute -top-2 h-5 w-5 -translate-x-1/2 rounded-full bg-white"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export default MainVideoListPresenter;
