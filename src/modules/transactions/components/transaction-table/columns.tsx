import { Badge } from "@/modules/core/components/ui/badge";
import { formatDate, formatMoney } from "@/modules/core/lib/format";
import { createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "../../types";
import { Button } from "@/modules/core/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/modules/core/lib/utils";

const columnHelper = createColumnHelper<Transaction>();
export const defaultColumns = [
  columnHelper.accessor((row) => row.merchantName, {
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Transaction
        <ArrowUpDown />
      </Button>
    ),
    cell: (info) => (
      <div className="flex gap-x-2 items-center font-medium">
        {info.row.original.merchantLogoUrl ? (
          <Image
            className="rounded-full"
            src={info.row.original.merchantLogoUrl}
            alt="Logo"
            width={48}
            height={48}
          />
        ) : (
          <div className="rouded-full">
            <ImageIcon width={48} height={48} className="rounded-full" />
          </div>
        )}

        <span className="max-w-[12ch] truncate" title={info.getValue()}>{info.renderValue()}</span>
      </div>
    ),
    id: "transaction",
  }),
  columnHelper.accessor("amount", {
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Amount
        <ArrowUpDown />
      </Button>
    ),
    cell: (info) => (
      <span
        className={cn(
          "font-semibold",
          info.getValue() < 0 ? "text-red-500" : "text-green-600"
        )}
      >
        {formatMoney(info.getValue(), "USD")}
      </span>
    ),
    sortingFn: "alphanumeric",
    sortUndefined: "last",
    id:"amount"
  }),
  columnHelper.accessor("status", {
    cell: (info) => (
      <Badge variant={info.getValue()} className="capitalize">
        <div className="w-2 h-2 bg-current rounded-full mr-1"></div>
        {info.getValue()}
      </Badge>
    ),
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Status
        <ArrowUpDown />
      </Button>
    ),
    id: "status"
  }),
  columnHelper.accessor("datetime", {
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Datetime
        <ArrowUpDown />
      </Button>
    ),
    id: "datetime",
    invertSorting: true
  }),
  columnHelper.accessor("category", {
    cell: (info) => <Badge className="capitalize">{info.getValue()}</Badge>,
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Category
        <ArrowUpDown />
      </Button>
    ),
    id: "category"
  }),
];
