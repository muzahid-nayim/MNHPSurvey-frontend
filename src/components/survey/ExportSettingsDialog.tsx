"use client";

import { useState, type ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	BarChart3,
	FileSpreadsheet,
	FileText,
	Loader2,
	PieChart,
} from "lucide-react";
import { cn } from "@/core/utils";

export type ExportFormat = "csv" | "pdf";
export type ChartStyle = "none" | "bar" | "pie" | "both";

export type ExportSettings = {
	format: ExportFormat;
	rowLimit: number | null; // null = all rows
	includeSummary: boolean;
	includeResponses: boolean;
	chartStyle: ChartStyle;
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	totalResponses: number;
	isExporting: boolean;
	onConfirm: (settings: ExportSettings) => void;
};

const ROW_PRESETS = [25, 50, 100, 250];

export function ExportSettingsDialog({
	open,
	onOpenChange,
	totalResponses,
	isExporting,
	onConfirm,
}: Props) {
	const [format, setFormat] = useState<ExportFormat>("pdf");
	const [rowLimit, setRowLimit] = useState<number | null>(50);
	const [customLimit, setCustomLimit] = useState("");
	const [includeSummary, setIncludeSummary] = useState(true);
	const [includeResponses, setIncludeResponses] = useState(true);
	const [chartStyle, setChartStyle] = useState<ChartStyle>("bar");

	const handleConfirm = () => {
		let finalLimit = rowLimit;
		if (customLimit.trim()) {
			const n = Number(customLimit);
			if (!Number.isNaN(n) && n > 0) {
				finalLimit = n;
			}
		}

		onConfirm({
			format,
			rowLimit: finalLimit,
			includeSummary,
			includeResponses,
			chartStyle,
		});
	};

	const isPdf = format === "pdf";
	const canDownload =
		format === "csv" || includeSummary || includeResponses;

	const selectAllRows = () => {
		setRowLimit(null);
		setCustomLimit("");
	};

	const selectPreset = (n: number) => {
		setRowLimit(n);
		setCustomLimit("");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					// fill most of the screen on phones / short laptops,
					// keep header+footer visible, scroll the middle
					"flex flex-col gap-0 overflow-hidden p-0",
					"w-[calc(100%-1.25rem)] max-w-md",
					"max-h-[min(92dvh,40rem)] sm:max-h-[min(88vh,40rem)]",
				)}
			>
				{/* header — stays put */}
				<DialogHeader className="shrink-0 space-y-1 border-b px-4 pt-4 pb-3 pr-12 text-left sm:px-5">
					<DialogTitle className="text-base sm:text-lg">
						Export responses
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm leading-relaxed">
						PDF for summaries &amp; charts. CSV when you need lots of
						rows.
					</DialogDescription>
				</DialogHeader>

				{/* scrollable settings */}
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
					<div className="space-y-4 sm:space-y-5">
						{/* file type */}
						<section className="space-y-2">
							<Label className="text-xs uppercase tracking-wide text-muted-foreground">
								File type
							</Label>
							<div className="grid grid-cols-2 gap-2">
								<FormatCard
									active={format === "csv"}
									disabled={isExporting}
									onClick={() => setFormat("csv")}
									icon={<FileSpreadsheet className="h-4 w-4" />}
									title="CSV"
									subtitle="Best for large data"
								/>
								<FormatCard
									active={format === "pdf"}
									disabled={isExporting}
									onClick={() => setFormat("pdf")}
									icon={<FileText className="h-4 w-4" />}
									title="PDF"
									subtitle="Best for sharing"
								/>
							</div>
						</section>

						{/* row limit */}
						<section className="space-y-2">
							<div className="flex items-baseline justify-between gap-2">
								<Label className="text-xs uppercase tracking-wide text-muted-foreground">
									Row limit
								</Label>
								<span className="text-[11px] text-muted-foreground tabular-nums">
									{totalResponses} total
								</span>
							</div>

							<div className="grid grid-cols-5 gap-1.5">
								<Chip
									active={rowLimit === null && !customLimit}
									disabled={isExporting}
									onClick={selectAllRows}
								>
									All
								</Chip>
								{ROW_PRESETS.map((n) => (
									<Chip
										key={n}
										active={rowLimit === n && !customLimit}
										disabled={
											isExporting ||
											(totalResponses > 0 && n > totalResponses)
										}
										onClick={() => selectPreset(n)}
									>
										{n}
									</Chip>
								))}
							</div>

							<Input
								type="number"
								min={1}
								inputMode="numeric"
								placeholder="Or type a custom limit"
								value={customLimit}
								onChange={(e) => {
									setCustomLimit(e.target.value);
									if (e.target.value) setRowLimit(null);
								}}
								disabled={isExporting}
								className="h-9"
							/>
							{isPdf && (
								<p className="text-[11px] text-muted-foreground leading-snug">
									Keep PDF around 100 rows or less so the table
									stays readable.
								</p>
							)}
						</section>

						{/* include */}
						<section className="space-y-2">
							<Label className="text-xs uppercase tracking-wide text-muted-foreground">
								Include
							</Label>
							<div className="overflow-hidden rounded-lg border divide-y">
								<IncludeRow
									checked={includeSummary}
									disabled={isExporting || !isPdf}
									onCheckedChange={setIncludeSummary}
									title="Summary tables"
									subtitle={
										isPdf
											? "Counts & % per option"
											: "PDF only"
									}
								/>
								<IncludeRow
									checked={includeResponses}
									disabled={isExporting}
									onCheckedChange={setIncludeResponses}
									title="Individual rows"
									subtitle="One row per respondent"
								/>
							</div>
						</section>

						{/* charts */}
						<section
							className={cn(
								"space-y-2",
								!isPdf && "pointer-events-none opacity-45",
							)}
						>
							<Label className="text-xs uppercase tracking-wide text-muted-foreground">
								Charts {isPdf ? "" : "(PDF only)"}
							</Label>
							<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
								{(
									[
										{
											value: "none" as const,
											label: "None",
											icon: null,
										},
										{
											value: "bar" as const,
											label: "Bar",
											icon: <BarChart3 className="h-3.5 w-3.5" />,
										},
										{
											value: "pie" as const,
											label: "Pie",
											icon: <PieChart className="h-3.5 w-3.5" />,
										},
										{
											value: "both" as const,
											label: "Both",
											icon: null,
										},
									]
								).map((item) => (
									<Chip
										key={item.value}
										active={chartStyle === item.value}
										disabled={isExporting || !isPdf}
										onClick={() => setChartStyle(item.value)}
										className="gap-1"
									>
										{item.icon}
										{item.label}
									</Chip>
								))}
							</div>
						</section>
					</div>
				</div>

				{/* footer — stays put */}
				<div className="shrink-0 border-t bg-background px-4 py-3 sm:px-5">
					<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isExporting}
							className="w-full sm:w-auto"
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleConfirm}
							disabled={isExporting || !canDownload}
							className="w-full gap-2 sm:w-auto"
						>
							{isExporting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Exporting…
								</>
							) : (
								<>Download {format.toUpperCase()}</>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* --- small local UI bits (keep this file easy to read) --- */

function FormatCard({
	active,
	disabled,
	onClick,
	icon,
	title,
	subtitle,
}: {
	active: boolean;
	disabled?: boolean;
	onClick: () => void;
	icon: ReactNode;
	title: string;
	subtitle: string;
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
				"disabled:pointer-events-none disabled:opacity-50",
				active
					? "border-primary bg-primary/5 ring-1 ring-primary/30"
					: "hover:bg-muted/50",
			)}
		>
			<span
				className={cn(
					"flex items-center gap-1.5 text-sm font-medium",
					active && "text-primary",
				)}
			>
				{icon}
				{title}
			</span>
			<span className="text-[11px] text-muted-foreground leading-tight">
				{subtitle}
			</span>
		</button>
	);
}

function Chip({
	active,
	disabled,
	onClick,
	children,
	className,
}: {
	active: boolean;
	disabled?: boolean;
	onClick: () => void;
	children: ReactNode;
	className?: string;
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"inline-flex h-9 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors",
				"disabled:pointer-events-none disabled:opacity-40",
				active
					? "border-primary bg-primary text-primary-foreground"
					: "bg-background hover:bg-muted/60",
				className,
			)}
		>
			{children}
		</button>
	);
}

function IncludeRow({
	checked,
	disabled,
	onCheckedChange,
	title,
	subtitle,
}: {
	checked: boolean;
	disabled?: boolean;
	onCheckedChange: (value: boolean) => void;
	title: string;
	subtitle: string;
}) {
	return (
		<label
			className={cn(
				"flex cursor-pointer items-start gap-3 px-3 py-2.5",
				disabled && "cursor-not-allowed opacity-50",
			)}
		>
			<Checkbox
				checked={checked}
				onCheckedChange={(v) => onCheckedChange(v === true)}
				disabled={disabled}
				className="mt-0.5"
			/>
			<span className="min-w-0">
				<span className="block text-sm font-medium leading-none">
					{title}
				</span>
				<span className="mt-1 block text-[11px] text-muted-foreground leading-snug">
					{subtitle}
				</span>
			</span>
		</label>
	);
}
