// src/components/survey/QuestionsList.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Check, X, Radio, CheckSquare } from "lucide-react";
import type { QuestionType, Question, Survey } from "@/types";
import { QuestionForm } from "@/components/survey/QuestionForm";
import { toast } from "react-toastify";
import {
	useCreateQuestionMutation,
	useUpdateQuestionMutation,
	useDeleteQuestionMutation,
	useUpdateOptionMutation,
	useDeleteOptionMutation,
} from "@/core/api/surveyApi";

interface QuestionsListProps {
	survey: Survey;
	surveyId: string;
	onSurveyUpdate: () => void;
}

// Question Form State Interface
interface QuestionFormState {
	question_text: string;
	question_type: QuestionType;
	is_required: boolean;
	options: string[];
}

export function QuestionsList({
	survey,
	surveyId,
	onSurveyUpdate,
}: QuestionsListProps) {
	// API Mutations
	const [createQuestion, { isLoading: isCreatingQuestion }] =
		useCreateQuestionMutation();
	const [updateQuestion, { isLoading: isUpdatingQuestion }] =
		useUpdateQuestionMutation();
	const [deleteQuestion] = useDeleteQuestionMutation();
	const [updateOption] = useUpdateOptionMutation();
	const [deleteOption] = useDeleteOptionMutation();

	// State
	const [showAddQuestion, setShowAddQuestion] = useState(false);
	const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
		null
	);
	const [questionForm, setQuestionForm] = useState<QuestionFormState>({
		question_text: "",
		question_type: "single_choice",
		is_required: false,
		options: ["", ""],
	});

	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		type: "question" | "option";
		id?: string;
		questionId?: string;
	}>({ open: false, type: "question" });

	const isEditable =
		survey?.status === "draft" || survey?.status === "active";

	// Helper Functions
	const initQuestionEdit = (question: any) => {
		if (!question) return;
		setEditingQuestionId(question.id);
		setQuestionForm({
			question_text: question.question_text,
			question_type: question.question_type,
			is_required: question.is_required,
			options: question.options.map((opt: any) => opt.option_text),
		});
		setShowAddQuestion(true); // Show the form when editing
	};

	const cancelQuestionEdit = () => {
		setEditingQuestionId(null);
		setQuestionForm({
			question_text: "",
			question_type: "single_choice",
			is_required: false,
			options: ["", ""],
		});
		setShowAddQuestion(false);
	};

	const resetQuestionForm = () => {
		setQuestionForm({
			question_text: "",
			question_type: "single_choice",
			is_required: false,
			options: ["", ""],
		});
	};

	const updateQuestionForm = (updates: Partial<QuestionFormState>) => {
		setQuestionForm((prev) => ({ ...prev, ...updates }));
	};

	const addOptionToForm = () => {
		setQuestionForm((prev) => ({
			...prev,
			options: [...prev.options, ""],
		}));
	};

	const removeOptionFromForm = (index: number) => {
		setQuestionForm((prev) => ({
			...prev,
			options: prev.options.filter((_, i) => i !== index),
		}));
	};

	const updateOptionInForm = (index: number, value: string) => {
		setQuestionForm((prev) => {
			const newOptions = [...prev.options];
			newOptions[index] = value;
			return { ...prev, options: newOptions };
		});
	};

	// Event Handlers
	const handleEditQuestion = (questionId: string) => {
		const question = survey?.questions?.find((q) => q.id === questionId);
		initQuestionEdit(question);
		setTimeout(() => {
			document
				.getElementById("question-form")
				?.scrollIntoView({ behavior: "smooth" });
		}, 0);
	};

	const handleSubmitQuestion = async (e: React.FormEvent) => {
		e.preventDefault();

		const validOptions = questionForm.options.filter(
			(opt) => opt.trim() !== ""
		);
		if (validOptions.length < 2) {
			toast.info("Add at least 2 options");
			return;
		}

		try {
			if (editingQuestionId) {
				// Update existing question
				await updateQuestion({
					surveyId,
					questionId: editingQuestionId,
					data: {
						question_text: questionForm.question_text,
						question_type: questionForm.question_type,
						order: 0,
						is_required: questionForm.is_required,
						options: validOptions.map((text, index) => ({
							option_text: text,
							order: index,
						})),
					},
				}).unwrap();
				toast.success("Question updated successfully!");
			} else {
				// Create new question
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
				toast.success("Question created successfully!");
			}
			onSurveyUpdate(); // Refresh survey data
			cancelQuestionEdit();
		} catch (error) {
			toast.error(
				editingQuestionId
					? "Failed to update question"
					: "Failed to create question"
			);
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		try {
			await deleteQuestion({ surveyId, questionId }).unwrap();
			onSurveyUpdate(); // Refresh survey data
			toast.success("Question deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete question");
		}
	};

	const handleDeleteOption = async (questionId: string, optionId: string) => {
		try {
			await deleteOption({ surveyId, questionId, optionId }).unwrap();
			onSurveyUpdate(); // Refresh survey data
			toast.success("Option deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete option");
		}
	};

	const handleDeleteConfirm = () => {
		if (deleteDialog.type === "question" && deleteDialog.id) {
			handleDeleteQuestion(deleteDialog.id);
		} else if (
			deleteDialog.type === "option" &&
			deleteDialog.id &&
			deleteDialog.questionId
		) {
			handleDeleteOption(deleteDialog.questionId, deleteDialog.id);
		}
		setDeleteDialog({ open: false, type: "question" });
	};

	return (
		<>
			<div className="space-y-6">
				{/* Question list header  */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">Survey Questions</h2>
						<p className="text-gray-500 text-sm">
							{survey?.questions?.length || 0} question
							{survey?.questions?.length !== 1 ? "s" : ""}
						</p>
					</div>
				</div>

				{/* Empty State */}
				{(!survey?.questions || survey.questions.length === 0) && (
					<Card className="text-center py-8">
						<CardContent>
							<div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
								<Edit2 className="h-6 w-6 text-gray-400" />
							</div>
							<h3 className="font-medium mb-1">
								No questions yet
							</h3>
							<p className="text-gray-500 text-sm">
								Start by adding your first question
							</p>
						</CardContent>
					</Card>
				)}

				{/* Questions List */}
				<div className="space-y-4">
					{survey?.questions?.map(
						(question: Question, index: number) => (
							<Card key={question.id} className="overflow-hidden">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-bold text-sm text-gray-600">
													Q{index + 1}
												</span>
												<CardTitle className="text-base">
													{question.question_text}
												</CardTitle>
												{question.is_required && (
													<Badge
														variant="destructive"
														className="ml-2 text-xs"
													>
														Required
													</Badge>
												)}
											</div>

											<div className="flex items-center gap-2">
												<Badge
													variant="outline"
													className="text-xs"
												>
													{question.question_type ===
													"single_choice" ? (
														<Radio className="h-3 w-3 mr-1" />
													) : (
														<CheckSquare className="h-3 w-3 mr-1" />
													)}
													{question.question_type ===
													"single_choice"
														? "Single Choice"
														: "Multiple Choice"}
												</Badge>
											</div>
										</div>

										{isEditable && (
											<div className="flex items-center gap-1">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleEditQuestion(
															question.id
														)
													}
													className="h-8 px-3"
												>
													<Edit2 className="h-3.5 w-3.5 mr-1" />
													Edit
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() =>
														setDeleteDialog({
															open: true,
															type: "question",
															id: question.id,
														})
													}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										)}
									</div>
								</CardHeader>

								<CardContent>
									{question.options &&
										question.options.length > 0 && (
											<div className="space-y-2">
												<p className="text-sm font-medium text-gray-500 mb-2">
													Options
												</p>
												<div className="space-y-1.5">
													{question.options.map(
														(option) => (
															<div
																key={option.id}
																className={`flex items-center justify-between p-2 rounded transition-colors hover:bg-gray-100 dark:hover:bg-slate-700/50`}
															>
																<div className="flex items-center gap-3 flex-1">
																	<div className="shrink-0">
																		{question.question_type ===
																		"single_choice" ? (
																			<div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
																		) : (
																			<div className="w-4 h-4 rounded border-2 border-gray-400"></div>
																		)}
																	</div>
																	<span className="text-sm">
																		{
																			option.option_text
																		}
																	</span>
																</div>

																{isEditable && (
																	<Button
																		size="sm"
																		variant="ghost"
																		className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
																		onClick={() =>
																			setDeleteDialog(
																				{
																					open: true,
																					type: "option",
																					id: option.id,
																					questionId:
																						question.id,
																				}
																			)
																		}
																	>
																		<Trash2 className="h-3.5 w-3.5" />
																	</Button>
																)}
															</div>
														)
													)}
												</div>
											</div>
										)}
								</CardContent>
							</Card>
						)
					)}
				</div>

				{/* Add Question Button - Only show in draft status */}
				{survey?.status === "draft" &&
					!showAddQuestion &&
					!editingQuestionId && (
						<Button
							onClick={() => setShowAddQuestion(true)}
							className="w-full mb-6 bg-blue-600 hover:bg-blue-700 my-4"
						>
							+ Add Question
						</Button>
					)}

				{/* Question Form - Add or Edit */}
				{(showAddQuestion || editingQuestionId) && (
					<div id="question-form">
						<QuestionForm
							isEditing={!!editingQuestionId}
							questionText={questionForm.question_text}
							questionType={questionForm.question_type}
							isRequired={questionForm.is_required}
							options={questionForm.options}
							isLoading={isCreatingQuestion || isUpdatingQuestion}
							onQuestionTextChange={(text) =>
								updateQuestionForm({
									...questionForm,
									question_text: text,
								})
							}
							onQuestionTypeChange={(type) =>
								updateQuestionForm({
									...questionForm,
									question_type: type,
								})
							}
							onRequiredChange={(required) =>
								updateQuestionForm({
									...questionForm,
									is_required: required,
								})
							}
							onAddOption={addOptionToForm}
							onRemoveOption={removeOptionFromForm}
							onUpdateOption={updateOptionInForm}
							onSubmit={handleSubmitQuestion}
							onCancel={cancelQuestionEdit}
						/>
					</div>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(open) =>
					setDeleteDialog((prev) => ({ ...prev, open }))
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete{" "}
							{deleteDialog.type === "question"
								? "Question"
								: "Option"}
							?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{deleteDialog.type === "question"
								? "This question and all its options will be permanently deleted."
								: "This option will be permanently deleted."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
