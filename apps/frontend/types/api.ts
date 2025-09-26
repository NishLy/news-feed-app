export interface GenericSuccessResponse {
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
