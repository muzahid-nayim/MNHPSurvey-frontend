// src/app/dashboard/surveys/[id]/responses/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetResponsesQuery, useGetSurveyQuery } from "@/core/api/surveyApi";
import { ResponseBarChart } from "@/components/survey/ResponseBarChart";
import { ResponsePieChart } from "@/components/survey/ResponsePieChart";
import { ResponseDetailsTable } from "@/components/survey/ResponseDetailsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

export default function SurveyResponsesPage() {
	const params = useParams();
	const surveyId = params.id as string;
	const [chartType, setChartType] = useState<"bar" | "pie">("bar");

	// const { data: survey } = useGetSurveyQuery(surveyId);
	const {
		data: aggregatedResponses,
		isLoading,
		error,
	} = useGetResponsesQuery(surveyId);

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-8">
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
			<div className="container mx-auto py-8">
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No response data available
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 max-w-7xl">
			{/* Header */}
			<div className="mb-8">
				<div className="flex justify-between items-start mb-4">
					<div>
						<h1 className="text-3xl font-bold">Survey Responses</h1>
						<p className="text-muted-foreground">
							{aggregatedResponses.survey_title}
						</p>
					</div>
					<Link href={`/dashboard/surveys/${surveyId}`}>
						<Button variant="outline">Back to Survey</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<Card className="px-4 py-3 hover:ring ring-ring">
						<p className="text-sm text-muted-foreground">
							Total Responses
						</p>
						<p className="text-2xl font-bold">
							{aggregatedResponses.total_responses}
						</p>
					</Card>
					<Card className="px-4 py-3 hover:ring ring-ring">
						<p className="text-sm text-muted-foreground">
							Total Questions
						</p>
						<p className="text-2xl font-bold">
							{aggregatedResponses.questions.length}
						</p>
					</Card>
				</div>

				{/* Chart Type Toggle */}
				<div className="flex gap-2 mb-6">
					<Button
						variant={chartType === "bar" ? "default" : "outline"}
						onClick={() => setChartType("bar")}
						className="gap-2"
					>
						<BarChart3 className="w-4 h-4" />
						Bar Chart
					</Button>
					<Button
						variant={chartType === "pie" ? "default" : "outline"}
						onClick={() => setChartType("pie")}
						className="gap-2"
					>
						<PieChartIcon className="w-4 h-4" />
						Pie Chart
					</Button>
				</div>
			</div>

			{/* Charts Grid */}
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

			{/* Data Table Section */}
			{aggregatedResponses.questions.length > 0 && (
				<ResponseDetailsTable
					surveyId={surveyId}
					questions={aggregatedResponses.questions}
					initialQuestionId={aggregatedResponses.questions[0].id}
				/>
			)}
		</div>
	);
}
