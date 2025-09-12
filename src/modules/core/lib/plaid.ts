import { AxiosError } from "axios";


export function isPlaidError(error: unknown): error is AxiosError<any> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as any).isAxiosError === true
  );
}

