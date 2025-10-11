import { appUrl } from "@/config/url";

// 各ページの名前を返す関数
export function getPageName(pathname: string): string {
  switch (pathname) {
    case appUrl.mainVideoList:
      return "おすすめ";
    case appUrl.likeVideoList:
      return "いいねした動画";
    case appUrl.policy:
      return "プライバシーポリシー";
    case appUrl.twitterVideoSave:
      return "動画保存";
    case appUrl.dmca:
      return "DMCA";
    case appUrl.usc2257:
      return "2257";
    case appUrl.realtimeVideoList:
      return "リアルタイム";
    default:
      return "";
  }
}
