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
import { clearAuthTokenCookie } from "@/lib/auth";

export function SideBarMenuXfile() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const USER_ID =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [me, setMe] = useState<User>(newUser());
  const apiUrl = import.meta.env.VITE_API_URL;

  const toggleMenu = () => setIsOpen((v) => !v);

  // ログイン済みなら /users/me を取得
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
  }, []); // USER_ID 変化で再取得したいなら依存に USER_ID を追加

  // メニュー外部クリックでクローズ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ログアウト
  const handleLogout = async () => {
    try {
      // await api.post(`${apiUrl}/auth/logout`); // サーバにあれば
    } catch (e) {
      console.warn("logout api failed (ignored):", e);
    } finally {
      clearAuthTokenCookie();
      localStorage.removeItem("userId");
      setMe(newUser());
      setIsOpen(false);
      window.location.href = appUrl.gofileLogin; // 遷移先はお好みで
    }
  };

  const isLoggedIn = me.UserType === "MemberUser";

  return (
    <>
      {/* ハンバーガー */}
      <button onClick={toggleMenu} className="p-3">
        <IoMdMenu className="h-6 w-6 text-white" />
      </button>

      {/* サイドバー */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={menuRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-[#0d0d0d] px-3 shadow-lg"
          >
            {/* ← 縦flexで最下部に押し下げる */}
            <div className="flex h-full flex-col bg-black">
              {/* ヘッダー */}
              <div className="mt-3 flex gap-3 p-2">
                <button onClick={toggleMenu}>
                  <IoMdMenu className="h-6 w-6 text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className="text-[15px] font-semibold tracking-tight"
                  >
                    Gofile Controller
                  </Link>
                  <span
                    aria-label="beta"
                    className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300"
                  >
                    beta
                  </span>
                </div>
              </div>

              {/* メニュー（スクロール可） */}
              <ul className="mt-2 flex-1 space-y-3 overflow-y-auto pr-1">
                <li>
                  <a
                    href={`${appUrl.gofileUser}?id=${localStorage.getItem(
                      "userId",
                    )}`}
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <AiOutlineUser className="text-white" size={25} />
                    <div className="text-white">マイページ</div>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileVault}
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoMdHome className="text-white" size={25} />
                    <div className="text-white">あなたのファイル</div>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileLikeVideo}
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosHeart className="text-white" size={25} />
                    <span className="text-white">いいねした動画</span>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileSearch}
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosSearch className="text-white" size={25} />
                    <span className="text-white">検索</span>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.mainVideoList}
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosArrowBack className="text-white" size={25} />
                    <span className="text-white">Xrollに戻る</span>
                  </a>
                </li>
              </ul>

              {/* 最下部：ログイン状態で出し分け */}
              <div className="mt-auto w-full space-y-3 border-t border-white/10 p-3">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg border border-white/20 bg-black/40 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    ログアウト
                  </button>
                ) : (
                  <>
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

                {/* ユーザー情報 */}
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
                      {isLoggedIn ? "ログイン中" : "未ログイン（ゲスト）"}
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
