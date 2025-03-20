import axios from "axios";
import { useEffect, useState } from "react";
import { MainVideoListPresenter } from "@/components/features/MainVideoList/MainVideoListPresenter";
import { Video } from "@/entities/video/entity";

export function MainVideoListContainer() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    axios
      .get("http://192.168.40.176:8000/videos")
      .then((response) => {
        console.log(response.data);
        // APIのレスポンスが { videos: [...] } の形の場合
        setVideos(response.data.videos);
      })
      .catch((error) => {
        console.error("APIエラー:", error);
      });
  }, []);
  

  return <MainVideoListPresenter videos={videos} />;
}
