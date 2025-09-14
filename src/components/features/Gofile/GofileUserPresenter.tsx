import React from "react";

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
import { VaultGrid } from "@/components/features/Gofile/GofileVault/VaultGrid";
import {
  GofileVideo,
  User,
} from "@/components/features/Gofile/GofileVault/types";

const UPLOAD_URL = "https://upload.gofile.io/uploadfile";

type GofileUserPresenterProps = {
  items: GofileVideo[];
  user: User;
  onSaveProfile?: (payload: { name: string; bio: string }) => Promise<void>; // ← 追加
  isMe?: boolean; // ← 追加（自分のページのときだけ編集ボタンを出す用）
};

export function GofileUserPresenter({
  items,
  user,
  onSaveProfile,
  isMe = true,
}: GofileUserPresenterProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // 編集用のローカル状態
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user?.Name ?? "");
  const [bio, setBio] = React.useState(user?.Bio ?? "");
  const [saving, setSaving] = React.useState<
    "idle" | "saving" | "error" | "done"
  >("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // user が更新されたらフォームも同期
  React.useEffect(() => {
    setName(user?.Name ?? "");
    setBio(user?.Bio ?? "");
  }, [user?.Name, user?.Bio]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.Name ?? "");
    setBio(user?.Bio ?? "");
    setSaving("idle");
    setErrorMsg(null);
  };

  const handleSave = async () => {
    if (!onSaveProfile) return;
    if (!name.trim()) {
      setErrorMsg("名前を入力してください。");
      return;
    }
    if (name.length > 100) {
      setErrorMsg("名前は100文字以内にしてください。");
      return;
    }
    if (bio.length > 500) {
      setErrorMsg("紹介文は500文字以内にしてください。");
      return;
    }
    setSaving("saving");
    setErrorMsg(null);
    try {
      await onSaveProfile({ name: name.trim(), bio: bio ?? "" });
      setSaving("done");
      setIsEditing(false);
    } catch (e: any) {
      setSaving("error");
      setErrorMsg(
        e?.message || "保存に失敗しました。時間をおいて再度お試しください。",
      );
    }
  };
  console.log(user.UserType);
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-[15px] font-semibold tracking-tight">
              User Profile
            </div>
          </div>

          {/* 検索 */}
          <div className="ml-2 flex flex-1 items-center gap-2">
            {/* アップロード（モバイル=アイコン、デスクトップ=ラベル付き） */}
          </div>
        </div>
        {/* UploadBar（進捗） */}
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16">
        {/* ===== Channel Header ===== */}
        <section className="flex items-start gap-6">
          {/* Avatar */}
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <img
              alt="avatar"
              className="h-full w-full object-cover"
              src={ProfileIcon}
            />
          </div>

          {/* Right side */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Name line */}
            <div className="flex flex-wrap items-center gap-2">
              {!isEditing ? (
                <>
                  <h1 className="truncate text-3xl font-bold tracking-tight">
                    {user.Name}
                  </h1>

                  {(user.UserType == "SystemAdmin" ||
                    user.UserType == "OfficialUser") && (
                    <>
                      <span className="text-2xl leading-none text-white/60">
                        ・
                      </span>
                      <BadgeCheck
                        className="h-5 w-5 text-blue-400"
                        aria-label="verified"
                      />
                    </>
                  )}
                </>
              ) : (
                <div className="flex w-full max-w-xl items-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="表示名"
                    className="border-white/15 w-full rounded-lg border bg-black/40 px-3 py-2 text-lg outline-none ring-0 placeholder:text-white/40 focus:border-white/30"
                  />
                </div>
              )}
            </div>

            {/* Handle + stats */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-white/70">
              <span className="truncate">@{user.Id}</span>
              <span>・</span>
              <span>フォロワー {user.FollowerCount ?? 0}人</span>
              <span>・</span>
              <span>{items.length} 本の動画</span>
            </div>

            {/* bio */}
            {!isEditing ? (
              <p className="line-clamp-2 mt-3 text-sm text-white/80">
                {user.Bio?.trim() ? user.Bio : "説明はありません"}
              </p>
            ) : (
              <div className="mt-3 w-full max-w-2xl">
                <textarea
                  value={bio ?? ""}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="紹介文（自己紹介・投稿方針など）"
                  rows={4}
                  className="border-white/15 w-full rounded-lg border bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
                />
                <div className="mt-1 text-xs text-white/50">
                  {bio?.length ?? 0}/500
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {!isEditing ? (
                <>
                  {!isMe && (
                    <>
                      <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                        フォローする <span className="ml-0.5">+</span>
                      </button>
                      <button className="border-white/15 inline-flex items-center gap-1 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                        <Bell className="mr-1 h-4 w-4" />
                        通知 <ChevronDown className="ml-0.5 h-4 w-4" />
                      </button>
                    </>
                  )}

                  {isMe && (
                    <button
                      onClick={handleStartEdit}
                      className="border-white/15 inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      プロフィールを編集
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving === "saving"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
                  >
                    {saving === "saving" ? "保存中…" : "保存"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving === "saving"}
                    className="border-white/15 inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
                  >
                    キャンセル
                  </button>
                  {errorMsg && (
                    <span className="ml-2 text-sm text-red-400">
                      {errorMsg}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-16">
          <div className="mb-6 flex items-center justify-between text-xl font-bold">
            公開されている動画
          </div>
          {items.length === 0 ? (
            <div className="py-10 text-center text-zinc-500">
              <p>このユーザーの動画はまだありません。</p>
            </div>
          ) : (
            <VaultGrid items={items} />
          )}
        </div>
      </main>
    </div>
  );
}
