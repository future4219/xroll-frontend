import logo from "@/components/ui/xroll.png";
import { useEffect, useRef, useState } from "react";
import {
  IoIosBook,
  IoIosHeart,
  IoMdHome,
  IoMdMenu,
  IoMdSave,
} from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

export function SideBarMenuXroll() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
            className="fixed left-0 top-0 z-50 h-full w-64 bg-black px-3 shadow-lg "
          >
            <div>
              <div className="flex gap-3">
                <button onClick={toggleMenu}>
                  <IoMdMenu className="h-6 w-6 text-white" />
                </button>
                <Link to="/">
                  <img
                    src={logo}
                    alt="Xroll Logo"
                    className=" h-16 max-h-full object-contain"
                  />
                </Link>
              </div>

              <ul className="space-y-3">
                {/* <li>
                  <a
                    href="https://go.rmhfrtnd.com?userId=3a43ec976d7f513c2bd3e3019041edf8c12c016056dc22074d25c7907abb93fc"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <MdLiveTv className="text-white" size={30} />
                    <span className="text-white">ライブチャット</span>
                  </a>
                </li> */}
                <li>
                  <a
                    href="https://go.rmhfrtnd.com?userId=3a43ec976d7f513c2bd3e3019041edf8c12c016056dc22074d25c7907abb93fc"
                    className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
                  >
                    <MdLiveTv className="text-white" size={30} />
                    <span className="flex items-center gap-1 whitespace-nowrap text-sm text-white">
                      ライブチャット
                      <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                        セール中
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 space-x-2 rounded p-2  hover:bg-gray-700"
                  >
                    <IoMdHome className="text-white" size={30} />
                    <div className="text-white">おすすめ</div>
                  </a>
                </li>
                <li>
                  <a
                    href="/like-video-list"
                    className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosHeart className="text-white" size={30} />
                    <span className="text-white">いいねした動画</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/twitter-video-save"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoMdSave className="text-white" size={30} />
                    <span className="text-white">動画保存</span>
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/gofile"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <FaFileAlt className="text-white" size={25} />
                    <span className="text-white">Gofile</span>
                  </a>
                </li> */}
                <li>
                  <a
                    href="/policy"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={30} />
                    <span className="text-white">規約・免責事項・ポリシー</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/dmca"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={30} />
                    <span className="text-white">DMCA</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/usc2257"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={30} />
                    <span className="text-white">18 USC 2257 Statement</span>
                  </a>
                </li>
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
