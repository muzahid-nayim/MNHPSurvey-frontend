"use client";

import { useEffect, useState } from "react";
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

	// on small screens hide less important columns so the table fits better
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 640px)");
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const {
		data: questionResponses,
		isLoading: isLoadingTable,
		error: tableError,
	} = useGetResponsesByQuestionQuery(
		{ surveyId, questionId: selectedQuestion || "" },
		{ skip: !selectedQuestion },
	);

	return (
		<div className="mt-4 min-w-0 max-w-full sm:mt-6 lg:mt-8">
			<div className="mb-3 sm:mb-4">
				<h2 className="mb-2 text-lg font-bold sm:mb-3 sm:text-2xl">
					Response Details
				</h2>
				<div className="min-w-0 w-full max-w-xl">
					<label className="mb-1.5 block text-sm font-medium">
						Select a Question
					</label>
					<Select
						value={selectedQuestion || ""}
						onValueChange={(value) =>
							setSelectedQuestion(value || null)
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Choose a question" />
						</SelectTrigger>
						<SelectContent>
							{questions.map((q) => (
								<SelectItem key={q.id} value={q.id}>
									<span className="line-clamp-1">
										{q.question_text}
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{selectedQuestion && isLoadingTable && (
				<div className="space-y-3">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-48 w-full" />
				</div>
			)}

			{selectedQuestion && tableError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						Failed to load response details. Please try again.
					</AlertDescription>
				</Alert>
			)}

			{selectedQuestion && questionResponses && !isLoadingTable && (
				<Card className="min-w-0 max-w-full overflow-hidden">
					<CardHeader className="space-y-1 p-3 sm:p-6">
						<CardTitle className="line-clamp-2 text-base sm:text-lg">
							{questionResponses.question_text}
						</CardTitle>
						<p className="text-xs text-muted-foreground sm:text-sm">
							Total Responses: {questionResponses.total_responses}
						</p>
					</CardHeader>
					<CardContent className="min-w-0 p-3 pt-0 sm:p-6 sm:pt-0">
						<ResponseDataTable
							columns={responseColumns}
							data={questionResponses.responses}
							compactMobile={isMobile}
						/>
					</CardContent>
				</Card>
			)}

			{!selectedQuestion && (
				<Card>
					<CardContent className="py-10 text-center">
						<p className="text-muted-foreground">
							No questions available to view responses
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
