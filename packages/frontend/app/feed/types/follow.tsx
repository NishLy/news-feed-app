export interface IFollow {
  id: number;
  followerId: number;
  followeeId: number;
}

export interface IFollowCreate {
  followeId: number;
  isFollow: boolean;
}
