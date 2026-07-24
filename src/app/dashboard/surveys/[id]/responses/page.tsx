"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
	useGetResponsesQuery,
	useExportResponsesMutation,
} from "@/core/api/surveyApi";
import { ResponseBarChart } from "@/components/survey/ResponseBarChart";
import { ResponsePieChart } from "@/components/survey/ResponsePieChart";
import { ResponseDetailsTable } from "@/components/survey/ResponseDetailsTable";
import {
	ExportSettingsDialog,
	type ExportSettings,
} from "@/components/survey/ExportSettingsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BarChart3,
	PieChart as PieChartIcon,
	MessageSquareText,
	ArrowUpRightIcon,
	Download,
	Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function SurveyResponsesPage() {
	const params = useParams();
	const surveyId = params.id as string;
	const [chartType, setChartType] = useState<"bar" | "pie">("bar");
	const [exportOpen, setExportOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const {
		data: aggregatedResponses,
		isLoading,
		error,
	} = useGetResponsesQuery(surveyId);

	const [exportResponses] = useExportResponsesMutation();

	const handleExport = async (settings: ExportSettings) => {
		try {
			setIsExporting(true);
			const title =
				aggregatedResponses?.survey_title
					?.replace(/[^\w\s-]/g, "")
					.trim()
					.replace(/\s+/g, "_") || "survey";

			await exportResponses({
				surveyId,
				format: settings.format,
				filename: `${title}_responses.${settings.format}`,
				rowLimit: settings.rowLimit,
				includeSummary: settings.includeSummary,
				includeResponses: settings.includeResponses,
				chartStyle: settings.chartStyle,
			}).unwrap();

			toast.success(
				settings.format === "csv"
					? "CSV downloaded"
					: "PDF downloaded",
			);
			setExportOpen(false);
		} catch (err) {
			const message =
				err &&
				typeof err === "object" &&
				"data" in err &&
				err.data &&
				typeof err.data === "object" &&
				"message" in err.data
					? String((err.data as { message: unknown }).message)
					: err &&
						  typeof err === "object" &&
						  "data" in err &&
						  err.data &&
						  typeof err.data === "object" &&
						  "error" in err.data
						? String((err.data as { error: unknown }).error)
						: `Failed to export ${settings.format.toUpperCase()}`;
			toast.error(message);
		} finally {
			setIsExporting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 sm:py-8 max-w-7xl px-4">
				<Skeleton className="h-64 w-full rounded-lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-8 max-w-7xl">
				<Card>
					<CardContent className="py-12 text-center text-red-500">
						Failed to load responses
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!aggregatedResponses) {
		return (
			<div className="container mx-auto py-8 max-w-7xl">
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No response data available
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 sm:py-8 max-w-7xl px-4">
			{/* ── Header card — same style as survey detail ── */}
			<div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
				{/* Top row — title + actions */}
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
							<MessageSquareText className="h-4 w-4" />
							Survey Responses
						</div>
						<h1 className="text-xl sm:text-3xl font-bold tracking-tight">
							{aggregatedResponses.survey_title}
						</h1>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						<Button
							variant="outline"
							className="gap-2"
							onClick={() => setExportOpen(true)}
							disabled={isExporting}
						>
							{isExporting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Download className="h-4 w-4" />
							)}
							Export
						</Button>

						<Link href={`/dashboard/surveys/${surveyId}`}>
							<Button variant="outline" className="gap-2">
								<ArrowUpRightIcon className="h-4 w-4" />
								Back to Survey
							</Button>
						</Link>
					</div>
				</div>

				{/* Stat cards */}
				<div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-sm">
					<div className="rounded-md border bg-muted/40 px-4 py-3">
						<p className="text-xs text-muted-foreground">
							Total Responses
						</p>
						<p className="text-2xl font-bold mt-0.5">
							{aggregatedResponses.total_responses}
						</p>
					</div>
					<div className="rounded-md border bg-muted/40 px-4 py-3">
						<p className="text-xs text-muted-foreground">
							Total Questions
						</p>
						<p className="text-2xl font-bold mt-0.5">
							{aggregatedResponses.questions.length}
						</p>
					</div>
				</div>

				{/* Chart toggle */}
				<div className="mt-6 flex items-center gap-2 flex-wrap">
					<Button
						variant={chartType === "bar" ? "default" : "outline"}
						onClick={() => setChartType("bar")}
						className="gap-2 h-8 text-xs px-2.5 sm:h-10 sm:text-sm sm:px-4"
					>
						<BarChart3 className="w-4 h-4" />
						Bar Chart
					</Button>
					<Button
						variant={chartType === "pie" ? "default" : "outline"}
						onClick={() => setChartType("pie")}
						className="gap-2 h-8 text-xs px-2.5 sm:h-10 sm:text-sm sm:px-4"
					>
						<PieChartIcon className="w-4 h-4" />
						Pie Chart
					</Button>
				</div>
			</div>

			{/* ── Charts grid ── */}
			{aggregatedResponses.questions.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No questions in this survey
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{aggregatedResponses.questions.map((question) => (
						<div key={question.id}>
							{chartType === "bar" ? (
								<ResponseBarChart question={question} />
							) : (
								<ResponsePieChart question={question} />
							)}
						</div>
					))}
				</div>
			)}

			{/* ── Data table ── */}
			{aggregatedResponses.questions.length > 0 && (
				<ResponseDetailsTable
					surveyId={surveyId}
					questions={aggregatedResponses.questions}
					initialQuestionId={aggregatedResponses.questions[0].id}
				/>
			)}

			<ExportSettingsDialog
				open={exportOpen}
				onOpenChange={setExportOpen}
				totalResponses={aggregatedResponses.total_responses}
				isExporting={isExporting}
				onConfirm={handleExport}
			/>
		</div>
	);
}
