import { Heading } from "@/modules/core/components/heading";
import { Skeleton } from "@/modules/core/components/ui/skeleton";
import React from "react";

export const TransactionPanelSkeleton = () => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" /> {/* Welcome */}
          <Skeleton className="h-6 w-72 mt-4" /> {/* Subtext */}
        </div>

        <Skeleton className="h-10 w-[190px]" />
      </div>

      <div className="mt-5">
        <Skeleton className="h-24 w-full mb-5" />

        <Skeleton className="h-5 w-48 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};
