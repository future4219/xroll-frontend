import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MainVideoListPresenter } from "@/components/features/MainVideoList/MainVideoListPresenter";
import { Video } from "@/entities/video/entity";

export function MainVideoListContainer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limitNumber = 10;
  const didFetch = useRef(false);

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

  // 初回ロード：localStorage の activeIndex に応じた件数を一度に取得
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    const storedIndexStr = localStorage.getItem("lastActiveIndex");
    let initialLimit = limitNumber;
    if (storedIndexStr) {
      const storedIndex = Number(storedIndexStr);
      // 保存された activeIndex までの動画が取得できるよう、limitNumber の倍数に丸める
      initialLimit = Math.ceil((storedIndex + 1) / limitNumber) * limitNumber;
    }
    fetchVideos(0, initialLimit);
  }, []);

  // リストの末尾に到達したら追加取得
  const loadMore = () => {
    if (!isLoading) {
      fetchVideos(offset, limitNumber);
    }
  };

  return <MainVideoListPresenter videos={videos} loadMore={loadMore} />;
}
