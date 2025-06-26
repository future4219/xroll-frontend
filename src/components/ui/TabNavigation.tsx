import { SidebarMenu } from "@/components/ui/SideBarMenu";
import { appUrl } from "@/config/url";
import { NavLink } from "react-router-dom";
import logo from "@/components/ui/xroll.png";
import { useLanguage } from "@/utils/LanguageContext";

export function TabNavigation() {
  const { t } = useLanguage();
  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-center gap-10 p-4 font-bold text-white">
      <SidebarMenu />
      <img src={logo} alt="Xroll Logo" className="text-left" />
        <NavLink
          to={appUrl.mainVideoList}
        className={({ isActive }) =>
          `border-b-2 focus:outline-none ${
            isActive ? "border-white" : "border-transparent"
          }`
        }
        >
          {t('recommended')}
        </NavLink>
        <NavLink
          to={appUrl.likeVideoList}
        className={({ isActive }) =>
          `border-b-2 focus:outline-none ${
            isActive ? "border-white" : "border-transparent"
          }`
        }
        >
          {t('likedVideos')}
        </NavLink>
    </div>
  );
}
