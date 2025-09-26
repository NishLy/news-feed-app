import IUser from "@/types/user";

export interface IFollow {
  id: number;
  followerId: number;
  followeeId: number;
}

export interface IFollowCreate {
  followeId: number;
  isFollow: boolean;
}
