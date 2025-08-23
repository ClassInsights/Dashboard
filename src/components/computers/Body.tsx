import useComputers from "@/hooks/use-computers";
import type { Computer } from "@/types/Computer";

import type { ComputerCommand } from "@/types/ComputerCommand";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { LogOut, Power, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
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
  const [commandAlert, setCommandAlert] = useState<{
    isOpen: boolean;
    description?: string;
    label?: string;
    action?: () => void;
  }>({
    isOpen: false,
  });

  const {
    commands: { mutate: sendCommand },
  } = useComputers();

  const selectedComputers = table.getSelectedRowModel().rows.map((row) => row.original);
  const hasSelectedRows = selectedComputers.length > 0;

  const handleCommand = (
    event: React.MouseEvent<HTMLDivElement>,
    command: ComputerCommand,
    { original: computer }: Row<Computer>,
  ) => {
    const action = () => {
      sendCommand(
        hasSelectedRows
          ? selectedComputers.map((computer) => ({ computerId: computer.computerId, command }))
          : [{ computerId: computer.computerId, command }],
      );
      table.resetRowSelection();
    };

    if (event.shiftKey) {
      action();
      return;
    }

    switch (command) {
      case "shutdown":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `Die ${selectedComputers.length} ausgewählten Computer ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} werden sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`
            : `Der Computer ${computer.name} wird sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`,
          label: "Herunterfahren",
          action,
        });
        break;
      case "restart":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `Die ${selectedComputers.length} ausgewählten Computer ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} werden sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`
            : `Der Computer ${computer.name} wird sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`,
          label: "Neustarten",
          action,
        });
        break;
      case "logoff":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `Alle Benutzer an den ${selectedComputers.length} ausgewählten Computern ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} werden sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`
            : `Der Benutzer am Computer ${computer.name} wird sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`,
          label: "Abmelden",
          action,
        });
        break;
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <ContextMenu key={row.id} modal={false}>
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
                {hasSelectedRows ? (
                  <ContextMenuItem disabled>
                    {selectedComputers.length > 3
                      ? `${selectedComputers.length} Computer ausgewählt`
                      : selectedComputers.length === 1
                        ? selectedComputers[0].name
                        : `${selectedComputers
                            .slice(0, -1)
                            .map((computer) => computer.name)
                            .join(", ")} und ${selectedComputers
                            .slice(-1)
                            .map((computer) => computer.name)
                            .join(", ")}`}
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem disabled>{row.original.name}</ContextMenuItem>
                )}
                <ContextMenuSeparator />
                <ContextMenuItem
                  disabled={!row.original.online}
                  onClick={(event) => handleCommand(event, "shutdown", row)}
                >
                  <Power />
                  Herunterfahren
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={!row.original.online}
                  onClick={(event) => handleCommand(event, "restart", row)}
                >
                  <RotateCcw />
                  Neustarten
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={!row.original.online}
                  onClick={(event) => handleCommand(event, "logoff", row)}
                >
                  <LogOut />
                  Abmelden
                </ContextMenuItem>
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
      <AlertDialog
        open={commandAlert.isOpen}
        onOpenChange={(open) => setCommandAlert((prev) => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
            <AlertDialogDescription>{commandAlert.description}</AlertDialogDescription>
            <AlertDialogDescription>
              Pro-Tipp: Shift + Klick um Bestätigung zu überspringen
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={commandAlert.action}>
              {commandAlert.label || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Body;
