// src/app/dashboard/surveys/[id]/responses/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetResponsesQuery, useGetSurveyQuery } from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SurveyResponsesPage() {
	const params = useParams();
	const surveyId = params.id as string;

	const { data: survey } = useGetSurveyQuery(surveyId);
	const {
		data: responses,
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

	return (
		<div className="container mx-auto py-8 max-w-6xl">
			{/* Header */}
			<div className="mb-8">
				<div className="flex justify-between items-start mb-4">
					<div>
						<h1 className="text-3xl font-bold">Survey Responses</h1>
						<p className="text-muted-foreground">{survey?.title}</p>
					</div>
					<Link href={`/dashboard/surveys/${surveyId}`}>
						<Button variant="outline">Back to Survey</Button>
					</Link>
				</div>
				<div className="flex gap-4 text-sm">
					<div className="px-4 py-2 bg-blue-100 rounded">
						Total Responses: {responses?.length || 0}
					</div>
				</div>
			</div>

			{/* Responses List */}
			{!responses || responses.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No responses yet
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{responses.map((response, index) => (
						<Card key={response.id}>
							<CardHeader>
								<CardTitle className="text-lg">
									Response #{index + 1}
									{response.respondent_email !==
										"Anonymous" && (
										<span className="ml-2 text-sm font-normal text-muted-foreground">
											by {response.respondent_email}
										</span>
									)}
								</CardTitle>
								<p className="text-sm text-muted-foreground">
									Submitted:{" "}
									{new Date(
										response.completed_at
									).toLocaleString()}
								</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{response.answers.map((answer) => (
										<div
											key={answer.id}
											className="border-b pb-4 last:border-b-0"
										>
											<p className="font-semibold mb-2">
												{answer.question_text}
											</p>
											<div className="space-y-1">
												{answer.selections.map(
													(selection) => (
														<p
															key={selection.id}
															className="text-sm pl-4"
														>
															•{" "}
															{
																selection.option_text
															}
														</p>
													)
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
