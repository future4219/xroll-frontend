import logo from "@/components/ui/xroll.png";
import { useEffect, useRef, useState } from "react";
import {
  IoIosBook,
  IoIosHeart,
  IoMdHome,
  IoMdMenu,
  IoMdSave,
} from "react-icons/io";
import { MdLiveTv } from "react-icons/md";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/utils/LanguageContext";

export function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, toggleLang } = useLanguage();

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
            className="fixed left-0 top-0 z-50 h-full w-64 bg-black px-3 shadow-lg"
          >
            <div className="flex h-full flex-col justify-between">
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
                        {t('liveChat')}
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                          {t('onSale')}
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
                      <div className="text-white">{t('recommended')}</div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/like-video-list"
                      className="flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoIosHeart className="text-white" size={30} />
                      <span className="text-white">{t('likedVideos')}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/twitter-video-save"
                      className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoMdSave className="text-white" size={30} />
                      <span className="text-white">{t('videoSave')}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/policy"
                      className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoIosBook className="text-white" size={30} />
                      <span className="text-white">{t('policy')}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dmca"
                      className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoIosBook className="text-white" size={30} />
                      <span className="text-white">{t('dmca')}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/usc2257"
                      className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                    >
                      <IoIosBook className="text-white" size={30} />
                      <span className="text-white">{t('usc2257')}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mb-4 mt-4 flex justify-center">
                <button
                  onClick={toggleLang}
                  className="rounded border border-white px-3 py-1 text-sm text-white"
                >
                  {t('langSwitch')}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
