import { Skeleton } from "@/modules/core/components/ui/skeleton";
import { RightSidebarSkeleton } from "@/modules/core/components/right-sidebar-skeleton";

export function HomePanelSkeleton() {
  console.log("HOME PANEL SKELETON");

  return (
    <div className="flex w-full h-full">
      {/* Left Section */}
      <div className="flex-1 space-y-6 mr-5 px-5 pt-5">
        <div>
          <Skeleton className="h-8 w-48" /> {/* Welcome */}
          <Skeleton className="h-6 w-72 mt-4" /> {/* Subtext */}
        </div>

        <div className="p-4 rounded-xl shadow w-full flex">
          {/* Pie Chart */}
          <Skeleton className="h-28 w-28 rounded-full mr-5" />
          <div className="flex gap-y-2 flex-col justify-between">
            <Skeleton className="h-4 w-40 mb-5" /> {/* Bank Accounts */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" /> {/* Total Balance */}
              <Skeleton className="h-8 w-48" /> {/* Total Balance */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <RightSidebarSkeleton />
    </div>
  );
}
