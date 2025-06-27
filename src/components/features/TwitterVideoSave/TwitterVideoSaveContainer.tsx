import { TwitterVideoSavePresenter } from "@/components/features/TwitterVideoSave/TwitterVideoSavePresenter";
import axios from "axios";
import { useState } from "react";

export function TwitterVideoSaveContainer() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTwitterVideoByUrl = async (url: string) => {
    try {
      if (!url) {
        setError("URLを入力してください。");
        return;
      }

      setError("");
      setIsLoading(true);

      const response = await axios.get(`${apiUrl}/twitter/get-video-url`, {
        params: { url: url },
      });

      if (response.status === 200) {
        setError("");
      }

      setVideoUrl(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError("URLを取得できませんでした。");
        }
      } else {
        setError("不明なエラーが発生しました。");
      }
      console.error("APIエラー:", error);
    }
    setIsLoading(false);
  };

  console.log(error);
  return (
    <TwitterVideoSavePresenter
      getTwitterVideoByUrl={getTwitterVideoByUrl}
      tweetUrl={tweetUrl}
      setTweetUrl={setTweetUrl}
      videoUrl={videoUrl}
      setVideoUrl={setVideoUrl}
      error={error}
      isLoading={isLoading}
    />
  );
}
