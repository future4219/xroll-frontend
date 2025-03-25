import { MainVideoListPresenter } from "@/components/features/MainVideoList/MainVideoListPresenter";
import { Video } from "@/entities/video/entity";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function MainVideoListContainer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limitNumber = 10;
  const didFetch = useRef(false);

  const apiUrl = "http://192.168.40.176:8000";

  const fetchVideos = async (
    currentOffset: number,
    limit: number = limitNumber,
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/videos`, {
        params: { offset: currentOffset, limit },
      });

      console.log(response.data);
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

  const likeVideo = async (id: number) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? { ...video, like_count: video.like_count! + 1 }
          : video,
      ),
    );

    // すでに一回いいねがされていたらreturn
    if (localStorage.getItem(`liked_${id}`)) {
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/videos/${id}/like`);
      console.log(response.data);
      localStorage.setItem(`liked_${id}`, "true");
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

  const commentVideo = async (id: number, comment: string) => {
    try {
      const response = await axios.post(`${apiUrl}/videos/${id}/comment`, {
        comment,
      });
      console.log(response.data);
    } catch (error) {
      console.error("APIエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainVideoListPresenter
      setVideos={setVideos}
      videos={videos}
      loadMore={loadMore}
      likeVideo={likeVideo}
      commentVideo={commentVideo}
    />
  );
}
