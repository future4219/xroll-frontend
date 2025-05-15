import { SidebarMenu } from "@/components/ui/SideBarMenu";
import logo from "@/components/ui/xroll.png";
import { Link } from "react-router-dom";

type Props = {
  bgColor?: string;
};
export function Header({ bgColor }: Props) {
  return (
    <header className={`top-0 left-0 z-50 w-full text-white ${bgColor} fixed`}>
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-between">
        <div className="flex items-center">
          <SidebarMenu />

          <Link to="/">
            <img
              src={logo}
              alt="Xroll Logo"
              className=" h-16 max-h-full object-contain"
            />
          </Link>
        </div>

        {/* ナビゲーション */}
      </div>
    </header>
  );
}
