"use client";

import { useState } from "react";
import { useGetResponsesByQuestionQuery } from "@/core/api/surveyApi";
import { ResponseDataTable } from "@/components/survey/ResponseDataTable";
import { responseColumns } from "@/components/survey/ResponseTableColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { AggregatedQuestion } from "@/types";

interface ResponseDetailsTableProps {
	surveyId: string;
	questions: AggregatedQuestion[];
	initialQuestionId?: string;
}

export function ResponseDetailsTable({
	surveyId,
	questions,
	initialQuestionId,
}: ResponseDetailsTableProps) {
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
		initialQuestionId || (questions.length > 0 ? questions[0].id : null),
	);

	// Fetch responses for the selected question
	const {
		data: questionResponses,
		isLoading: isLoadingTable,
		error: tableError,
	} = useGetResponsesByQuestionQuery(
		{ surveyId, questionId: selectedQuestion || "" },
		{ skip: !selectedQuestion }, // Skip query if no question selected
	);

	return (
		<div className="mt-12">
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Response Details</h2>
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
					<div className="flex-1 min-w-0">
						<label className="block text-sm font-medium mb-2">
							Select a Question
						</label>
						<Select
							value={selectedQuestion || ""}
							onValueChange={(value) =>
								setSelectedQuestion(value || null)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a question to view responses" />
							</SelectTrigger>
							<SelectContent>
								{questions.map((q) => (
									<SelectItem key={q.id} value={q.id}>
										{q.question_text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Table Loading State */}
			{selectedQuestion && isLoadingTable && (
				<div className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			)}

			{/* Table Error State */}
			{selectedQuestion && tableError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						Failed to load response details. Please try again.
					</AlertDescription>
				</Alert>
			)}

			{/* Table Content */}
			{selectedQuestion && questionResponses && !isLoadingTable && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							{questionResponses.question_text}
						</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							Total Responses: {questionResponses.total_responses}
						</p>
					</CardHeader>
					<CardContent>
						<ResponseDataTable
							columns={responseColumns}
							data={questionResponses.responses}
						/>
					</CardContent>
				</Card>
			)}

			{/* Empty State */}
			{!selectedQuestion && (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">
							No questions available to view responses
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
