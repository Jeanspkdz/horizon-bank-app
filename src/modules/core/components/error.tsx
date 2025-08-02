import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}
export const ErrorFallback = ({
  title = "Error",
  message = "Something went wrong",
  onRetry,
}: ErrorComponentProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-[500px]">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-800 mb-1">{title}</h3>
          <p className="text-sm text-red-700">{message}</p>

          {onRetry && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-800 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
