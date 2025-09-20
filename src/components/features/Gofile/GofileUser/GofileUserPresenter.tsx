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
import { GofileVideo, User } from "@/lib/types";

const UPLOAD_URL = "https://upload.gofile.io/uploadfile";

type GofileUserPresenterProps = {
  items: GofileVideo[];
  user: User;
  onSaveProfile?: (payload: { name: string; bio: string }) => Promise<void>;
  isMe?: boolean;
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

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 z-50 w-full text-white">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          <div className="flex items-center gap-2">
            <SideBarMenuXfile />
            <div className="text-sm font-semibold tracking-tight sm:text-[15px]">
              User Profile
            </div>
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2">
            {/* reserved */}
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-6xl px-3 pt-20 pb-16 sm:px-4 sm:pt-24">
        {/* ===== Channel Header ===== */}
        <section className="grid grid-cols-1 items-start gap-4 sm:gap-6 md:grid-cols-[auto,1fr]">
          {/* Avatar */}
          <div className="flex justify-center md:block md:justify-start">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <img
                alt="avatar"
                className="h-full w-full object-cover"
                src={ProfileIcon}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="min-w-0">
            {/* Name line */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {!isEditing ? (
                <>
                  <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.Name}
                  </h1>
                  {(user.UserType === "SystemAdmin" ||
                    user.UserType === "OfficialUser") && (
                    <>
                      <span className="text-xl leading-none text-white/60 sm:text-2xl">
                        ・
                      </span>
                      <BadgeCheck
                        className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5"
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
                    className="border-white/15 w-full rounded-lg border bg-black/40 px-3 py-2 text-base outline-none ring-0 placeholder:text-white/40 focus:border-white/30 sm:text-lg"
                  />
                </div>
              )}
            </div>

            {/* Handle + stats */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70 sm:text-sm">
              <span className="truncate">@{user.Id}</span>
              <span className="hidden sm:inline">・</span>
              <span>フォロワー {user.FollowerCount ?? 0}人</span>
              <span className="hidden sm:inline">・</span>
              <span>{items.length} 本の動画</span>
            </div>

            {/* bio */}
            {!isEditing ? (
              <p className="line-clamp-2 sm:line-clamp-3 mt-3 text-sm text-white/80">
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
                <div className="mt-1 text-right text-xs text-white/50">
                  {bio?.length ?? 0}/500
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">
              {!isEditing ? (
                <>
                  {!isMe && (
                    <>
                      <button className="xs:w-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 sm:w-auto">
                        フォローする <span className="ml-0.5">+</span>
                      </button>
                      <button className="xs:w-auto border-white/15 inline-flex w-full items-center justify-center gap-1 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10 sm:w-auto">
                        <Bell className="mr-1 h-4 w-4" />
                        通知 <ChevronDown className="ml-0.5 h-4 w-4" />
                      </button>
                    </>
                  )}
                  {isMe && (
                    <button
                      onClick={handleStartEdit}
                      className="xs:w-auto border-white/15 inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10 sm:w-auto"
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
                    className="xs:w-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60 sm:w-auto"
                  >
                    {saving === "saving" ? "保存中…" : "保存"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving === "saving"}
                    className="xs:w-auto border-white/15 inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-60 sm:w-auto"
                  >
                    キャンセル
                  </button>
                  {errorMsg && (
                    <span className="ml-0 text-sm text-red-400 sm:ml-2">
                      {errorMsg}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Videos */}
        <section className="mx-auto w-full max-w-6xl pt-10 sm:pt-12">
          <div className="mb-4 flex items-center justify-between text-base font-bold sm:mb-6 sm:text-xl">
            公開されている動画
          </div>
          {items.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 sm:py-10">
              <p>このユーザーの動画はまだありません。</p>
            </div>
          ) : (
            <VaultGrid items={items} />
          )}
        </section>
      </main>
    </div>
  );
}
