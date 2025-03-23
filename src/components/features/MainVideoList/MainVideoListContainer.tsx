import axios from "axios";
import { useEffect, useState } from "react";
import { MainVideoListPresenter } from "@/components/features/MainVideoList/MainVideoListPresenter";
import { Video } from "@/entities/video/entity";

export function MainVideoListContainer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limitNumber = 5;

  const fetchVideos = async (offset: number, limit: number = limitNumber) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://192.168.40.176:8000/videos", {
        params: { offset, limit },
      });
      // 取得した動画を既存のリストに連結
      setVideos((prev) => [...prev, ...response.data.videos]);
    } catch (error) {
      console.error("APIエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回ロード（offset=0）
  useEffect(() => {
    fetchVideos(0, limitNumber);
  }, []);

  console.log(videos.length, limitNumber);
  // リストの末尾に到達したら追加取得
  const loadMore = () => {
    if (!isLoading) {
      fetchVideos(videos.length, limitNumber);
    }
  };

  return <MainVideoListPresenter videos={videos} loadMore={loadMore} />;
}
