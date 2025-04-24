import logo from "@/components/ui/xroll.png";
import { useEffect, useRef, useState } from "react";
import { IoIosBook, IoIosHeart, IoMdHome, IoMdMenu } from "react-icons/io";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

export function SidebarMenu() {
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
                    href="/policy"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={30} />
                    <span className="text-white">免責事項・ポリシー</span>
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
