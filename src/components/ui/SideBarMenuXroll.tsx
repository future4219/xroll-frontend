import logo from "@/components/ui/xroll.png";
import { useEffect, useRef, useState } from "react";
import {
  IoIosHeart,
  IoMdHome,
  IoMdMenu,
  IoMdSave,
  IoMdTime,
} from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { appUrl } from "@/config/url";

export function SideBarMenuXroll() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* ハンバーガーアイコン */}
      <button onClick={toggleMenu} className="p-3">
        <IoMdMenu className="h-6 w-6 text-white" />
      </button>

      {/* サイドメニュー＆オーバーレイ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景の半透明オーバーレイ（クリックで閉じる） */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setIsOpen(false)}
            />

            {/* サイドバー本体 */}
            <motion.aside
              key="sidebar"
              ref={menuRef}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "tween" }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-black px-3 shadow-lg"
            >
              {/* 上側：メニュー部分 */}
              <div className="flex-1 overflow-y-auto">
                <div className="mt-2 flex gap-3">
                  <button onClick={toggleMenu}>
                    <IoMdMenu className="h-6 w-6 text-white" />
                  </button>
                  <Link to="/">
                    <img
                      src={logo}
                      alt="Xroll Logo"
                      className="h-16 max-h-full object-contain"
                    />
                  </Link>
                </div>

                <ul className="mt-2 space-y-3">
                  <li>
                    <a
                      href={appUrl.gofileSearch}
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                    >
                      <FaFileAlt className="text-yellow-400" size={25} />
                      <span className="ml-3 flex items-center gap-4 text-yellow-400 text-white">
                        みんなの動画
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                          NEW
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoMdHome className="text-white" size={30} />
                      <div className="text-white">おすすめ</div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/like-video-list"
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoIosHeart className="text-white" size={30} />
                      <span className="text-white">いいねした動画</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/realtime-video-list"
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoMdTime className="text-white" size={30} />
                      <span className="text-white">リアルタイム</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/twitter-video-save"
                      className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoMdSave className="text-white" size={30} />
                      <span className="text-white">動画保存</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* 下側：フッター部分 */}
              <div className="mb-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <a href="/policy" className="hover:text-white">
                  Policy
                </a>
                <a href="/dmca" className="hover:text-white">
                  DMCA
                </a>
                <a href="/usc2257" className="hover:text-white">
                  2257
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
