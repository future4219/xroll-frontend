export type Comment = {
  id: number;
  video_id: number;
  comment: string;
};

export type Video = {
  id: number;
  video_url: string;
  thumbnail_url?: string;
  tweet_url?: string;
  download_count?: number;
  ranking?: number;
  like_count?: number;
  comments: Comment[];
  created_at?: string;
};
