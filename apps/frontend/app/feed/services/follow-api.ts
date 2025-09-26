import { MutationFunction } from "@tanstack/react-query";
import { GenericSuccessResponse } from "@/types/api";
import api from "@/lib/axios";
import { IFollowCreate } from "../types/follow";

export const mutateFollow: MutationFunction<
  GenericSuccessResponse,
  IFollowCreate
> = async (data) => {
  const response = data.isFollow
    ? await api.post<GenericSuccessResponse>("/follow/" + data.followeId)
    : await api.delete<GenericSuccessResponse>("/follow/" + data.followeId);
  return response.data;
};
