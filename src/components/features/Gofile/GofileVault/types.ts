// types.ts

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
  comment: string;
  like_count: number;
  created_at: string; // "2006-01-02 15:04:05"
  updated_at: string;
}

export interface UserRes {
  id: string;
  name?: string;
  icon_url?: string;
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
  like_count: number;
  is_shared: boolean; // 共有されているかどうか
  gofile_tags: GofileTagRes[];
  gofile_video_comments: GofileVideoCommentRes[];
  user_id: string | null;
  user: UserRes;
  created_at: string; // "2006-01-02 15:04:05"
  updated_at: string; // "2006-01-02 15:04:05"
}

export interface GofileVideoListRes {
  videos: GofileVideoRes[];
  count: number;
}

// ==== UIで使う型（後方互換のため既存フィールドは optional で残す）====
export interface VaultItem extends GofileVideoRes {
  /** 既存UI互換: 以下は任意項目（バックエンドに無いので適宜アダプト） */
  title?: string; // => name をミラー
  size?: number; // バックエンドに無い
  createdAt?: string; // => created_at から ISO に変換したもの
  visibility?: Visibility; // 既定は "private"
  duration?: string; // バックエンドに無い（将来のため残す）
  thumbnail?: string; // => thumbnail_url をミラー
  mp4Url?: string; // => video_url or gofile_direct_url をミラー
  tags?: string[]; // => gofile_tags から name を抽出してもOK
  isShared?: boolean; // 共有されているかどうか（share.url があるかどうかで判定）
  share?: {
    url?: string;
    password?: string | null;
    expireAt?: string | null;
    maxPlays?: number | null;
    plays?: number;
    enabled?: boolean;
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
