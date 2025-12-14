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
import { toast } from "react-toastify";

import { LinkIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";

export default function SurveysPage() {
	const { data: surveys, isLoading, error } = useGetSurveysQuery();
	const [deleteSurvey] = useDeleteSurveyMutation();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const { copyToClipboard } = useClipboard();
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
				<Card className="max-w-md mx-auto">
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{surveys?.map((survey) => {
						const publicUrl = `${window.location.origin}/survey/${survey.id}`;

						return (
							<Card
								key={survey.id}
								className="overflow-hidden group
								 hover:shadow-md transition-shadow cursor-pointer relative"
								onClick={() =>
									(window.location.href = `/dashboard/surveys/${survey.id}`)
								}
							>
								{/* Status badge */}
								<div className="absolute top-3 right-3 z-10">
									<span
										className={`
													  px-2 py-1 rounded-full text-xs font-medium
													  ${
															survey.status === "active"
																? "bg-green-100 text-green-800"
																: survey.status === "draft"
																? "bg-gray-100 text-gray-800"
																: "bg-red-100 text-red-800"
														}
													`}
									>
										{survey.status}
									</span>
								</div>

								<CardHeader className="pb-3">
									<div>
										<CardTitle className="truncate group-hover:text-primary">
											{survey.title}
										</CardTitle>
										<CardDescription className="truncate">
											{survey.description ||
												"No description"}
										</CardDescription>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									{/* Stats */}
									<div className="grid grid-cols-2 gap-4 mb-4 text-sm">
										<div className="space-y-1">
											<p className="font-medium">
												Questions
											</p>
											<p className="text-2xl font-bold">
												{survey.question_count}
											</p>
										</div>
										<div className="space-y-1">
											<p className="font-medium">
												Responses
											</p>
											<p className="text-2xl font-bold">
												{survey.response_count}
											</p>
										</div>
									</div>

									<p className="text-sm text-muted-foreground mb-4">
										Created:{" "}
										{new Date(
											survey.created_at
										).toLocaleDateString()}
									</p>

									{/* 3 Action Buttons */}
									<div
										className="flex gap-2"
										onClick={(e) => e.stopPropagation()}
									>
										{/* Responses Button */}
										<Link
											href={`/dashboard/surveys/${survey.id}/responses`}
											className="flex-1"
										>
											<Button
												variant="outline"
												size="sm"
												className="w-full h-8 text-xs"
												onClick={(e) =>
													e.stopPropagation()
												}
											>
												Responses
											</Button>
										</Link>

										{/* Copy Link Button (only for active surveys) */}
										{survey.status === "active" && (
											<Button
												variant="outline"
												size="sm"
												className="h-8 px-3 text-xs flex-1"
												onClick={(e) => {
													e.stopPropagation();
													copyToClipboard(publicUrl, "Survey link copied to clipboard!");
												}}
											>
												Copy Link
											</Button>
										)}

										{/* Delete Button */}
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="destructive"
													size="sm"
													className="h-8 px-3 text-xs flex-1"
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													Delete
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent
												onClick={(e) =>
													e.stopPropagation()
												}
											>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Delete Survey
													</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure? This will
														permanently delete "
														{survey.title}" and all
														responses.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(
																survey.id
															);
														}}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
