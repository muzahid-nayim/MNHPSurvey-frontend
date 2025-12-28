"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	useGetTakeSurveyQuery,
	useSubmitSurveyMutation,
} from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

import {
	SurveyErrorCard,
	SurveyNotFoundCard,
	SurveySubmittedCard,
} from "@/components/survey/SurveyStatusCard";
export default function TakeSurveyPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const surveyId = params.id as string;
	const token = searchParams.get("token") || undefined;

	const router = useRouter();
	const pathname = usePathname();
	const {
		data: survey,
		isLoading,
		error,
		refetch,
	} = useGetTakeSurveyQuery({ surveyId, token });

	const [submitSurvey, { isLoading: isSubmitting }] =
		useSubmitSurveyMutation();

	const [answers, setAnswers] = useState<Record<string, string[]>>({});
	const [currentPage, setCurrentPage] = useState(0);
	const [submitted, setSubmitted] = useState(false);

	// Initialize answers state when survey loads
	useEffect(() => {
		if (survey?.questions) {
			const initialAnswers: Record<string, string[]> = {};
			survey.questions.forEach((q) => {
				initialAnswers[q.id] = [];
			});
			setAnswers(initialAnswers);
		}
	}, [survey]);

	const handleOptionChange = (
		questionId: string,
		optionId: string,
		isMultiple: boolean
	) => {
		console.log(answers);
		if (isMultiple) {
			// Multiple choice - toggle option
			setAnswers((prev) => {
				const current = prev[questionId] || [];//keeping current selected options
				if (current.includes(optionId)) {
					return {
						...prev,
						[questionId]: current.filter((id) => id !== optionId),
					};
				} else {
					return { ...prev, [questionId]: [...current, optionId] };
				}
			});
		} else {
			// Single choice - replace
			setAnswers((prev) => ({ ...prev, [questionId]: [optionId] }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required questions
		const requiredQuestions =
			survey?.questions?.filter((q) => q.is_required) || [];
		const missingAnswers = requiredQuestions.filter(
			(q) => !answers[q.id] || answers[q.id].length === 0
		);

		if (missingAnswers.length > 0) {
			// alert("Please answer all required questions");
			toast.error("Please answer all required questions");
			return;
		}

		// Format answers for API
		const formattedAnswers = Object.entries(answers)
			.filter(([_, selectedOptions]) => selectedOptions.length > 0)
			.map(([questionId, selectedOptions]) => ({
				question_id: questionId,
				selected_options: selectedOptions,
			}));

		try {
			await submitSurvey({
				surveyId,
				data: { answers: formattedAnswers },
				token,
			}).unwrap();
			setSubmitted(true);
		} catch (error: any) {
			// alert(error?.data?.error || "Failed to submit survey");
			toast.error(error?.data?.error || "Failed to submit survey");
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8 max-w-3xl">
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<SurveyErrorCard
				error={error}
				title="Oops! Failed to Load"
				
			/>
		);
	}

	if (!survey) {
		return (
			<SurveyNotFoundCard
				message="This survey has been deleted by the creator"
			/>
		);
	}

	if (submitted) {
		return (
			<SurveySubmittedCard
				message="Thank you for your valuable feedback!"
				onCopyLink={() => {
					navigator.clipboard.writeText(pathname);
					toast.success("Link copied to clipboard!");
				}}
			/>
		);
	}
	// Calculate questions to show based on display mode
	const getQuestionsToShow = () => {
		if (!survey.questions) return [];

		if (survey.display_mode === "show_all") {
			return survey.questions;
		} else if (survey.display_mode === "one_by_one") {
			return survey.questions.slice(currentPage, currentPage + 1);
		} else if (survey.display_mode === "paginated") {
			const start = currentPage * survey.questions_per_page;
			const end = start + survey.questions_per_page;
			return survey.questions.slice(start, end);
		}
		return survey.questions;
	};

	const questionsToShow = getQuestionsToShow();
	const totalPages =
		survey.display_mode === "show_all"
			? 1
			: survey.display_mode === "one_by_one"
			? survey.questions?.length || 1
			: Math.ceil(
					(survey.questions?.length || 0) / survey.questions_per_page
			  );
	const isLastPage = currentPage === totalPages - 1;

	return (
		<div className="container mx-auto py-8 max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>{survey.title}</CardTitle>
					<CardDescription>{survey.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Progress Bar */}
						{survey.show_progress_bar &&
							survey.display_mode !== "show_all" && (
								<div className="mb-6">
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full transition-all"
											style={{
												width: `${
													((currentPage + 1) /
														totalPages) *
													100
												}%`,
											}}
										/>
									</div>
									<p className="text-sm text-muted-foreground mt-2 text-center">
										{survey.display_mode === "one_by_one"
											? `Question ${
													currentPage + 1
											  } of ${totalPages}`
											: `Page ${
													currentPage + 1
											  } of ${totalPages}`}
									</p>
								</div>
							)}

						{/* Questions */}
						{questionsToShow.map((question, index) => (
							<div
								key={question.id}
								className="space-y-3 pb-6 border-b last:border-b-0"
							>
								<Label className="text-base font-semibold">
									{survey.display_mode === "show_all"
										? `${index + 1}. `
										: ""}
									{question.question_text}
									{question.is_required && (
										<span className="text-red-500 ml-1">
											*
										</span>
									)}
								</Label>
								<p className="text-sm text-muted-foreground">
									{question.question_type === "single_choice"
										? "Select one"
										: "Select all that apply"}
								</p>
								<div className="space-y-2">
									{question.options.map((option) => (
										<div
											key={option.id}
											className="flex items-center gap-3"
										>
											<input
												type={
													question.question_type ===
													"single_choice"
														? "radio"
														: "checkbox"
												}
												id={`${question.id}-${option.id}`}
												name={question.id}
												checked={
													answers[
														question.id
													]?.includes(option.id) ||
													false
												}
												onChange={() =>
													handleOptionChange(
														question.id,
														option.id,
														question.question_type ===
															"multiple_choice"
													)
												}
												className="w-4 h-4"
											/>
											<label
												htmlFor={`${question.id}-${option.id}`}
												className="flex-1 cursor-pointer"
											>
												{option.option_text}
											</label>
										</div>
									))}
								</div>
							</div>
						))}

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-4">
							{survey.display_mode !== "show_all" &&
								currentPage > 0 && (
									<Button
										type="button"
										variant="outline"
										onClick={(e) =>
										{
											e.preventDefault() ;
											setCurrentPage((prev) => prev - 1)
										}
										}
									>
										Previous
									</Button>
								)}

							{survey.display_mode !== "show_all" &&
							!isLastPage ? (
								<Button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage((prev) => prev + 1)
									}}
									className="ml-auto"
								>
									Next
								</Button>
							) : (
								<Button
									type="submit"
									disabled={isSubmitting}
									className="ml-auto"
								>
									{isSubmitting
										? "Submitting..."
										: "Submit Survey"}
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
