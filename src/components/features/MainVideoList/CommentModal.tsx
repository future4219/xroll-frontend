// CommentModal.tsx
import { Comment, Video } from "@/entities/video/entity";
import React, { useEffect } from "react";
import { PiUserCircleLight } from "react-icons/pi";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number;
  comments: Comment[];
  commentVideo: (id: number, comment: string) => void;
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
}

export function CommentModal({
  isOpen,
  onClose,
  videoId,
  comments,
  commentVideo,
  setVideos,
}: CommentModalProps) {
  if (!isOpen) return null;
console.log(comments);
  const [comment, setComment] = React.useState("");
  const sleep = (msec: number) =>
    new Promise((resolve) => setTimeout(resolve, msec));

  // コメントモーダルが開いた時に 後ろの動画がスクロールできないように固定する(iphone対応)
  useEffect(() => {
    // 固定する前に現在のスクロール位置を保持
    const scrollY = window.scrollY;
    // body を固定し、上部位置を保持することで背景スクロールやレイアウトのずれを防ぐ
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    return () => {
      // 固定解除時に元のスクロール位置に戻す
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClickCommentButton = async () => {
    commentVideo(videoId, comment);

    await sleep(400);
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? {
              ...video,
              comments: [
                { id: 0, video_id: videoId, comment },
                ...(video.comments ?? []),
              ],
            }
          : video,
      ),
    );
    setComment("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-2/3 w-full flex-col rounded-t-lg bg-white p-4 sm:max-w-lg"
        onClick={(e) => e.stopPropagation()} // モーダル内クリック時に親の onClick を防ぐ
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">コメント</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        <div className="mt-2 border-b"></div>

        {/* コメント一覧エリア */}
        <div className="mt-4 flex-grow overflow-y-auto border-b">
          <div className="flex flex-col gap-4">
            {comments?.length === 0 ||
              (comments == undefined && (
                <div className="py-4 text-center text-gray-500">
                  一番乗りにコメントしましょう！
                </div>
              ))}
            {comments?.map((c) => (
              <div key={c.id} className="flex gap-2">
                <PiUserCircleLight size={48} />
                <div className="flex w-full flex-col">
                  <span className="text-sm font-bold">unknown</span>
                  <span
                    className="whitespace-normal"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {c.comment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* コメント入力エリア */}
        <div className="mt-4 flex gap-10">
          <input
            type="text"
            placeholder="コメントを入力..."
            className="w-full rounded border p-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && comment !== "") {
                handleClickCommentButton();
              }
            }}
          />
          <button
            onClick={handleClickCommentButton}
            className={`${
              comment === "" ? "bg-gray-400" : "bg-blue-500"
            } w-20 rounded p-2 text-white`}
            disabled={comment === ""}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
