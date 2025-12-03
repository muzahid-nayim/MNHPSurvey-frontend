// src/app/dashboard/surveys/[id]/page.tsx
"use client";

// ============START IMPORTS============
import { useParams } from "next/navigation";
import { useState } from "react";
import {
	useGetSurveyQuery,
	useUpdateSurveyStatusMutation,
	useCreateQuestionMutation,
	useDeleteQuestionMutation,
	useUpdateSurveyMutation,
	useUpdateQuestionMutation,
	useUpdateOptionMutation,
	useDeleteOptionMutation,
} from "@/core/api/surveyApi";
import type { QuestionType, Survey } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyEditForm } from "@/components/survey/SurveyEditForm";
import { QuestionsList } from "@/components/survey/QuestionsList";
import { QuestionForm } from "@/components/survey/QuestionForm";
// ============END IMPORTS============

// Question Form State Interface
interface QuestionFormState {
	question_text: string;
	question_type: QuestionType;
	is_required: boolean;
	options: string[];
}

export default function EditSurveyPage() {
	// ============START HOOKS & STATE============
	const params = useParams();
	const surveyId = params.id as string;

	// API Queries and Mutations
	const { data: survey, isLoading } = useGetSurveyQuery(surveyId);
	const [updateStatus] = useUpdateSurveyStatusMutation();
	const [updateSurvey, { isLoading: isUpdatingSurvey }] =
		useUpdateSurveyMutation();
	const [createQuestion, { isLoading: isCreatingQuestion }] =
		useCreateQuestionMutation();
	const [updateQuestion, { isLoading: isUpdatingQuestion }] =
		useUpdateQuestionMutation();
	const [deleteQuestion] = useDeleteQuestionMutation();
	const [updateOption] = useUpdateOptionMutation();
	const [deleteOption] = useDeleteOptionMutation();

	// Survey Edit State
	const [editingSurvey, setEditingSurvey] = useState(false);
	const [editingSurveyForm, setEditingSurveyForm] =
		useState<Partial<Survey> | null>(null);

	// Question Edit State
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

	// Option Edit State
	const [editingOptionId, setEditingOptionId] = useState<{
		questionId: string;
		optionId: string;
	} | null>(null);
	const [editingOptionText, setEditingOptionText] = useState("");

	// ============END HOOKS & STATE============

	// ============START STATE HELPER FUNCTIONS============

	// Survey Edit Helpers
	const initSurveyEdit = (survey: Survey | undefined) => {
		if (!survey) return;
		setEditingSurvey(true);
		setEditingSurveyForm({
			title: survey.title,
			description: survey.description,
			allow_multiple_responses: survey.allow_multiple_responses,
			show_progress_bar: survey.show_progress_bar,
		});
	};

	const cancelSurveyEdit = () => {
		setEditingSurvey(false);
		setEditingSurveyForm(null);
	};

	const updateSurveyForm = (updates: Partial<Survey>) => {
		setEditingSurveyForm((prev) => (prev ? { ...prev, ...updates } : null));
	};

	// Question Edit Helpers
	const initQuestionEdit = (question: any) => {
		if (!question) return;
		setEditingQuestionId(question.id);
		setQuestionForm({
			question_text: question.question_text,
			question_type: question.question_type,
			is_required: question.is_required,
			options: question.options.map((opt: any) => opt.option_text),
		});
	};

	const cancelQuestionEdit = () => {
		setEditingQuestionId(null);
		setQuestionForm({
			question_text: "",
			question_type: "single_choice",
			is_required: false,
			options: ["", ""],
		});
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

	// Option Edit Helpers
	const initOptionEdit = (
		questionId: string,
		optionId: string,
		optionText: string
	) => {
		setEditingOptionId({ questionId, optionId });
		setEditingOptionText(optionText);
	};

	const cancelOptionEdit = () => {
		setEditingOptionId(null);
		setEditingOptionText("");
	};

	// ============END STATE HELPER FUNCTIONS============

	// ============START EVENT HANDLERS============

	// Survey Handlers
	const handleEditSurvey = () => {
		initSurveyEdit(survey);
	};

	const handleSaveSurvey = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingSurveyForm) return;

		try {
			await updateSurvey({
				id: surveyId,
				data: editingSurveyForm,
			}).unwrap();
			cancelSurveyEdit();
			alert("Survey updated successfully!");
		} catch (error) {
			alert("Failed to update survey");
		}
	};

	// Question Handlers
	const handleEditQuestion = (questionId: string) => {
		const question = survey?.questions?.find((q) => q.id === questionId);
		initQuestionEdit(question);
		// Scroll to the form
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
			alert("Add at least 2 options");
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
				alert("Question updated successfully!");
				cancelQuestionEdit();
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

				resetQuestionForm();
				setShowAddQuestion(false);
			}
		} catch (error) {
			alert(
				editingQuestionId
					? "Failed to update question"
					: "Failed to create question"
			);
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

	// Option Handlers
	const handleSaveOption = async () => {
		if (!editingOptionId || !editingOptionText.trim()) return;

		try {
			await updateOption({
				surveyId,
				questionId: editingOptionId.questionId,
				optionId: editingOptionId.optionId,
				data: { option_text: editingOptionText },
			}).unwrap();
			cancelOptionEdit();
			alert("Option updated successfully!");
		} catch (error) {
			alert("Failed to update option");
		}
	};

	const handleDeleteOption = async (questionId: string, optionId: string) => {
		if (!confirm("Delete this option?")) return;

		try {
			await deleteOption({ surveyId, questionId, optionId }).unwrap();
		} catch (error) {
			alert("Failed to delete option");
		}
	};

	// Status Change Handler
	const handleStatusChange = async (newStatus: string) => {
		try {
			await updateStatus({ id: surveyId, status: newStatus }).unwrap();
			alert(`Survey status changed to ${newStatus}`);
		} catch (error) {
			alert("Failed to change survey status");
		}
	};

	// Publish Handler
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

	// ============END EVENT HANDLERS============

	// ============START LOADING STATE============
	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}
	// ============END LOADING STATE============

	// ============START ERROR STATE============
	if (!survey) {
		return <div className="container mx-auto py-8">Survey not found</div>;
	}
	// ============END ERROR STATE============

	// ============START MAIN RENDER============
	return (
		<div className="container mx-auto py-8 max-w-4xl">
			{editingSurvey && editingSurveyForm ? (
				// Show Edit Form
				<SurveyEditForm
					surveyForm={editingSurveyForm}
					isLoading={isUpdatingSurvey}
					onUpdate={(field, value) =>
						updateSurveyForm({ [field]: value })
					}
					onSave={handleSaveSurvey}
					onCancel={cancelSurveyEdit}
				/>
			) : (
				// Show Survey Header
				<SurveyHeader
					survey={survey!}
					onEditClick={handleEditSurvey}
					onPublish={handlePublish}
					onChangeStatus={handleStatusChange}
					onStatusChange={handleStatusChange}
				/>
			)}

			{/* Questions Section - Hide edit form when showing survey edit */}
			{!editingSurvey && survey && (
				<>
					{/* Questions List */}
					<QuestionsList
						survey={survey}
						editingOptionId={editingOptionId}
						editingOptionText={editingOptionText}
						onEditQuestion={handleEditQuestion}
						onDeleteQuestion={handleDeleteQuestion}
						onEditOption={initOptionEdit}
						onSaveOption={handleSaveOption}
						onDeleteOption={handleDeleteOption}
						onCancelOptionEdit={cancelOptionEdit}
						onEditingOptionTextChange={setEditingOptionText}
					/>

					{/* Add Question Button - Only show in draft status */}
					{!showAddQuestion &&
						!editingQuestionId &&
						survey?.status === "draft" && (
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
								isLoading={
									isCreatingQuestion || isUpdatingQuestion
								}
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
								onCancel={() => {
									if (editingQuestionId) {
										cancelQuestionEdit();
									} else {
										setShowAddQuestion(false);
										resetQuestionForm();
									}
								}}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
	// ============END MAIN RENDER============
}
