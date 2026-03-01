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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	HelpCircle,
	Users,
	Calendar,
	Share2,
	Copy,
	Trash2,
	MessageSquare,
	Plus,
} from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import QrCodeGenerator from "@/components/survey/QRCodeGenerator";

export default function SurveysPage() {
	const { data: surveys, isLoading, error } = useGetSurveysQuery();
	const [deleteSurvey] = useDeleteSurveyMutation();
	const { copyToClipboard } = useClipboard();
	// const url = window.location.origin;
	// console.log(url);
	const handleDelete = async (id: string) => {
		try {
			await deleteSurvey(id).unwrap();
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
					<Button>
						<Plus />
						Create Survey
					</Button>
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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{surveys?.map((survey) => {
						const publicUrl = `${window.location.origin}/survey/${survey.id}`;

						return (
							<Card
								key={survey.id}
								className="group relative flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg hover:ring ring-ring"
								onClick={() =>
									(window.location.href = `/dashboard/surveys/${survey.id}`)
								}
							>
								{/* Status Badge */}
								<div className="absolute right-3 top-3 z-10">
									<span
										className={`
              inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
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

								<CardHeader className="pb-2">
									<CardTitle className="truncate pr-16 text-lg group-hover:text-primary">
										{survey.title}
									</CardTitle>
									<CardDescription className="line-clamp-2">
										{survey.description || "No description"}
									</CardDescription>
								</CardHeader>

								<CardContent className="flex flex-1 flex-col pb-4">
									{/* Stats */}
									<div className="mb-3 grid grid-cols-2 gap-2">
										<div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
											<HelpCircle className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">
													Questions
												</p>
												<p className="text-lg font-semibold">
													{survey.question_count}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">
													Responses
												</p>
												<p className="text-lg font-semibold">
													{survey.response_count}
												</p>
											</div>
										</div>
									</div>

									{/* Created Date */}
									<div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
										<Calendar className="h-3.5 w-3.5" />
										<span>
											Created{" "}
											{new Date(
												survey.created_at,
											).toLocaleDateString()}
										</span>
									</div>

									{/* Action Buttons - Responsive Button Group */}
									<div
										className="mt-auto flex flex-nowrap items-center"
										onClick={(e) => e.stopPropagation()}
									>
										{/* Responses Button */}
										<Link
											href={`/dashboard/surveys/${survey.id}/responses`}
											className="flex-1 min-w-0" // 🔑 Critical for truncation
										>
											<Button
												variant="outline"
												size="sm"
												className="w-full gap-1 px-2 py-0 h-8 sm:h-9 rounded-r-none"
												onClick={(e) =>
													e.stopPropagation()
												}
											>
												<MessageSquare className="h-3.5 w-3.5 shrink-0" />
												<span className="truncate min-w-0 text-[11px] sm:text-xs">
													Responses
												</span>
											</Button>
										</Link>

										{/* Share Button (only for active surveys) */}
										{survey.status === "active" && (
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className="flex-1 min-w-0 gap-1 px-2 py-0 h-8 sm:h-9 rounded-none"
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<Share2 className="h-3.5 w-3.5 shrink-0" />
														<span className="truncate min-w-0 text-[11px] sm:text-xs">
															Share
														</span>
													</Button>
												</DialogTrigger>
												<DialogContent
													className="sm:max-w-md"
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<DialogHeader>
														<DialogTitle>
															Share Survey
														</DialogTitle>
														<DialogDescription>
															Share this survey
															with respondents
														</DialogDescription>
													</DialogHeader>
													<div className="flex flex-col items-center gap-4 py-2">
														<Button
															onClick={() => {
																copyToClipboard(
																	publicUrl,
																	"Survey link copied!",
																);
															}}
															variant="outline"
															className="w-full justify-start gap-2"
														>
															<Copy className="h-4 w-4" />
															Copy Survey Link
														</Button>
														<div className="rounded-lg border bg-muted/20 p-4">
															<QrCodeGenerator
																text={publicUrl}
																showDownload
															/>
														</div>
													</div>
												</DialogContent>
											</Dialog>
										)}

										{/* Delete Button */}
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="destructive"
													size="sm"
													className="flex-1 min-w-0 gap-1 px-2 py-0 h-8 sm:h-9 rounded-l-none"
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<Trash2 className="h-3.5 w-3.5 shrink-0" />
													<span className="truncate min-w-0 text-[11px] sm:text-xs">
														Delete
													</span>
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
														permanently delete
														&quot;
														{survey.title}&quot; and
														all responses.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive"
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(
																survey.id,
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
