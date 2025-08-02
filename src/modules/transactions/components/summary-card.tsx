import { formatMoney } from "@/modules/core/lib/format";
import { cn } from "@/modules/core/lib/utils";
import React from "react";

interface SummaryCardProps {
  title: string;
  name: string;
  balance: number;
  className?: string;
}

export const SummaryCard = ({
  title,
  name,
  balance,
  className,
}: SummaryCardProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-brand-blue p-5 rounded-md text-white",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-sm">{name}</p>
        <p>
          ●●●● ●●●● ●●●● <span className="tracking-widest">0000</span>
        </p>
      </div>

      <div className="p-4 rounded-md border-1 border-white/30 bg-[#5b9bf4]">
        <h4 className="">Current Balance</h4>
        <span className="font-bold text-2xl">
          {formatMoney(balance, "USD")}
        </span>
      </div>
    </div>
  );
};
