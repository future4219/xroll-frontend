import { GofileUserPresenter } from "@/components/features/Gofile/GofileUserPresenter";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { adaptVideoToVaultItem } from "./GofileVault/GofileVaultContainer";
import {
  GofileVideoListRes,
  GofileVideoRes,
  VaultItem,
} from "./GofileVault/types";
import api from "@/lib/api";

export function GofileUserContainer() {
  const [rawItems, setRawItems] = useState<VaultItem[]>([]);
  const USER_ID = new URLSearchParams(window.location.search).get("id");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<GofileVideoListRes>(
          `${apiUrl}/gofile/${USER_ID}/shared`,
        );
        console.log("Fetched Gofile user items:", data);
        const videos = (data?.videos ?? []) as GofileVideoRes[]; // 型を確定
        const list: VaultItem[] = videos.map(adaptVideoToVaultItem);
        setRawItems(list);
      } catch (e) {
        console.error("Failed to fetch Gofile user items:", e);
        setRawItems([]);
      }
    })();
  }, [USER_ID]);

  const items = useMemo(() => {
    let all = [...rawItems].sort(
      (a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!),
    );
    return all.filter(
      (i) => i.visibility === "private" || i.visibility === "shared",
    );
  }, [rawItems]);

  return <GofileUserPresenter items={items} />;
}
