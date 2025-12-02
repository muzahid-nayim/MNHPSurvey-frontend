// src/components/survey/SurveyEditForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Survey } from "@/types";

interface SurveyEditFormProps {
	surveyForm: Partial<Survey> | null;
	isLoading?: boolean;
	onUpdate: (field: string, value: any) => void;
	onSave: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function SurveyEditForm({
	surveyForm,
	isLoading = false,
	onUpdate,
	onSave,
	onCancel,
}: SurveyEditFormProps) {
	if (!surveyForm) return null;

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Edit Survey Details</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSave} className="space-y-4">
					{/* Title Input */}
					<div className="space-y-2">
						<Label htmlFor="survey_title">Title</Label>
						<Input
							id="survey_title"
							value={surveyForm.title || ""}
							onChange={(e) => onUpdate("title", e.target.value)}
							placeholder="Enter survey title"
							required
						/>
					</div>

					{/* Description Input */}
					<div className="space-y-2">
						<Label htmlFor="survey_description">Description</Label>
						<Input
							id="survey_description"
							value={surveyForm.description || ""}
							onChange={(e) =>
								onUpdate("description", e.target.value)
							}
							placeholder="Enter survey description (optional)"
						/>
					</div>

					{/* Allow Multiple Responses Checkbox */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="allow_multiple"
							checked={
								surveyForm.allow_multiple_responses || false
							}
							onChange={(e) =>
								onUpdate(
									"allow_multiple_responses",
									e.target.checked
								)
							}
						/>
						<Label
							htmlFor="allow_multiple"
							className="cursor-pointer"
						>
							Allow Multiple Responses
						</Label>
					</div>

					{/* Show Progress Bar Checkbox */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="show_progress"
							checked={surveyForm.show_progress_bar || false}
							onChange={(e) =>
								onUpdate("show_progress_bar", e.target.checked)
							}
						/>
						<Label
							htmlFor="show_progress"
							className="cursor-pointer"
						>
							Show Progress Bar
						</Label>
					</div>

					{/* Form Buttons */}
					<div className="flex gap-2 pt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-green-600 hover:bg-green-700"
						>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
