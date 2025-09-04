import React, { useCallback, useState } from "react";
import axios from "axios";
import {
  Upload,
  Bell,
  ChevronDown,
  MoreVertical,
  BadgeCheck,
  Link as LinkIcon,
} from "lucide-react";
import { SideBarMenuXfile } from "@/components/ui/SideBarMenuXfile";
import ProfileIcon from "@/components/ui/ProfileIcon.jpg";
import { EmptyState } from "./GofileVault/EmptyState";
import { VaultGrid } from "./GofileVault/VaultGrid";
import { VaultList } from "./GofileVault/VaultList";
import { VaultTabs } from "./GofileVault/VaultTabs";
import { VaultItem } from "./GofileVault/types";

const UPLOAD_URL = "https://upload.gofile.io/uploadfile";

type Status = "idle" | "uploading" | "success" | "error";

type GofileUserPresenterProps = {
  items: VaultItem[]; // ここは実際のアイテム型に置き換えてください
};

export function GofileUserPresenter({ items }: GofileUserPresenterProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const upload = useCallback(async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setMessage(null);

    const fd = new FormData();
    fd.append("file", selectedFile);

    try {
      await axios.post(UPLOAD_URL, fd, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
        timeout: 0,
      });
      setProgress(100);
      setStatus("success");
      setMessage("アップロード完了");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessage("アップロードに失敗しました");
    }
  }, [selectedFile]);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus("idle");
    setProgress(0);
    setMessage(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    handleSelect(files[0]);
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleSelect(files[0]);
    e.target.value = "";
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <SideBarMenuXfile />
          <div className="text-sm font-medium text-white/80">
            Gofile Controller
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="border-white/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-white/5"
            >
              <Upload className="h-4 w-4" />
              アップロード
            </button>
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16">
        {/* ===== Channel Header (画像のUI) ===== */}
        <section className="flex items-start gap-6">
          {/* Avatar */}
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <img
              alt="avatar"
              className="h-full w-full object-cover"
              src={ProfileIcon} // ここは実際の画像パスに置き換えてください
            />
          </div>

          {/* Right side */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Name line */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-3xl font-bold tracking-tight">
                ゲスト
              </h1>
              <span className="text-2xl leading-none text-white/60">・</span>
              <BadgeCheck
                className="h-5 w-5 text-blue-400"
                aria-label="verified"
              />
            </div>

            {/* Handle + stats */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-white/70">
              <span className="truncate">@pockysweets</span>
              <span>・</span>
              <span>チャンネル登録者数 372万人</span>
              <span>・</span>
              <span>4293 本の動画</span>
            </div>

            {/* Description */}
            <p className="line-clamp-2 mt-3 text-sm text-white/80">
              ゲーム実況を投稿しています。…{" "}
              <button className="rounded px-1 text-white hover:bg-white/10">
                さらに表示
              </button>
            </p>

            {/* Links row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <a
                href="https://twitter.com/Pocky_sweets"
                target="_blank"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4" />
                twitter.com/Pocky_sweets
              </a>
              <span className="text-white/70">他 4 件のリンク</span>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                チャンネル登録 <span className="ml-0.5">+</span>
              </button>
              <button className="border-white/15 inline-flex items-center gap-1 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                <Bell className="mr-1 h-4 w-4" />
                通知 <ChevronDown className="ml-0.5 h-4 w-4" />
              </button>
              <button className="border-white/15 inline-flex rounded-full border bg-white/5 p-2 hover:bg-white/10">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
        <div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-16">
          <div className="mb-6 flex items-center justify-between text-xl font-bold">
            公開されている動画
          </div>

          <VaultGrid
            items={items}
            onShare={() => {}}
            onToggleVisibility={() => {}}
          />
        </div>
      </main>
    </div>
  );
}
