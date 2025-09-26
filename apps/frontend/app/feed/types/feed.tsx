export interface IFeed {
  id: number;
  createdAt: string;
  content: string;
  userId: number;
}

export interface IFeedCreate {
  content: string;
}
