import type { Computer } from "@/types/Computer";
import type { Table } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const NameFilter = ({ table }: { table: Table<Computer> }) => {
  const initialNameFilter = (table.getColumn("Name")?.getFilterValue() as string) ?? "";
  const [filter, setFilter] = useState<string>(initialNameFilter);
  const [appliedFilter, setAppliedFilter] = useState<string>(initialNameFilter);

  const applyFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!filter) return;

    table.setColumnFilters([]);
    table.resetPageIndex();
    table.resetRowSelection();

    table.getColumn("Name")?.setFilterValue(filter);
    setAppliedFilter(filter);
  };

  const removeFilter = () => {
    setFilter("");
    setAppliedFilter("");
    table.getColumn("Name")?.setFilterValue("");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          Name
          {appliedFilter && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {appliedFilter}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 lg:min-w-[400px]" align="start">
        <form onSubmit={applyFilter} className="flex w-full max-w-sm items-center gap-2 px-4 pt-4">
          <Input
            name="name-filter"
            role="search"
            placeholder="Computername"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button type="submit" variant="outline" disabled={!filter}>
            Anwenden
          </Button>
        </form>
        <div className="p-4 pt-2 text-sm">
          <p>Hinweis: Bisher gesetzte Filter werden entfernt.</p>
          <ul className="mt-1">
            <li>
              <span className="text-primary">?</span> - Platzhalter für{" "}
              <span className="font-medium">ein einzelnes</span> Zeichen
            </li>
            <li>
              <span className="text-primary">*</span> - Platzhalter für{" "}
              <span className="font-medium">beliebig viele</span> Zeichen
            </li>
          </ul>
          <p className="mt-1 font-medium">Beispiele:</p>
          <ul>
            <li>
              DV5_<span className="text-primary">*</span> &#8594; DV5_
              <span className="text-primary">1</span>, DV5_<span className="text-primary">168</span>
              , DV5_<span className="text-primary">E6</span>, ...
            </li>
            <li>
              DV3_<span className="text-primary">*</span>_UG &#8594; DV3_
              <span className="text-primary">8</span>_UG, DV3_
              <span className="text-primary">84</span>_UG , DV3_
              <span className="text-primary">LP</span>_UG, ...
            </li>
            <li>
              DV<span className="text-primary">?</span>_8 &#8594; DV
              <span className="text-primary">1</span>_8, DV<span className="text-primary">3</span>
              _8, DV<span className="text-primary">A</span>_8, ...
            </li>
          </ul>
        </div>
        <Separator />
        <div className="p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full px-2 py-1.5"
            onClick={removeFilter}
            disabled={!appliedFilter}
          >
            Filter entfernen
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NameFilter;
