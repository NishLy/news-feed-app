import { GenericSuccessResponse } from "@/types/api";
import { RegisterRequest } from "../types/register";
import api from "@/lib/axios";

export const mutateRegister = async (data: RegisterRequest) => {
  return api.post<GenericSuccessResponse>("/register", data);
};
