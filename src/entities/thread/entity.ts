export type Thread = {
  id: number;
  title: string;
  threadComments: ThreadComment[];
  createdAt: string;
};

export type ThreadComment = {
  id: number;
  userId: number;
  comment: string;
  createdAt: string;
};
