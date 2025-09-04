import logo from "@/components/ui/xroll.png";
import { useEffect, useRef, useState } from "react";
import {
  IoIosBook,
  IoIosHeart,
  IoMdHome,
  IoMdMenu,
  IoMdSave,
  IoIosArrowBack,
  IoIosSearch,
} from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

import { FaFileAlt } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { CiUser } from "react-icons/ci";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { appUrl } from "@/config/url";

export function SideBarMenuXfile() {
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
            <div className="bg-black">
              <div className="mt-3 flex gap-3 p-2">
                <button onClick={toggleMenu}>
                  <IoMdMenu className="h-6 w-6 text-white" />
                </button>
                <Link to="/">
                  <div className="">Xfile</div>
                </Link>
              </div>

              <ul className="mt-2 space-y-3">
                <li>
                  <a
                    href={`${appUrl.gofileUser}?id=${localStorage.getItem(
                      "userId",
                    )}`}
                    className="flex items-center gap-2 space-x-2 rounded p-2  hover:bg-gray-700"
                  >
                    <AiOutlineUser className="text-white" size={25} />
                    <div className="text-white">マイページ</div>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.gofileVault}
                    className="flex items-center gap-2 space-x-2 rounded p-2  hover:bg-gray-700"
                  >
                    <IoMdHome className="text-white" size={25} />
                    <div className="text-white">あなたのファイル</div>
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
                    href={appUrl.gofileUpload}
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoCloudUploadOutline className="text-white" size={25} />
                    <span className="text-white">投稿・保管</span>
                  </a>
                </li>
                <li>
                  <a
                    href={appUrl.mainVideoList}
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosArrowBack className="text-white" size={25} />
                    <span className="text-white">Xrollに戻る</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/policy"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={25} />
                    <span className="text-white">規約・免責事項・ポリシー</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/dmca"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={25} />
                    <span className="text-white">DMCA</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/usc2257"
                    className=" flex items-center gap-2 space-x-2 rounded p-2 hover:bg-gray-700"
                  >
                    <IoIosBook className="text-white" size={25} />
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
