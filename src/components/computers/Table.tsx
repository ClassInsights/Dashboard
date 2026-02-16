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

const serializeState = (value: unknown[] | null | undefined): string | null => {
  if (!value || value.length === 0) return null;
  return JSON.stringify(value);
};

const ComputerTable = ({ columns, data }: DataTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>(() => {
    return parseSorting(searchParams.get("sorting")) ?? [];
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    return parseFilters(searchParams.get("filters")) ?? [];
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const prevDataRef = useRef(data);

  // Track what we last wrote to the URL so we can distinguish our own writes
  // from external navigation (e.g. sidebar click clearing the params).
  const lastWrittenFilters = useRef<string | null>(serializeState(columnFilters));
  const lastWrittenSorting = useRef<string | null>(serializeState(sorting));

  const { showMessage } = useToast();

  useEffect(() => {
    if (data.length !== prevDataRef.current.length) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      if (pagination.pageIndex !== 0)
        showMessage("Tabelle zurückgesetzt: Computeranzahl hat sich geändert", "success", 5000);
    }

    prevDataRef.current = data;
  }, [data.length, pagination.pageIndex]);

  useEffect(() => {
    const urlFilters = searchParams.get("filters");
    const urlSorting = searchParams.get("sorting");

    if (urlFilters === lastWrittenFilters.current && urlSorting === lastWrittenSorting.current)
      return;

    const nextFilters = parseFilters(urlFilters) ?? [];
    const nextSorting = parseSorting(urlSorting) ?? [];

    lastWrittenFilters.current = urlFilters;
    lastWrittenSorting.current = urlSorting;

    setColumnFilters(nextFilters);
    setSorting(nextSorting);
  }, [searchParams]);

  useEffect(() => {
    const serializedFilters = serializeState(columnFilters);
    const serializedSorting = serializeState(sorting);

    if (
      serializedFilters === lastWrittenFilters.current &&
      serializedSorting === lastWrittenSorting.current
    )
      return;

    lastWrittenFilters.current = serializedFilters;
    lastWrittenSorting.current = serializedSorting;

    const nextParams = new URLSearchParams(searchParams);

    if (serializedFilters) nextParams.set("filters", serializedFilters);
    else nextParams.delete("filters");

    if (serializedSorting) nextParams.set("sorting", serializedSorting);
    else nextParams.delete("sorting");

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
    },
  });

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
