import { useEffect, useRef, useState } from "react";
import {
  IoIosHeart,
  IoMdHome,
  IoMdMenu,
  IoIosArrowBack,
  IoIosSearch,
} from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { appUrl } from "@/config/url";
import { adaptUserResToUser, newUser, User, UserRes } from "@/lib/types";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";
import api from "@/lib/api";
import { clearAuthTokenCookie } from "@/lib/auth"; // ← 追加

export function SideBarMenuXfile() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const [me, setMe] = useState<User>(newUser());
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!USER_ID) return;
    (async () => {
      try {
        const { data } = await api.get<UserRes>(`${apiUrl}/users/me`);
        setMe(adaptUserResToUser(data));
      } catch (e) {
        console.error("Failed to fetch user info:", e);
        setMe(newUser());
      }
    })();
  }, []);

  // メニュー外部クリックを監視
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ★ ログアウト処理
  const handleLogout = async () => {
    try {
      // サーバーに専用エンドポイントがあるなら呼んでもOK（任意）
      // await api.post(`${apiUrl}/auth/logout`);
    } catch (e) {
      console.warn("logout api failed (ignored):", e);
    } finally {
      clearAuthTokenCookie(); // アクセストークンCookie削除
      localStorage.removeItem("userId"); // ローカルのログイン状態もクリア
      setMe(newUser()); // クライアント状態初期化
      setIsOpen(false); // メニュー閉じる
      window.location.href = appUrl.gofileLogin; // 遷移先はお好みで
    }
  };

  const isLoggedIn = me.UserType === "MemberUser";

  return (
    <>
      {/* ハンバーガーアイコン */}
      <button onClick={toggleMenu} className="p-3">
        <IoMdMenu className="h-6 w-6 text-white" />
      </button>

      {/* サイドメニュー */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={menuRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 z-50 h-full w-64 border-r border-white/10 bg-[#0d0d0d] px-3 shadow-lg"
          >
            <div className="bg-black">
              <div className="mt-3 flex gap-3 p-2">
                <button onClick={toggleMenu}>
                  <IoMdMenu className="h-6 w-6 text-white" />
                </button>
                <div className="text-[15px] font-semibold tracking-tight">
                  <Link to="/">
                    <div className="">Gofile Controller</div>
                  </Link>
                </div>
              </div>

              <ul className="mt-2 space-y-3">
                <li>
                  <a
                    href={`${appUrl.gofileUser}?id=${localStorage.getItem(
                      "userId",
                    )}`}
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <AiOutlineUser className="text-white" size={25} />
                    <div className="text-white">マイページ</div>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileVault}
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoMdHome className="text-white" size={25} />
                    <div className="text-white">あなたのファイル</div>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileLikeVideo}
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosHeart className="text-white" size={25} />
                    <span className="text-white">いいねした動画</span>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileSearch}
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosSearch className="text-white" size={25} />
                    <span className="text-white">検索</span>
                  </a>
                </li>

                <li>
                  <a
                    href={appUrl.mainVideoList}
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosArrowBack className="text-white" size={25} />
                    <span className="text-white">Xrollに戻る</span>
                  </a>
                </li>
              </ul>

              {/* 下部：ログイン状態で出し分け */}
              <div className="absolute bottom-0 left-0 w-full space-y-3 border-t border-white/10 p-3">
                {isLoggedIn ? (
                  <>
                    {/* ログアウト */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-lg border border-white/20 bg-black/40 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    {/* 未ログイン: ログイン / 新規登録 */}
                    <a
                      href={appUrl.gofileLogin}
                      className="block w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-center text-sm font-semibold text-black shadow-[0_5px_15px_-5px_rgba(245,158,11,0.6)] transition hover:from-amber-400 hover:to-orange-400"
                    >
                      ログイン
                    </a>
                    <a
                      href={appUrl.gofileRegister}
                      className="block w-full rounded-lg border border-white/20 bg-black/40 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      新規会員登録
                    </a>
                  </>
                )}

                {/* ユーザー情報（常時表示でもOK／隠したければ isLoggedIn で囲って） */}
                <a
                  href={`${appUrl.gofileUser}?id=${me.Id}`}
                  className="flex items-center gap-2"
                >
                  <img
                    src={me.IconUrl ? me.IconUrl : ProfileIcon}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ProfileIcon;
                    }}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs text-gray-400">
                      {isLoggedIn ? "ログイン中" : "未ログイン"}
                    </span>
                    <span className="truncate text-sm font-medium text-white">
                      {me.Name ? me.Name : "Unknown User"}
                    </span>
                    <span className="truncate text-xs text-gray-400">
                      @{me.Id ? me.Id : "unknown"}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
