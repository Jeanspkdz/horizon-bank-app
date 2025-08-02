"use client"

import { ErrorFallback } from "@/modules/core/components/error";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log("[UNEXPECTED_ERROR]", error.message);
  }, [error])

  return (
    <div className="grid place-content-center h-full">
        <ErrorFallback
          onRetry= {reset}
        />
    </div>
  )
}
