import { Skeleton } from "@/modules/core/components/ui/skeleton";
import { Button } from "@/modules/core/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { defaultColumns } from "@/modules/transactions/components/transaction-table/columns";

export const TransactionTableSkeleton = ({ rows = defaultColumns.length }) => {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="grid grid-cols-5 gap-4">
            {defaultColumns.map(column => (
              <Button
              key={column.id}
              variant="ghost"
              className="justify-start hover:cursor-pointer capitalize"
            >
             {column.id}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="px-4 py-3">
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Transaction Column - Logo + Text */}
                <div className="flex gap-x-2 items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Amount Column */}
                <div>
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Status Column - Badge */}
                <div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Datetime Column */}
                <div>
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Category Column - Badge */}
                <div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
