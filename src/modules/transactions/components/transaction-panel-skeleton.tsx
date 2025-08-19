import { Heading } from "@/modules/core/components/heading";
import { Skeleton } from "@/modules/core/components/ui/skeleton";
import React from "react";

export const TransactionPanelSkeleton = () => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <div>
          <Heading
            type="default"
            title="Transaction History"
            subtitle="Gain Insights and Track Your Transactions Over Time"
          />
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
