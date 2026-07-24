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
				settings.format === "csv" ? "CSV downloaded" : "PDF downloaded",
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
			<div className="w-full min-w-0">
				<Skeleton className="h-48 w-full rounded-lg sm:h-64" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full min-w-0">
				<Card>
					<CardContent className="py-10 text-center text-red-500">
						Failed to load responses
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!aggregatedResponses) {
		return (
			<div className="w-full min-w-0">
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						No response data available
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden sm:space-y-6">
			{/* header */}
			<div className="rounded-lg border bg-card p-3 shadow-sm sm:p-5 lg:p-6">
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="min-w-0 flex-1">
							<div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
								<MessageSquareText className="h-3.5 w-3.5 shrink-0" />
								Survey Responses
							</div>
							<h1 className="text-base font-bold tracking-tight wrap-break-word sm:text-2xl lg:text-3xl">
								{aggregatedResponses.survey_title}
							</h1>
						</div>

						<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
							<Button
								variant="outline"
								size="sm"
								className="w-full gap-1.5 sm:w-auto sm:h-10 sm:px-4"
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

							<Link
								href={`/dashboard/surveys/${surveyId}`}
								className="w-full sm:w-auto"
							>
								<Button
									variant="outline"
									size="sm"
									className="w-full gap-1.5 sm:h-10 sm:px-4"
								>
									<ArrowUpRightIcon className="h-4 w-4" />
									<span className="sm:hidden">Back</span>
									<span className="hidden sm:inline">
										Back to Survey
									</span>
								</Button>
							</Link>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 sm:max-w-xs sm:gap-3">
						<div className="rounded-md border bg-muted/40 px-3 py-2">
							<p className="text-[11px] text-muted-foreground">
								Responses
							</p>
							<p className="text-xl font-bold sm:text-2xl">
								{aggregatedResponses.total_responses}
							</p>
						</div>
						<div className="rounded-md border bg-muted/40 px-3 py-2">
							<p className="text-[11px] text-muted-foreground">
								Questions
							</p>
							<p className="text-xl font-bold sm:text-2xl">
								{aggregatedResponses.questions.length}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
						<Button
							variant={chartType === "bar" ? "default" : "outline"}
							size="sm"
							onClick={() => setChartType("bar")}
							className="gap-1.5 sm:h-10 sm:px-4"
						>
							<BarChart3 className="h-4 w-4" />
							Bar
						</Button>
						<Button
							variant={chartType === "pie" ? "default" : "outline"}
							size="sm"
							onClick={() => setChartType("pie")}
							className="gap-1.5 sm:h-10 sm:px-4"
						>
							<PieChartIcon className="h-4 w-4" />
							Pie
						</Button>
					</div>
				</div>
			</div>

			{/* charts */}
			{aggregatedResponses.questions.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						No questions in this survey
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
					{aggregatedResponses.questions.map((question) => (
						<div key={question.id} className="min-w-0 max-w-full">
							{chartType === "bar" ? (
								<ResponseBarChart question={question} />
							) : (
								<ResponsePieChart question={question} />
							)}
						</div>
					))}
				</div>
			)}

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
