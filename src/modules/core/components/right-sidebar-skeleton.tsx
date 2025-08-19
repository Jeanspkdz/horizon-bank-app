import { Plus } from "lucide-react";
import { Skeleton } from "@/modules/core/components/ui/skeleton";
import { Button } from "@/modules/core/components/ui/button";

export const RightSidebarSkeleton = () => {
  return (
    <aside className="lg:flex lg:flex-col lg:w-[355px] lg:h-full border-l border-l-slate-400/30">
      {/* Header gradient background */}
      <Skeleton className="h-32 " />

      <div className="p-5">
        {/* Avatar */}
        <Skeleton className="w-24 h-24 -mt-14 mb-4 border-[10px] border-white shadow-md rounded-full" />

        {/* User info */}
        <div>
          <Skeleton className="h-8 w-32 mb-2" /> {/* Username */}
          <Skeleton className="h-4 w-40" /> {/* Email */}
        </div>

        {/* My Banks section */}
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl">My Banks</h2>

            <Button variant={"ghost"} className="cursor-pointer text-slate-600" disabled>
              <Plus />
              Add Bank
            </Button>
          </div>

          {/* Credit Cards */}
          <div className="mt-6 relative h-full">
            {/* Front card */}
            <div className="z-20 w-11/12 relative">
              <Skeleton className="w-full h-48 rounded-2xl" />
            </div>

            {/* Back card */}
            <div className="z-10 absolute top-[15%] left-[10%] w-11/12">
              <Skeleton className="w-full h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
