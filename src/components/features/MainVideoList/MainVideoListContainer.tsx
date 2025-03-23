import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MainVideoListPresenter } from "@/components/features/MainVideoList/MainVideoListPresenter";
import { Video } from "@/entities/video/entity";

export function MainVideoListContainer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [offset, setOffset] = useState(0); // オフセット用の state を追加
  const [isLoading, setIsLoading] = useState(false);
  const limitNumber = 10;
  const didFetch = useRef(false); // 最初の呼び出しを追跡する ref

  const fetchVideos = async (
    currentOffset: number,
    limit: number = limitNumber,
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://192.168.40.176:8000/videos", {
        params: { offset: currentOffset, limit },
      });
      // 取得した動画を既存のリストに連結
      setVideos((prev) => [...prev, ...response.data.videos]);
      // オフセットを更新
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error("APIエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回ロード（offset=0）; Strict Mode 対策で useRef を利用
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchVideos(0, limitNumber);
  }, []);

  // リストの末尾に到達したら追加取得
  const loadMore = () => {
    if (!isLoading) {
      fetchVideos(offset, limitNumber);
    }
  };

  return <MainVideoListPresenter videos={videos} loadMore={loadMore} />;
}
