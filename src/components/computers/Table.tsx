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
import { useSearchParams } from "react-router";
import Body from "./Body";
import ComputerTablePagination from "./Pagination";
import Toolbar from "./Toolbar";

interface DataTableProps {
  columns: ColumnDef<Computer>[];
  data: Computer[];
  initialFilter?: ColumnFiltersState;
}

const parseFilters = (value: string | null): ColumnFiltersState | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as ColumnFiltersState;
  } catch {
    return null;
  }
};

const parseSorting = (value: string | null): SortingState | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as SortingState;
  } catch {
    return null;
  }
};

const ComputerTable = ({ columns, data, initialFilter }: DataTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>(() => {
    const fromUrl = parseSorting(searchParams.get("sorting"));
    return fromUrl ?? [];
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const fromUrl = parseFilters(searchParams.get("filters"));
    return fromUrl ?? initialFilter ?? [];
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const prevDataRef = useRef(data);
  const lastSyncedFiltersRef = useRef<string | null>(null);
  const lastSyncedSortingRef = useRef<string | null>(null);

  const { showMessage } = useToast();

  useEffect(() => {
    if (data.length !== prevDataRef.current.length) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      if (pagination.pageIndex !== 0)
        showMessage("Tabelle zurückgesetzt: Computeranzahl hat sich geändert", "success", 5000);
    }

    prevDataRef.current = data;
  }, [data.length, pagination.pageIndex]);

  // Persist filter + sorting state in the URL, so navigating to details and back keeps the current view.
  useEffect(() => {
    const serializedFilters = columnFilters.length > 0 ? JSON.stringify(columnFilters) : null;
    const serializedSorting = sorting.length > 0 ? JSON.stringify(sorting) : null;

    const isFiltersSynced = lastSyncedFiltersRef.current === serializedFilters;
    const isSortingSynced = lastSyncedSortingRef.current === serializedSorting;

    if (isFiltersSynced && isSortingSynced) return;

    lastSyncedFiltersRef.current = serializedFilters;
    lastSyncedSortingRef.current = serializedSorting;

    const nextParams = new URLSearchParams(searchParams);

    if (serializedFilters) {
      nextParams.set("filters", serializedFilters);
      // legacy: roomId prefilter is now represented via filters
      nextParams.delete("roomId");
    } else {
      nextParams.delete("filters");
    }

    if (serializedSorting) {
      nextParams.set("sorting", serializedSorting);
    } else {
      nextParams.delete("sorting");
    }

    setSearchParams(nextParams, { replace: true });
  }, [columnFilters, sorting, searchParams, setSearchParams]);

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
