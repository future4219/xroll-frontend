import TwitterLogo from "@/components/ui/TwitterLogo.png";
import AdBanner from "@/components/ads/juicyAds";
import { CommentModal } from "@/components/features/MainVideoList/CommentModal";
import { Video } from "@/entities/video/entity";
import { is } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useInView } from "react-intersection-observer";

interface VideoItemProps {
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  video: Video;
  isActive: boolean;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  shouldRenderVideo: boolean;
  likeVideo: (id: number) => void;
  commentVideo: (id: number, comment: string) => void;
  isAd: boolean;
}

function VideoItem({
  setVideos,
  video,
  isActive,
  isMuted,
  setIsMuted,
  shouldRenderVideo,
  likeVideo,
  commentVideo,
  isAd,
}: VideoItemProps) {
  // フックは常に呼ぶ
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // IntersectionObserver で実際の可視性を取得
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

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

  // active になったとき、動画が再生されていなければ再試行するポーリング処理（最大5回、300ms間隔）
  useEffect(() => {
    if (isActive && videoRef.current) {
      let attempts = 0;
      const maxAttempts = 5;
      const intervalId = setInterval(() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current
            .play()
            .then(() => {
              clearInterval(intervalId);
            })
            .catch((err) => {
              console.error("再生エラー (ポーリング):", err);
              attempts++;
              if (attempts >= maxAttempts) {
                clearInterval(intervalId);
              }
            });
        } else {
          clearInterval(intervalId);
        }
      }, 300);
      return () => clearInterval(intervalId);
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

    if (isLiked) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, like_count: v.like_count! - 1 } : v,
        ),
      );
      localStorage.removeItem(`liked-${video.id}`);
    } else {
      // タイムスタンプを保存することで、いいねの順番を保持
      localStorage.setItem(`liked-${video.id}`, new Date().toISOString());
      likeVideo(video.id);
    }
    setIsLiked((prev) => !prev);
  };

  const handleClickCommentButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentModalOpen(true);
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

  const handleTwitterIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tweetUrl = video.tweet_url;
    window.open(tweetUrl, "_blank");
  };

  // 両方の条件を満たす場合にコンテンツをレンダリング
  const shouldRenderContent = shouldRenderVideo && inView;

  return (
    <div
      ref={ref}
      className={`${deviceClass} relative flex h-screen snap-start items-center justify-center`}
    >
      {shouldRenderContent ? (
        <>
          {isAd ? (
            <AdBanner />
          ) : (
            <>
              <video
                ref={videoRef}
                src={video.video_url}
                className=" h-full w-full object-contain"
                loop
                playsInline
                autoPlay
                preload={isActive ? "auto" : "metadata"}
                muted={isMuted}
                controls
                onLoadedData={() => {
                  if (isActive && videoRef.current) {
                    setTimeout(() => {
                      videoRef.current
                        ?.play()
                        .catch((err) => console.error("再生エラー:", err));
                    }, 100);
                  }
                }}
              />
              <div
                className="absolute bottom-40 right-4 flex flex-col items-center space-y-6 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {video.tweet_url && <button
                  onClick={handleTwitterIconClick}
                  className="flex flex-col items-center"
                >
                  <div className="flex h-6 w-8 items-center justify-center">
                    <img
                      src={TwitterLogo}
                      alt="Twitter Logo"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                </button>}

                <button
                  onClick={handleLike}
                  className="flex flex-col items-center"
                >
                  <div className="mb-1 flex h-6 w-8 items-center justify-center text-3xl font-light">
                    {isLiked || localStorage.getItem(`liked-${video.id}`) ? (
                      <div className="text-red-500">
                        <BsHeartFill size={20} />
                      </div>
                    ) : (
                      <BsHeart size={20} />
                    )}
                  </div>
                  <span className="text-xs">{video.like_count}</span>
                </button>
                <button
                  onClick={handleClickCommentButton}
                  className="flex flex-col items-center"
                >
                  <div className="mb-1 flex items-center justify-center font-thin">
                    <FaRegCommentDots size={24} />
                  </div>
                  <span className="text-xs">{video.comments?.length ?? 0}</span>
                </button>
                <a
                  href={video.video_url}
                  download
                  className="flex flex-col items-center"
                >
                  <div className="mb-1 flex items-center justify-center">
                    <MdOutlineSaveAlt size={24} />
                  </div>
                </a>
                <button
                  onClick={toggleMute}
                  className="flex flex-col items-center"
                >
                  <div className="mb-1 flex items-center justify-center">
                    {isMuted ? (
                      <IoVolumeMuteOutline size={24} />
                    ) : (
                      <IoVolumeHighOutline size={24} />
                    )}
                  </div>
                </button>
              </div>
              <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                videoId={video.id}
                comments={video.comments}
                commentVideo={commentVideo}
                setVideos={setVideos}
              />
            </>
          )}
        </>
      ) : (
        <div className="h-full w-full bg-black"></div>
      )}
    </div>
  );
}

export default VideoItem;
