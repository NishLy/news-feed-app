export interface GenericSuccessResponse {
  message: string;
}
export interface GenericResponse {
  message: string;
}

export interface GenericResponseWithData<T> {
  message: string;
  data: T;
}

export interface GenericErrorResponse {
  message: string;
  errors: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}
