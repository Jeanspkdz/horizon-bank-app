interface PlaidErrorResponse {
  error_code: string;
  error_message: string;
  display_message?: string;
  request_id?: string;
}

export function isPlaidError(
  error: unknown
): error is { response: { data: PlaidErrorResponse } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "error_code" in error.response.data
  );
}
