import type { Computer } from "@/types/Computer";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";

export const columns: ColumnDef<Computer>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "macAddress",
		header: "MAC Adresse",
		cell: ({ row }) => {
			const mac = row.getValue("macAddress");
			if (typeof mac !== "string") return <p>???</p>;
			return <div>{mac.match(/.{1,2}/g)?.join(":")}</div>;
		},
	},
	{
		accessorKey: "ipAddress",
		header: "IP Adresse",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const computer = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<span className="sr-only">Menü öffnen</span>
						<MoreHorizontal className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Aktionen</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => alert(`Computer ID: ${computer.computerId}`)}>
							Copy Computer ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
