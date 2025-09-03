import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/contexts/ToastContext";
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
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import Body from "./Body";
import ComputerTablePagination from "./Pagination";
import Toolbar from "./Toolbar";

interface DataTableProps {
  columns: ColumnDef<Computer>[];
  data: Computer[];
  initialFilter?: ColumnFiltersState;
}

const ComputerTable = ({ columns, data, initialFilter }: DataTableProps) => {
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFilter ?? []);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const prevDataRef = useRef(data);

  const { showMessage } = useToast();

  useEffect(() => {
    if (data.length !== prevDataRef.current.length) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      if (pagination.pageIndex !== 0)
        showMessage("Tabelle zurückgesetzt: Computeranzahl hat sich geändert", "success", 5000);
    }

    prevDataRef.current = data;
  }, [data.length, pagination.pageIndex]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    autoResetPageIndex: false,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
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
      columnFilters: initialFilter ?? [],
    },
  });

  // remove room filter when there is no computer in this room
  useEffect(() => {
    const facets = table.getColumn("Raum")!.getFacetedUniqueValues();
    setColumnFilters((prev) =>
      prev
        .map((filter) => {
          if (filter.id !== "Raum") return filter;
          return {
            ...filter,
            value: (filter.value as string[]).filter((value) => facets.has(value)),
          };
        })
        .filter((filter) => (filter.value as string[]).length > 0),
    );
  }, [data]);

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
          <Body table={table} />
        </Table>
      </div>
      <ComputerTablePagination table={table} />
    </>
  );
};

export default ComputerTable;
