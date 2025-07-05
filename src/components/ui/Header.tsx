import { SidebarMenu } from "@/components/ui/SideBarMenu";
import logo from "@/components/ui/xroll.png";
import { appUrl } from "@/config/url";
import { Link, useLocation } from "react-router-dom";

type Props = {
  bgColor?: string;
  isMainVideoList?: boolean;
  showAsReels?: string;
};

export function Header({
  bgColor,
  isMainVideoList = false,
  showAsReels,
}: Props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let view = params.get("view"); // "reels" or "thumbs"
  if (!view) {
    view = "reels"; // デフォルト値
  }

  return (
    <header className={`fixed top-0 left-0 z-50 w-full text-white`}>
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between ">
        {/* 左：ロゴとメニュー */}
        <div className="flex items-center ">
          <SidebarMenu />
          <Link to="/">
            <img
              src={logo}
              alt="Xroll Logo"
              className=" h-16 max-h-full object-contain"
            />
          </Link>
        </div>

        {/* 中央：リール / サムネイル切り替え */}
        {isMainVideoList && <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 space-x-8  font-medium">
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
        </div>}

        {/* 右側の空き領域 */}
        <div className="w-8" />
      </div>
    </header>
  );
}
