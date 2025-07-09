import { Comment, Video } from "@/entities/video/entity";
import React from "react";
import { PiUserCircleLight } from "react-icons/pi";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number;
  comments?: Comment[];
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
  const initialScrollY = React.useRef<number>(0);
  const [comment, setComment] = React.useState("");
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  React.useEffect(() => {
    if (isOpen) {
      initialScrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${initialScrollY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, initialScrollY.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickCommentButton = async () => {
    commentVideo(videoId, comment);
    await sleep(400);
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              comments: [
                { id: 0, video_id: videoId, comment },
                ...(v.comments ?? []),
              ],
            }
          : v,
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
        className="mx-auto w-full max-w-lg flex-col rounded-t-lg bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">コメント</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>
        <div className="mt-2 border-b"></div>
        <div className="mt-4 flex-grow overflow-y-auto border-b">
          <div className="flex flex-col gap-4">
            {(!comments || comments.length === 0) && (
              <div className="py-4 text-center text-gray-500">
                一番乗りにコメントしましょう！
              </div>
            )}
            {comments?.map((c) => (
              <div key={c.id} className="flex gap-2">
                <PiUserCircleLight size={48} />
                <div className="flex w-full flex-col">
                  <span className="text-sm font-bold">unknown</span>
                  <span className="overflow-wrap-anywhere whitespace-normal">
                    {c.comment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="コメントを入力..."
            className="w-full rounded border p-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && comment) handleClickCommentButton();
            }}
          />
          <button
            onClick={handleClickCommentButton}
            disabled={!comment}
            className={`${
              comment ? "bg-blue-500" : "bg-gray-400"
            } w-20 rounded p-2 text-white`}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
