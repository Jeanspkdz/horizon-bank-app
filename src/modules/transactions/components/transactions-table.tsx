"use client";
import { Badge } from "@/modules/core/components/ui/badge";
import { Button } from "@/modules/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/ui/table";
import { formatDate, formatMoney } from "@/modules/core/lib/format";
import { cn } from "@/modules/core/lib/utils";
import { Transaction } from "@/modules/transactions/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, ArrowUpDown , Image as ImageIcon} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const columnHelper = createColumnHelper<Transaction>();
const defaultColumns = [
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
          <div className="rouded-full" >
            <ImageIcon width={48} height={48} className="rounded-full"/>
          </div>
        )}

        <span>{info.renderValue()}</span>
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
  }),
  columnHelper.accessor("datetime", {
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Datetime
        <ArrowUpDown />
      </Button>
    ),
  }),
  columnHelper.accessor("category", {
    cell: (info) => <Badge className="capitalize">{info.getValue()}</Badge>,
    header: () => (
      <Button variant={"ghost"} className="hover:cursor-pointer">
        Category
        <ArrowUpDown />
      </Button>
    ),
  }),
];

interface TransactionsTableProps {
  data: Transaction[];
}
export const TransactionsTable = ({ data }: TransactionsTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnsLength = headerGroup.headers.length || 1;
                const style = {
                  width: `${100 / columnsLength}%`,
                };

                return (
                  <TableHead
                    key={header.id}
                    className="text-gray-500 font-medium min-w-[150px] "
                    style={style}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  row.original.amount >= 0
                    ? "bg-green-300/15 hover:bg-green-300/30"
                    : "bg-red-300/15 hover:bg-red-300/30"
                )}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={defaultColumns.length}
                className="text-center"
              >
                No Transactions Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <Button
            className="hover:cursor-pointer"
            variant={"ghost"}
            disabled={!table.getCanPreviousPage()}
            onClick={table.previousPage}
          >
            <ArrowLeft />
            Prev
          </Button>

          <span>
            {`${
              table.getState().pagination.pageIndex + 1
            } / ${table.getPageCount()}`}
          </span>

          <Button
            className="hover:cursor-pointer"
            variant={"ghost"}
            disabled={!table.getCanNextPage()}
            onClick={table.nextPage}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
