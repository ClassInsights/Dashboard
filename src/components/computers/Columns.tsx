import { Checkbox } from "@/components/ui/checkbox";
import type { Computer } from "@/types/Computer";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import ComputerTableColumnHeader from "./ColumnHeader";

export const columns: ColumnDef<Computer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        disabled={!row.original.online}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Status",
    accessorFn: (row) => (row.online ? "Online" : "Offline"),
    header: ({ column }) => <ComputerTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const value = row.getValue("Status") as string;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${row.original.online ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>{value}</span>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(row.getValue("Status") as string);
    },
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => <ComputerTableColumnHeader column={column} title="Name" />,
  },
  {
    id: "Raum",
    accessorKey: "room",
    header: ({ column }) => <ComputerTableColumnHeader column={column} title="Raum" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "IP-Adresse",
    accessorKey: "ipAddress",
    header: ({ column }) => <ComputerTableColumnHeader column={column} title="IP-Adresse" />,
  },
  {
    id: "Mac-Adresse",
    accessorKey: "macAddress",
    header: ({ column }) => <ComputerTableColumnHeader column={column} title="Mac-Adresse" />,
    cell: ({ getValue }) => {
      const macAddress = getValue() as string;
      const formattedMac = macAddress.match(/.{1,2}/g)?.join(":");

      return <div>{formattedMac}</div>;
    },
  },
  {
    id: "Details",
    cell: ({ row }) => {
      const computerId = row.original.computerId;
      return (
        <Link to={`${computerId}`}>
          <span className="font-medium text-primary">Details</span>
        </Link>
      );
    },
  },
];
