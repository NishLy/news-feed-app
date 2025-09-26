import IUser from "@/types/user";

export interface IFeed {
  id: number;
  createdAt: string;
  content: string;
  userId: number;
  user: IUser;
}

export interface IFeedCreate {
  content: string;
}
