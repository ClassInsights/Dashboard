import useComputers from "@/hooks/use-computers";
import type { Computer } from "@/types/Computer";

import { flexRender, type Table } from "@tanstack/react-table";
import { LogOut, Power, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import CommandButton from "../computer/CommandButton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { columns } from "./Columns";

const Body = ({ table }: { table: Table<Computer> }) => {
  const {
    commands: { mutate: sendCommand },
  } = useComputers();

  const navigate = useNavigate();

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
              <TableRow data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
              <CommandButton
                label="Herunterfahren"
                disabled={!row.original.online}
                action={() =>
                  sendCommand([{ command: "shutdown", computerId: row.original.computerId }])
                }
                alertDescription={`Der Computer ${row.original.name} wird sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`}
                trigger={
                  <ContextMenuItem disabled={!row.original.online}>
                    <Power />
                    Herunterfahren
                  </ContextMenuItem>
                }
              />
              <CommandButton
                label="Neustarten"
                disabled={!row.original.online}
                action={() =>
                  sendCommand([{ command: "restart", computerId: row.original.computerId }])
                }
                alertDescription={`Der Computer ${row.original.name} wird sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`}
                trigger={
                  <ContextMenuItem disabled={!row.original.online}>
                    <RotateCcw />
                    Neustarten
                  </ContextMenuItem>
                }
              />
              <CommandButton
                label="Abmelden"
                disabled={!row.original.online}
                action={() =>
                  sendCommand([{ command: "logoff", computerId: row.original.computerId }])
                }
                alertDescription={`Alle angemeldeten Benutzer am Computer ${row.original.name} werden sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`}
                trigger={
                  <ContextMenuItem disabled={!row.original.online}>
                    <LogOut />
                    Abmelden
                  </ContextMenuItem>
                }
              />
              <ContextMenuSeparator />
              <ContextMenuItem
                inset
                onClick={() => navigate(`/computer/${row.original.computerId}`)}
              >
                Details anzeigen
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Keine Computer gefunden.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default Body;
