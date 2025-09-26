import api from "@/lib/axios";
import { LoginRequest } from "../types/login";
import { MutationFunction } from "@tanstack/react-query";

export interface LoginResponse {
  token: string;
}

export const mutateLogin: MutationFunction<
  LoginResponse,
  LoginRequest
> = async (data) => {
  const response = await api.post<LoginResponse>("/login", data);
  return response.data;
};
