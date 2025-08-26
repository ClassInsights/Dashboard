import type { Computer } from "@/types/Computer";
import { type Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ComputerTablePagination = ({ table }: { table: Table<Computer> }) => {
  return (
    <div className="flex flex-col items-center gap-4 px-2 lg:flex-row lg:justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} von{" "}
        {table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt.
      </div>
      <div className="flex flex-col items-center gap-4 space-x-6 lg:flex-row lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Einträge pro Seite</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Seite {table.getState().pagination.pageIndex + 1} von{" "}
            {Math.min(table.getPageCount(), 1)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="flex size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Zur ersten Seite navigieren</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Zur vorherigen Seite navigieren</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Zur nächsten Seite navigieren</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Zur letzten Seite navigieren</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerTablePagination;
