import { AxiosError } from "axios";

type PlaidErrorResponse = {
  error_code?: string;
};

export function isPlaidError(
  error: unknown
): error is AxiosError<PlaidErrorResponse> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

