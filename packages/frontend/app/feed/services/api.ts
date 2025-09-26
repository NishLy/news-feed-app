import { MutationFunction, QueryFunction } from "@tanstack/react-query";
import {
  GenericSuccessResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";
import api from "@/lib/axios";
import { IFeed, IFeedCreate } from "../types/feed";

interface PaginatedFeedsResponse extends PaginatedResponse<IFeed> {
  posts: IFeed[];
}

export const queryFeeds: QueryFunction<
  PaginatedFeedsResponse,
  ["feeds", PaginationParams],
  number | undefined
> = async ({ queryKey, pageParam }) => {
  const [, params] = queryKey;

  const res = await api.get("/feed", {
    params: {
      ...params,
      page: pageParam,
    },
  });

  return res.data;
};

export const mutateFeed: MutationFunction<
  GenericSuccessResponse,
  IFeedCreate
> = async (data) => {
  const response = await api.post<GenericSuccessResponse>("/posts", data);
  return response.data;
};
