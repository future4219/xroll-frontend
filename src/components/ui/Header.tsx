import { SideBarMenuXroll } from "@/components/ui/SideBarMenuXroll";
import logo from "@/components/ui/xroll.png";
import { appUrl } from "@/config/url";
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

  useEffect(() => {
    console.log("isMainVideoList", isMainVideoList);
    console.log("isRealtimeVideoList", isRealtimeVideoList);
  }, [isMainVideoList, isRealtimeVideoList]);
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
          <Link to="/">
            <img
              src={logo}
              alt="Xroll Logo"
              className=" h-16 max-h-full object-contain"
            />
          </Link>
        </div>

        {/* 中央：リール / サムネイル切り替え */}
        {isMainVideoList && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 space-x-8  font-medium">
            <Link
              to={appUrl.mainVideoListWithView("reels")}
              className={`pb-1 transition ${
                view == "reels" ? "border-b-2 border-white" : "text-gray-300"
              }`}
            >
              リール
            </Link>
            <Link
              to={appUrl.mainVideoListWithView("thumbs")}
              className={`pb-1 transition ${
                view == "thumbs" ? "border-b-2 border-white" : "text-gray-300"
              }`}
            >
              サムネイル
            </Link>
          </div>
        )}
        {isRealtimeVideoList && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 space-x-8  font-medium">
            <Link
              to={appUrl.realtimeVideoListWithView("reels")}
              className={`pb-1 transition ${
                view == "reels" ? "border-b-2 border-white" : "text-gray-300"
              }`}
            >
              リール
            </Link>
            <Link
              to={appUrl.realtimeVideoListWithView("thumbs")}
              className={`pb-1 transition ${
                view == "thumbs" ? "border-b-2 border-white" : "text-gray-300"
              }`}
            >
              サムネイル
            </Link>
          </div>
        )}

        {/* 右側の空き領域 */}
        <div className="w-8" />
      </div>
    </header>
  );
}
