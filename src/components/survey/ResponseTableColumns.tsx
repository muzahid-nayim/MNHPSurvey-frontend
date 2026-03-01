"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResponseTableRow } from "@/types";

export const responseColumns: ColumnDef<ResponseTableRow>[] = [
	{
		accessorKey: "sn",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
				className="h-8 p-0"
			>
				SN
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("sn")}</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
				className="h-8 p-0"
			>
				Email
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="text-sm text-muted-foreground">
				{row.getValue("email")}
			</div>
		),
	},
	{
		accessorKey: "respondent_name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
				className="h-8 p-0"
			>
				Name
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="text-sm">
				{row.getValue("respondent_name") || "N/A"}
			</div>
		),
	},
	{
		accessorKey: "selected_options",
		header: "Selected Option(s)",
		cell: ({ row }) => (
			<div className="max-w-xs truncate text-sm font-medium">
				{row.getValue("selected_options")}
			</div>
		),
	},
	{
		accessorKey: "submitted_at",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
				className="h-8 p-0"
			>
				Submitted At
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("submitted_at") as string);
			return (
				<div className="text-sm text-muted-foreground">
					{date.toLocaleDateString()} {date.toLocaleTimeString()}
				</div>
			);
		},
	},
];
