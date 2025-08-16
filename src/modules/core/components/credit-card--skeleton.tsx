import { cn } from "../lib/utils";
import { Skeleton } from "./ui/skeleton";

export const CreditCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn(
        "flex aspect-[32/19] min-h-[190px] max-w-[280px] md:max-w-[320px] lg:max-w-[360px] rounded-xl overflow-hidden relative z-[5]",
        className
      )}
    >
      {/* Parte izquierda (contenido principal) */}
      <div className="flex-9/12 bg-gray-200 dark:bg-gray-800 flex flex-col justify-between p-5">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-8 w-full bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/3 ml-auto bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Parte derecha (logos) */}
      <div className="relative flex-3/12 flex flex-col justify-between bg-gray-200 dark:bg-gray-700 p-5">
        <Skeleton className="h-6 w-6 self-end bg-gray-300 dark:bg-gray-600" />
        <Skeleton className="h-8 w-12 bg-gray-300 dark:bg-gray-600" />
        
        {/* Líneas de fondo */}
        <div className="absolute inset-0 h-full bg-gray-400/20 dark:bg-gray-600/20" />
      </div>
    </article>
  );
};