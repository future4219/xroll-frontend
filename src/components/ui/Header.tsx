import { SideBarMenuXroll } from "@/components/ui/SideBarMenuXroll";
import logo from "@/components/ui/xroll.png";
import { appUrl } from "@/config/url";
import { getPageName } from "@/utils/utils";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  bgColor?: string;
  isMainVideoList?: boolean;
  isRealtimeVideoList?: boolean;
  showAsReels?: string;
};

export function Header({
  bgColor,
  isMainVideoList = false,
  isRealtimeVideoList = false,
  showAsReels,
}: Props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let view = params.get("view"); // "reels" or "thumbs"
  if (!view) {
    view = "reels"; // デフォルト値
  }
  const isVideoList: boolean =
    location.pathname === appUrl.likeVideoList ||
    location.pathname === appUrl.mainVideoList ||
    location.pathname === appUrl.realtimeVideoList;

  const pageName = getPageName(location.pathname);

  const viewUrl = isMainVideoList
    ? appUrl.mainVideoListWithView
    : isRealtimeVideoList
    ? appUrl.realtimeVideoListWithView
    : null;
  
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full text-white ${
        !isVideoList && "bg-black"
      } `}
    >
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between ">
        {/* 左：ロゴとメニュー */}
        <div className="flex items-center ">
          <SideBarMenuXroll />
          <div className="ml-2 ">{pageName}</div>
        </div>

        {/* 中央：リール / サムネイル切り替え */}
        {viewUrl && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 space-x-8 font-medium">
            {(["reels", "thumbs"] as const).map((v) => (
              <Link
                key={v}
                to={viewUrl(v)}
                className={`pb-1 transition ${
                  view === v ? "border-b-2 border-white" : "text-gray-300"
                }`}
              >
                {v === "reels" ? "リール" : "サムネイル"}
              </Link>
            ))}
          </div>
        )}

        {/* 右側の空き領域 */}
        <div className="w-8" />
      </div>
    </header>
  );
}
