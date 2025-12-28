// src/app/dashboard/surveys/[id]/page.tsx
"use client";

// ============START IMPORTS============
import { useParams } from "next/navigation";
import { useState } from "react";
import {
	useGetSurveyQuery,
	useUpdateSurveyStatusMutation,
} from "@/core/api/surveyApi";
import type { Survey } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyEditForm } from "@/components/survey/SurveyEditForm";
import { QuestionsList } from "@/components/survey/QuestionsList";
// ============END IMPORTS============

export default function EditSurveyPage() {
	// ============START HOOKS & STATE============
	const params = useParams();
	const surveyId = params.id as string;

	// API Queries and Mutations
	const { data: survey, isLoading, refetch } = useGetSurveyQuery(surveyId);
	const [updateStatus] = useUpdateSurveyStatusMutation();

	const [isEditingSurvey, setIsEditingSurvey] = useState(false);
	// ============END HOOKS & STATE============

	// ============START EVENT HANDLERS============
	const handleEditSurvey = () => {
		if (!survey) return;
		setIsEditingSurvey(true);
	};

	const handleSurveySaveComplete = () => {
		setIsEditingSurvey(false);
		refetch();
	};

	const handleSurveyCancel = () => {
		setIsEditingSurvey(false);
	};

	const handleSurveyUpdate = () => {
		refetch();
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
			{isEditingSurvey ? (
				// Show Edit Form
				<SurveyEditForm
					survey={survey}
					surveyId={surveyId}
					accessType={survey.access_type}
					onSaveComplete={handleSurveySaveComplete}
					onCancel={handleSurveyCancel}
				/>
			) : (
				// Show Survey Header
				<SurveyHeader survey={survey} onEditClick={handleEditSurvey} />
			)}

			{/* Questions Section - Hide edit form when showing survey edit */}
			{!isEditingSurvey && survey && (
				<QuestionsList
					survey={survey}
					surveyId={surveyId}
					onSurveyUpdate={handleSurveyUpdate}
				/>
			)}
		</div>
	);
	// ============END MAIN RENDER============
}
