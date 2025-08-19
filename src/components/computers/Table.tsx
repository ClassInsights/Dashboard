import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Computer } from "@/types/Computer";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import ComputerTablePagination from "./Pagination";
import Toolbar from "./Toolbar";

interface DataTableProps {
  columns: ColumnDef<Computer>[];
  data: Computer[];
}

const ComputerTable = ({ columns, data }: DataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "Status",
      desc: true,
    },
    {
      id: "Name",
      desc: false,
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: (row) => row.original.online,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    initialState: {
      sorting: [
        {
          id: "Status",
          desc: true,
        },
        {
          id: "Name",
          desc: false,
        },
      ],
      columnVisibility: {
        "Zuletzt Online": false,
      },
    },
  });

  return (
    <>
      <Toolbar table={table} />
      <div className="my-4 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ComputerTablePagination table={table} />
    </>
  );
};

export default ComputerTable;
