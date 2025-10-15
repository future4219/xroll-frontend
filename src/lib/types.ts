export type Visibility = "private" | "shared" | "processing" | "failed";

// ==== Backend responses ====
export interface GofileTagRes {
  id: string;
  name: string;
  // バックエンドの定義に応じて増えうるので任意
  [k: string]: any;
}

export interface GofileVideoCommentRes {
  id: string;
  gofile_video_id: string;
  user_id: string;
  user: UserRes;
  comment: string;
  like_count: number;
  created_at: string; // "2006-01-02 15:04:05"
  updated_at: string;
}

export interface UserRes {
  id: string;
  name?: string;
  icon_url?: string;
  user_type?: string;
  bio?: string;
  [k: string]: any;
}

export interface GofileCreateRes {
  id: string; // 動画のID
  name: string; // 動画の名前
  gofile_id: string; // GofileのID
  gofile_direct_url: string | null; // GofileのダイレクトURL
  video_url: string | null; // 動画のURL
  thumbnail_url: string | null; // サムネイルのURL
  user_id: string | null; // ユーザーID
  gofile_tags: GofileTagRes[]; // タグの情報
}

export interface GofileVideoRes {
  id: string;
  name: string;
  gofile_id: string;
  gofile_direct_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  play_count: number; // 再生回数
  like_count: number;
  is_shared: boolean; // 共有されているかどうか
  gofile_tags: GofileTagRes[];
  gofile_video_comments: GofileVideoCommentRes[];
  user_id: string | null;
  user: UserRes;
  has_like: boolean; // 自分がいいねしているかどうか
  created_at: string; // "2006-01-02 15:04:05"
  updated_at: string; // "2006-01-02 15:04:05"
}

export interface GofileVideoListRes {
  videos: GofileVideoRes[];
  count: number;
}

export type GofileVideo = {
  Id: string;
  Name: string;
  GofileId: string;
  GofileDirectUrl: string | null;
  VideoUrl: string | null;
  ThumbnailUrl: string | null;
  Description: string | null;
  PlayCount: number; // 再生回数
  LikeCount: number;
  IsShared: boolean; // 共有されているかどうか
  GofileTags: GofileTag[];
  GofileVideoComments: GofileVideoComment[];
  UserId: string | null;
  User: User;
  HasLike: boolean; // 自分がいいねしているかどうか
  CreatedAt: string; // "2006-01-02 15:04:05"
  UpdatedAt: string; // "2006-01-02 15:04:05"
};

export type GofileVideoView = GofileVideo & {
  __tempUploading?: boolean; // UI専用: 一時アイテム
  __uploadTaskId?: string; // UI専用
  __uploadStatus?: "queued" | "uploading" | "paused" | "error" | "done";
  __uploadProgress?: number; // 0-100
  __uploadError?: string | null;
};

export function GofileVideoResToGofileVideo(v: GofileVideoRes): GofileVideo {
  return {
    Id: v.id,
    Name: v.name,
    GofileId: v.gofile_id,
    GofileDirectUrl: v.gofile_direct_url,
    VideoUrl: v.video_url,
    ThumbnailUrl: v.thumbnail_url,
    Description: v.description,
    PlayCount: v.play_count,
    LikeCount: v.like_count,
    IsShared: v.is_shared,
    GofileTags: v.gofile_tags.map((t) => ({
      ID: t.id,
      Name: t.name,
      // バックエンドの定義に応じて増えうるので任意
      ...t,
    })),
    GofileVideoComments: v.gofile_video_comments.map((c) => ({
      ID: c.id,
      GofileVideoID: v.id,
      UserID: c.user_id,
      User: adaptUserResToUser(c.user), // コメントのユーザー情報は含まれないので空で初期化
      Comment: c.comment,
      LikeCount: c.like_count,
      CreatedAt: c.created_at,
      UpdatedAt: c.updated_at,
    })),
    UserId: v.user_id,
    User: {
      Id: v.user.id,
      Name: v.user.name,
      IconUrl: v.user.icon_url,
      UserType: v.user.user_type,
      Bio: v.user.bio,
      ...v.user,
    },
    HasLike: v.has_like,
    CreatedAt: v.created_at,
    UpdatedAt: v.updated_at,
  };
}

export type GofileTag = {
  ID: string;
  Name: string;
};

export type GofileVideoComment = {
  ID: string;
  GofileVideoID: string;
  UserID: string;
  User: User;
  Comment: string;
  LikeCount: number;
  CreatedAt: string; // "2006-01-02 15:04:05"
  UpdatedAt: string;
};

export type User = {
  Id: string;
  Name?: string;
  IconUrl?: string;
  UserType?: string;
  Bio?: string;
  [k: string]: any;
};

export function newUser(): User {
  return {
    Id: "",
    Name: "",
    IconUrl: "",
    UserType: "",
    Bio: "",
  };
}

export function adaptUserResToUser(u: UserRes): User {
  return {
    Id: u.id,
    Name: u.name,
    IconUrl: u.icon_url,
    UserType: u.user_type,
    Bio: u.bio,
    ...u,
  };
}

// ==== キューは据え置き ====
export interface UploadTask {
  id: string;
  name: string;
  size: number; // bytes
  progress: number; // 0-100
  status: "queued" | "uploading" | "paused" | "done" | "error";
  file?: File;
  controller?: AbortController;
  gofile?: {
    fileId?: string;
    downloadPage?: string;
    directLink?: string;
    guestToken?: string;
  };
  error?: string;
}

export type GofileUpdateReq = {
  name: string;
  description: string;
  is_shared: boolean;
  tag_ids: string[]; // タグ名の配列
};

export type VerifyEmailRes = {
  accessToken: string;
  tokenType: string;
  user: {
    userId: string;
    email: string;
    userType: string;
  };
};
