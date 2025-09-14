import { GofileUserPresenter } from "@/components/features/Gofile/GofileUserPresenter";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { adaptVideoToGofileVideo } from "./GofileVault/GofileVaultContainer";
import {
  GofileVideoListRes,
  GofileVideoRes,
  GofileVideo,
  User,
  adaptUserResToUser,
  UserRes,
} from "@/components/features/Gofile/GofileVault/types";
import api from "@/lib/api";

export function GofileUserContainer() {
  const [rawItems, setRawItems] = useState<GofileVideo[]>([]);
  const USER_ID = new URLSearchParams(window.location.search).get("id");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<UserRes>(`${apiUrl}/users/${USER_ID}`);
        setUser(adaptUserResToUser(data));
      } catch (e) {
        console.error("Failed to fetch user info:", e);
        setUser({} as User);
      }
    })();
  }, [USER_ID]);

  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<GofileVideoListRes>(
          `${apiUrl}/gofile/${USER_ID}/shared`,
        );
        const videos = (data?.videos ?? []) as GofileVideoRes[];
        const list: GofileVideo[] = videos.map(adaptVideoToGofileVideo);
        setRawItems(list);
      } catch (e) {
        console.error("Failed to fetch Gofile user items:", e);
        setRawItems([]);
      }
    })();
  }, [USER_ID]);

  const items = useMemo(() => {
    let all = [...rawItems].sort(
      (a, b) => +new Date(b.CreatedAt!) - +new Date(a.CreatedAt!),
    );
    return all.filter((i) => i.IsShared);
  }, [rawItems]);

  // ここが今回の追加: プロフィール保存
  const handleSaveProfile = async ({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) => {
    if (!USER_ID) return;

    // 楽観的更新（API成功前にUIを先に更新）
    setUser((prev) => ({ ...prev, Name: name, Bio: bio }));

    // API: PATCH /users/:id に name, bio（bio）を送る想定
    // ※ バックエンドが name だけ対応なら bio は省略してください
    await api.patch(`${apiUrl}/users/${USER_ID}`, {
      name,
      bio: bio,
    });

    // 成功後に再取得したい場合は下を有効化
    // const { data } = await api.get<UserRes>(`${apiUrl}/users/${USER_ID}`);
    // setUser(adaptUserResToUser(data));
  };

  // 自分のプロフィールかどうか（必要なら認証ユーザーIDと比較）
  const isMe = USER_ID === localStorage.getItem("userId");

  return (
    <GofileUserPresenter
      items={items}
      user={user}
      onSaveProfile={handleSaveProfile}
      isMe={isMe}
    />
  );
}
