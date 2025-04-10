import { CustomError } from "../errors";

export type Response<T> =
  | { success: true; data: T }
  | { success: false; error: CustomError };
