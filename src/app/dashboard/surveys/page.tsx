// src/app/dashboard/surveys/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
	useGetSurveysQuery,
	useDeleteSurveyMutation,
} from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SurveysPage() {
	const { data: surveys, isLoading, error } = useGetSurveysQuery();
	const [deleteSurvey] = useDeleteSurveyMutation();
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		try {
			await deleteSurvey(id).unwrap();
			setDeleteId(null);
		} catch (error) {
			console.error("Failed to delete survey:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="space-y-4">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-red-500">Error loading surveys</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold">My Surveys</h1>
					<p className="text-muted-foreground">
						Create and manage your surveys
					</p>
				</div>
				<Link href="/dashboard/surveys/create">
					<Button>Create Survey</Button>
				</Link>
			</div>

			{/* Survey List */}
			{surveys && surveys.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground mb-4">
							No surveys yet
						</p>
						<Link href="/dashboard/surveys/create">
							<Button>Create Your First Survey</Button>
						</Link>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{surveys?.map((survey) => (
						<Card key={survey.id}>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{survey.title}</CardTitle>
										<CardDescription>
											{survey.description ||
												"No description"}
										</CardDescription>
									</div>
									<span
										className={`px-2 py-1 rounded text-xs ${
											survey.status === "active"
												? "bg-green-100 text-green-800"
												: survey.status === "draft"
												? "bg-gray-100 text-gray-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{survey.status}
									</span>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between items-center">
									<div className="space-y-1 text-sm">
										<p>
											Questions: {survey.question_count}
										</p>
										<p>
											Responses: {survey.response_count}
										</p>
										<p className="text-muted-foreground">
											Created:{" "}
											{new Date(
												survey.created_at
											).toLocaleDateString()}
										</p>
									</div>
									<div className="flex gap-2">
										<Link
											href={`/dashboard/surveys/${survey.id}`}
										>
											<Button variant="outline">
												Edit
											</Button>
										</Link>
										<Link
											href={`/dashboard/surveys/${survey.id}/responses`}
										>
											<Button variant="outline">
												Responses
											</Button>
										</Link>
										{survey.status === "active" && (
											<Button
												variant="outline"
												onClick={() => {
													const url = `${window.location.origin}/survey/${survey.id}`;
													navigator.clipboard.writeText(
														url
													);
													alert(
														"Survey link copied!"
													);
												}}
											>
												Copy Link
											</Button>
										)}
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="destructive">
													Delete
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Delete Survey
													</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure? This will
														permanently delete the
														survey and all
														responses.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleDelete(
																survey.id
															)
														}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
