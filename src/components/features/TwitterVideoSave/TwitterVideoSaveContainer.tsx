import { TwitterVideoSavePresenter } from "@/components/features/TwitterVideoSave/TwitterVideoSavePresenter";
import axios from "axios";
import { useState } from "react";

export function TwitterVideoSaveContainer() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  const getTwitterVideoByUrl = async (url: string) => {
    try {
      const response = await axios.get(`${apiUrl}/twitter/get-video-url`, {
        params: { url: url },
      });
      setVideoUrl(response.data);
    } catch (error) {
      console.error("APIエラー:", error);
    }
  };

  return (
    <TwitterVideoSavePresenter
      getTwitterVideoByUrl={getTwitterVideoByUrl}
      tweetUrl={tweetUrl}
      setTweetUrl={setTweetUrl}
      videoUrl={videoUrl}
      setVideoUrl={setVideoUrl}
    />
  );
}
