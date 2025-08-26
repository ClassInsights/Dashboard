import type { Computer } from "@/types/Computer";
import { type Table } from "@tanstack/react-table";
import { Columns2, Columns3, Columns4, Square } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ComputerTableViewOptions = ({ table }: { table: Table<Computer> }) => {
  const amountOfVisible =
    table.getAllColumns().filter((column) => column.getIsVisible()).length - 2;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex h-8">
          {amountOfVisible === 1 ? (
            <Square />
          ) : amountOfVisible === 2 ? (
            <Columns2 />
          ) : amountOfVisible === 3 ? (
            <Columns3 />
          ) : (
            <Columns4 />
          )}
          <span className="hidden lg:block">Ansicht</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Spalten anzeigen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ComputerTableViewOptions;
