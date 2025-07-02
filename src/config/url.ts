export const appUrl = {
  employeeList: "/employees",
  mainVideoList: "/",
  likeVideoList: "/like-video-list",
  policy: "/policy",
  twitterVideoSave: "/twitter-video-save",
  dmca: "/dmca",
  usc2257: "/usc2257",

  // 動的にクエリ付きURLを返す関数
  mainVideoListWithView: (view: "reels" | "thumbs") => `/?view=${view}`,
} as const;
