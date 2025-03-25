import { appUrl } from "@/config/url";
import { NavLink } from "react-router-dom";

export function TabNavigation() {
  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-center gap-10 p-4 font-bold text-white">
      <NavLink
        to={appUrl.mainVideoList}
        className={({ isActive }) =>
          `border-b-2 focus:outline-none ${
            isActive ? "border-white" : "border-transparent"
          }`
        }
      >
        おすすめ
      </NavLink>
      <NavLink
        to={appUrl.likeVideoList}
        className={({ isActive }) =>
          `border-b-2 focus:outline-none ${
            isActive ? "border-white" : "border-transparent"
          }`
        }
      >
        いいねした動画
      </NavLink>
    </div>
  );
}
