"use client";

import { useEffect, useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterPlaceholder?: string;
	filterColumn?: string;
	/** hide name + submitted_at on small screens */
	compactMobile?: boolean;
}

export function ResponseDataTable<TData, TValue>({
	columns,
	data,
	filterPlaceholder = "Filter by email...",
	filterColumn = "email",
	compactMobile = false,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{},
	);

	useEffect(() => {
		if (compactMobile) {
			setColumnVisibility({
				respondent_name: false,
				submitted_at: false,
			});
		} else {
			setColumnVisibility({});
		}
	}, [compactMobile]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	return (
		<div className="min-w-0 max-w-full space-y-3 sm:space-y-4">
			{/* Filter and Column Visibility Controls */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
				<Input
					placeholder={filterPlaceholder}
					value={
						(table
							.getColumn(filterColumn)
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn(filterColumn)
							?.setFilterValue(event.target.value)
					}
					className="w-full sm:max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="w-full sm:ml-auto sm:w-auto"
						>
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) =>
										column.toggleVisibility(!!value)
									}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table scrolls inside — page itself should not grow sideways */}
			<div className="max-w-full overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="h-12">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="py-3"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									No responses found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-3">
				<p className="text-xs text-muted-foreground sm:text-sm">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount() || 1}
				</p>
				<div className="flex w-full gap-2 sm:w-auto">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 sm:flex-none"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 sm:flex-none"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
