import { LikeVideoListPresenter } from "@/components/features/LikeVideoList/LikeVideoListPresenter";
import { Video } from "@/entities/video/entity";
import axios from "axios";
import { useEffect, useState } from "react";

export function LikeVideoListContainer() {
  const apiUrl = "http://192.168.40.176:8000";

  const [likeVideos, setLikeVideos] = useState<Video[]>([]);

  const getLikedVideoIds = (): {
    id: string;
    timestamp: string;
  }[] => {
    const likedVideos: {
      id: string;
      timestamp: string;
    }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("liked-")) {
        const videoId = key.replace("liked-", "");
        const timestamp = localStorage.getItem(key);
        likedVideos.push({ id: videoId, timestamp: timestamp! });
      }
    }

    // likedVideosをtimestampの降順にソート
    likedVideos.sort((a, b) => {
      if (a.timestamp < b.timestamp) return 1;
      if (a.timestamp > b.timestamp) return -1;
      return 0;
    });
    return likedVideos;
  };

  const fetchVideosByIds = async (ids: string[]) => {
    // idsをカンマ区切りに
    const idsString: string = ids.join(",");

    try {
      const response = await axios.get(`${apiUrl}/videos/multiple`, {
        params: { ids: idsString },
      });

      // idsの順（timestamp降順）に並び替え
      response.data.videos.sort((a: Video, b: Video) => {
        return ids.indexOf(a.id.toString()) - ids.indexOf(b.id.toString());
      });

      setLikeVideos(response.data.videos);
      console.log(response);
    } catch (error) {
      console.error("APIエラー:", error);
    }
  };
  //初回ロード：localStorage に保存された liked フラグを持つ動画を取得
  useEffect(() => {
    const likedVideos = getLikedVideoIds();
    console.log(likedVideos.map((video) => video.id));
    fetchVideosByIds(likedVideos.map((video) => video.id));
  }, []);

  const likeVideo = async (id: number) => {
    setLikeVideos((prev) =>
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
    }
  };

  return (
    <LikeVideoListPresenter
      setLikeVideos={setLikeVideos}
      likeVideos={likeVideos}
      likeVideo={likeVideo}
      commentVideo={commentVideo}
    />
  );
}
