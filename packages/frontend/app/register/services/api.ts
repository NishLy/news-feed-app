import { GenericSuccessResponse } from "@/types/api";
import { RegisterRequest } from "../types/register";
import api from "@/lib/axios";

export const mutateRegister = async (data: RegisterRequest) => {
  const res = await api.post<GenericSuccessResponse>("/register", data);
  return res.data;
};
