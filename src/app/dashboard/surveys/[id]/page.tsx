// src/app/dashboard/surveys/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	useGetSurveyQuery,
	useUpdateSurveyStatusMutation,
	useCreateQuestionMutation,
	useDeleteQuestionMutation,
} from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuestionType } from "@/types";

export default function EditSurveyPage() {
	const params = useParams();
	const router = useRouter();
	const surveyId = params.id as string;

	const { data: survey, isLoading } = useGetSurveyQuery(surveyId);
	const [updateStatus] = useUpdateSurveyStatusMutation();
	const [createQuestion, { isLoading: isCreatingQuestion }] =
		useCreateQuestionMutation();
	const [deleteQuestion] = useDeleteQuestionMutation();

	const [showAddQuestion, setShowAddQuestion] = useState(false);
	const [questionForm, setQuestionForm] = useState({
		question_text: "",
		question_type: "single_choice" as QuestionType,
		is_required: false,
		options: ["", ""],
	});

	const handlePublish = async () => {
		if (!survey?.questions || survey.questions.length === 0) {
			alert("Add at least one question before publishing");
			return;
		}

		try {
			await updateStatus({ id: surveyId, status: "active" }).unwrap();
			alert("Survey published!");
		} catch (error) {
			alert("Failed to publish survey");
		}
	};

	const handleAddOption = () => {
		setQuestionForm({
			...questionForm,
			options: [...questionForm.options, ""],
		});
	};

	const handleRemoveOption = (index: number) => {
		const newOptions = questionForm.options.filter((_, i) => i !== index);
		setQuestionForm({ ...questionForm, options: newOptions });
	};

	const handleUpdateOption = (index: number, value: string) => {
		const newOptions = [...questionForm.options];
		newOptions[index] = value;
		setQuestionForm({ ...questionForm, options: newOptions });
	};

	const handleSubmitQuestion = async (e: React.FormEvent) => {
		e.preventDefault();

		const validOptions = questionForm.options.filter(
			(opt) => opt.trim() !== ""
		);
		if (validOptions.length < 2) {
			alert("Add at least 2 options");
			return;
		}

		try {
			await createQuestion({
				surveyId,
				data: {
					question_text: questionForm.question_text,
					question_type: questionForm.question_type,
					order: survey?.questions?.length || 0,
					is_required: questionForm.is_required,
					options: validOptions.map((text, index) => ({
						option_text: text,
						order: index,
					})),
				},
			}).unwrap();

			setQuestionForm({
				question_text: "",
				question_type: "single_choice",
				is_required: false,
				options: ["", ""],
			});
			setShowAddQuestion(false);
		} catch (error) {
			alert("Failed to create question");
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		if (!confirm("Delete this question?")) return;

		try {
			await deleteQuestion({ surveyId, questionId }).unwrap();
		} catch (error) {
			alert("Failed to delete question");
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (!survey) {
		return <div className="container mx-auto py-8">Survey not found</div>;
	}

	return (
		<div className="container mx-auto py-8 max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<div className="flex justify-between items-start mb-4">
					<div>
						<h1 className="text-3xl font-bold">{survey.title}</h1>
						<p className="text-muted-foreground">
							{survey.description}
						</p>
					</div>
					<span
						className={`px-3 py-1 rounded text-sm ${
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
				<div className="flex gap-2">
					{survey.status === "draft" && (
						<Button onClick={handlePublish}>Publish Survey</Button>
					)}
					{survey.status === "active" && (
						<>
							<Button
								onClick={() => {
									const url = `${window.location.origin}/survey/${survey.id}`;
									navigator.clipboard.writeText(url);
									alert("Survey link copied to clipboard!");
								}}
							>
								Copy Survey Link
							</Button>
							<Button
								variant="outline"
								onClick={async () => {
									await updateStatus({
										id: surveyId,
										status: "closed",
									}).unwrap();
								}}
							>
								Close Survey
							</Button>
						</>
					)}
					<Button
						variant="outline"
						onClick={() => router.push("/dashboard/surveys")}
					>
						Back to Surveys
					</Button>
				</div>
			</div>

			{/* Questions List */}
			<div className="space-y-4 mb-6">
				<h2 className="text-xl font-semibold">
					Questions ({survey.questions?.length || 0})
				</h2>

				{survey.questions && survey.questions.length === 0 && (
					<Card>
						<CardContent className="py-8 text-center text-muted-foreground">
							No questions yet. Add your first question below.
						</CardContent>
					</Card>
				)}

				{survey.questions?.map((question, index) => (
					<Card key={question.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<CardTitle className="text-lg">
										Q{index + 1}. {question.question_text}
										{question.is_required && (
											<span className="text-red-500 ml-1">
												*
											</span>
										)}
									</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										Type:{" "}
										{question.question_type ===
										"single_choice"
											? "Single Choice"
											: "Multiple Choice"}
									</p>
								</div>
								<Button
									variant="destructive"
									size="sm"
									onClick={() =>
										handleDeleteQuestion(question.id)
									}
								>
									Delete
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-1">
								{question.options.map((option) => (
									<div
										key={option.id}
										className="flex items-center gap-2 text-sm"
									>
										{question.question_type ===
										"single_choice" ? (
											<span className="w-4 h-4 rounded-full border-2 border-gray-400"></span>
										) : (
											<span className="w-4 h-4 rounded border-2 border-gray-400"></span>
										)}
										<span>{option.option_text}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add Question Button */}
			{!showAddQuestion && survey.status === "draft" && (
				<Button
					onClick={() => setShowAddQuestion(true)}
					className="w-full"
				>
					+ Add Question
				</Button>
			)}

			{/* Add Question Form */}
			{showAddQuestion && (
				<Card>
					<CardHeader>
						<CardTitle>Add New Question</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmitQuestion}
							className="space-y-4"
						>
							{/* Question Text */}
							<div className="space-y-2">
								<Label htmlFor="question_text">
									Question *
								</Label>
								<Input
									id="question_text"
									value={questionForm.question_text}
									onChange={(e) =>
										setQuestionForm({
											...questionForm,
											question_text: e.target.value,
										})
									}
									placeholder="What is your question?"
									required
								/>
							</div>

							{/* Question Type */}
							<div className="space-y-2">
								<Label htmlFor="question_type">
									Question Type *
								</Label>
								<select
									id="question_type"
									value={questionForm.question_type}
									onChange={(e) =>
										setQuestionForm({
											...questionForm,
											question_type: e.target
												.value as QuestionType,
										})
									}
									className="w-full px-3 py-2 border rounded-md"
								>
									<option value="single_choice">
										Single Choice (Pick one)
									</option>
									<option value="multiple_choice">
										Multiple Choice (Pick many)
									</option>
								</select>
							</div>

							{/* Required Checkbox */}
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="is_required"
									checked={questionForm.is_required}
									onChange={(e) =>
										setQuestionForm({
											...questionForm,
											is_required: e.target.checked,
										})
									}
								/>
								<Label htmlFor="is_required">
									Required question
								</Label>
							</div>

							{/* Options */}
							<div className="space-y-2">
								<Label>Options (Add at least 2) *</Label>
								{questionForm.options.map((option, index) => (
									<div key={index} className="flex gap-2">
										<Input
											value={option}
											onChange={(e) =>
												handleUpdateOption(
													index,
													e.target.value
												)
											}
											placeholder={`Option ${index + 1}`}
										/>
										{questionForm.options.length > 2 && (
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													handleRemoveOption(index)
												}
											>
												Remove
											</Button>
										)}
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={handleAddOption}
									className="w-full"
								>
									+ Add Option
								</Button>
							</div>

							{/* Buttons */}
							<div className="flex gap-2">
								<Button
									type="submit"
									disabled={isCreatingQuestion}
								>
									{isCreatingQuestion
										? "Adding..."
										: "Add Question"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowAddQuestion(false);
										setQuestionForm({
											question_text: "",
											question_type: "single_choice",
											is_required: false,
											options: ["", ""],
										});
									}}
								>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
