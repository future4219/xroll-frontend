import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "ja" | "en";

type LanguageContextType = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
};

const translations: Record<Lang, Record<string, string>> = {
  ja: {
    liveChat: "ライブチャット",
    onSale: "セール中",
    recommended: "おすすめ",
    likedVideos: "いいねした動画",
    videoSave: "動画保存",
    policy: "規約・免責事項・ポリシー",
    dmca: "DMCA",
    usc2257: "18 USC 2257 Statement",
    noLikedVideos: "いいねした動画はありません",
    twitterSaveTool: "Twitter動画保存ツール",
    tweetUrlPlaceholder: "ここにツイートのURLを入力",
    fetch: "取得",
    fetching: "動画を取得中です。しばらくお待ちください...",
    fetchedVideo: "取得した動画",
    note: "※ 当サイトは動画ファイルを直接保存しているわけではなく、Twitterに投稿された動画へのリンクを提供しています。",
    privacyPolicy: "プライバシーポリシー",
    contact: "お問い合わせ：xroll.net@gmail.com",
    langSwitch: "English",
  },
  en: {
    liveChat: "Live Chat",
    onSale: "On Sale",
    recommended: "Recommended",
    likedVideos: "Liked Videos",
    videoSave: "Video Save",
    policy: "Terms & Policy",
    dmca: "DMCA",
    usc2257: "18 USC 2257 Statement",
    noLikedVideos: "No liked videos",
    twitterSaveTool: "Twitter Video Save Tool",
    tweetUrlPlaceholder: "Paste tweet URL here",
    fetch: "Fetch",
    fetching: "Fetching video. Please wait...",
    fetchedVideo: "Fetched Video",
    note: "This site does not store videos directly; it only provides links to videos posted on Twitter.",
    privacyPolicy: "Privacy Policy",
    contact: "Contact: xroll.net@gmail.com",
    langSwitch: "日本語",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ja",
  toggleLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ja");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "ja" || stored === "en") {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "ja" ? "en" : "ja"));
  };

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
