import useComputers from "@/hooks/use-computers";
import type { Computer } from "@/types/Computer";

import useActiveDirectory from "@/hooks/use-activeDirectory";
import type { ComputerCommand } from "@/types/ComputerCommand";
import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { LogOut, Power, RotateCcw, School } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import RoomAssignment, { type RoomAssignmentProps } from "../RoomAssignment";
import {
  AlertDialog,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { columns } from "./Columns";

const Body = ({ table }: { table: Table<Computer> }) => {
  const [commandAlert, setCommandAlert] = useState<{
    isOpen: boolean;
    description?: string;
    label?: string;
    someOffline?: boolean;
    action?: () => void;
  }>({
    isOpen: false,
  });

  const [roomAssignment, setRoomAssignment] = useState<RoomAssignmentProps>({
    isOpen: false,
    onOpenChange: (isOpen) => setRoomAssignment((prev) => ({ ...prev, isOpen })),
    table,
  });

  const {
    commands: { mutate: sendCommand },
  } = useComputers();

  const { data: adCredentials, isLoading: isADLoading } = useActiveDirectory();

  const autoSyncEnabled = adCredentials?.autoSync ?? false;

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
          ? selectedComputers.map((computer) => ({
              computerId: computer.computerId,
              command,
            }))
          : [{ computerId: computer.computerId, command }],
      );
      table.resetRowSelection();
    };

    if (event.shiftKey) {
      action();
      return;
    }

    const someOffline =
      hasSelectedRows &&
      selectedComputers.filter((c) => c.online).length < selectedComputers.length;

    switch (command) {
      case "shutdown":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `${selectedComputers.length === 1 ? "Der ausgewählte" : `Die ${selectedComputers.length} ausgewählten`} Computer ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} ${selectedComputers.length === 1 ? "wird" : "werden"} sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`
            : `Der Computer ${computer.name} wird sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`,
          label: "Herunterfahren",
          someOffline,
          action,
        });
        break;
      case "restart":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `${selectedComputers.length === 1 ? "Der ausgewählte" : `Die ${selectedComputers.length} ausgewählten`} Computer ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} ${selectedComputers.length === 1 ? "wird" : "werden"} sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`
            : `Der Computer ${computer.name} wird sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`,
          label: "Neustarten",
          someOffline,
          action,
        });
        break;
      case "logoff":
        setCommandAlert({
          isOpen: true,
          description: hasSelectedRows
            ? `Alle Benutzer an ${selectedComputers.length === 1 ? "dem ausgewählten" : `den ${selectedComputers.length} ausgewählten`} Computern ${selectedComputers.length <= 3 ? ` (${selectedComputers.map((computer) => computer.name).join(", ")})` : ""} werden sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`
            : `Alle Benutzer am Computer ${computer.name} werden sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`,
          label: "Abmelden",
          someOffline,
          action,
        });
        break;
    }
  };

  const handleRoomAssign = ({ original: computer }: Row<Computer>) => {
    setRoomAssignment((prev) => ({
      ...prev,
      isOpen: true,
      computerIds: hasSelectedRows
        ? selectedComputers.map((c) => c.computerId)
        : [computer.computerId],
    }));
  };

  const navigate = useNavigate();
  const location = useLocation();

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
                  disabled={
                    hasSelectedRows
                      ? selectedComputers.every((c) => !c.online)
                      : !row.original.online
                  }
                  onClick={(event) => handleCommand(event, "shutdown", row)}
                >
                  <Power />
                  Herunterfahren
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={
                    hasSelectedRows
                      ? selectedComputers.every((c) => !c.online)
                      : !row.original.online
                  }
                  onClick={(event) => handleCommand(event, "restart", row)}
                >
                  <RotateCcw />
                  Neustarten
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={
                    hasSelectedRows
                      ? selectedComputers.every((c) => !c.online)
                      : !row.original.online
                  }
                  onClick={(event) => handleCommand(event, "logoff", row)}
                >
                  <LogOut />
                  Abmelden
                </ContextMenuItem>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <span>
                      <ContextMenuItem
                        onClick={() => handleRoomAssign(row)}
                        disabled={isADLoading || autoSyncEnabled}
                      >
                        <School />
                        Raum zuweisen
                      </ContextMenuItem>
                    </span>
                  </TooltipTrigger>
                  {autoSyncEnabled && (
                    <TooltipContent>
                      <p>
                        Nicht möglich da automatische Active Directory Synchronisierung aktiviert
                        ist!
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
                <ContextMenuSeparator />
                <ContextMenuItem
                  inset
                  onClick={() =>
                    hasSelectedRows
                      ? navigate(`/computers/${selectedComputers[0].computerId}${location.search}`)
                      : navigate(`/computers/${row.original.computerId}${location.search}`)
                  }
                  disabled={selectedComputers.length > 1}
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
            <AlertDialogTitle>Sind Sie sich sicher?</AlertDialogTitle>
            <AlertDialogDescription>{commandAlert.description}</AlertDialogDescription>
            <AlertDialogDescription>
              Pro-Tipp: Shift + Klick um Bestätigung zu überspringen
            </AlertDialogDescription>
            {commandAlert.someOffline === true && (
              <AlertDialogDescription className="font-semibold">
                Achtung: Manche Computer können den Befehl nicht empfangen, da sie offline sind.
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={commandAlert.action}>
              {commandAlert.label || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <RoomAssignment {...roomAssignment} />
    </>
  );
};

export default Body;
