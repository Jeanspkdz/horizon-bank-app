"use client";
import { Button } from "@/modules/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/ui/table";
import { cn } from "@/modules/core/lib/utils";
import { Transaction } from "@/modules/transactions/types";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { defaultColumns } from "./columns";

interface TransactionsTableProps {
  data: Transaction[];
  showFull?: boolean
}
export const TransactionsTable = ({ data, showFull = true}: TransactionsTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "datetime", desc: false },
  ]);

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
    <div className="">
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b bg-muted/50">
              {headerGroup.headers.map((header) => {
                
                const columnsLength = headerGroup.headers.length || 1;
                const style = {
                  width: `${100 / columnsLength}%`,
                };

                return (
                  <TableHead
                    key={header.id}
                    className="text-gray-500 font-medium min-w-[150px] py-3"
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
                  <TableCell key={cell.id} className="max-w-[12ch] truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={defaultColumns.length}
                className="text-center py-4"
              >
                No Transactions Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {(table.getRowModel().rows.length > 0 && showFull) && (
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
      )}
    </div>
  );
};
