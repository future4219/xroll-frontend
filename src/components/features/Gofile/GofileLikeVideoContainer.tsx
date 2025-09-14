import { GofileLikeVideoPresenter } from "@/components/features/Gofile/GofileLikeVideoPresenter";
import api from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { adaptVideoToGofileVideo } from "@/components/features/Gofile/GofileVault/GofileVaultContainer";
import {
  GofileVideoListRes,
  GofileVideoRes,
  GofileVideo,
} from "@/components/features/Gofile/GofileVault/types";

export function GofileLikeVideoContainer() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const BACKEND_LIST_BASE = `${apiUrl}/gofile`;
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [rawItems, setRawItems] = useState<GofileVideo[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<GofileVideoListRes>(
          `${BACKEND_LIST_BASE}/liked-videos`,
        );
        const videos = (data?.videos ?? []) as GofileVideoRes[];
        const list: GofileVideo[] = videos.map(adaptVideoToGofileVideo);
        setRawItems(list);
      } catch (e) {
        console.error("GET /api/gofile/:userId failed:", e);
        setRawItems([]);
      }
    })();
  }, [USER_ID]);

  const items = useMemo(() => {
    let all = [...rawItems].sort(
      (a, b) => +new Date(b.CreatedAt!) - +new Date(a.CreatedAt!),
    );

    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) =>
      [i.Name, i.GofileTags?.join(" ") || ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rawItems, query]);
  return (
    <GofileLikeVideoPresenter
      items={items}
      query={query}
      onQueryChange={setQuery}
    />
  );
}
