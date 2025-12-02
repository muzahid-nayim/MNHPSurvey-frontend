// src/components/survey/QuestionForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionType } from "@/types";

interface QuestionFormProps {
	isEditing: boolean;
	questionText: string;
	questionType: QuestionType;
	isRequired: boolean;
	options: string[];
	isLoading?: boolean;
	onQuestionTextChange: (text: string) => void;
	onQuestionTypeChange: (type: QuestionType) => void;
	onRequiredChange: (required: boolean) => void;
	onAddOption: () => void;
	onRemoveOption: (index: number) => void;
	onUpdateOption: (index: number, value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function QuestionForm({
	isEditing,
	questionText,
	questionType,
	isRequired,
	options,
	isLoading = false,
	onQuestionTextChange,
	onQuestionTypeChange,
	onRequiredChange,
	onAddOption,
	onRemoveOption,
	onUpdateOption,
	onSubmit,
	onCancel,
}: QuestionFormProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{isEditing ? "Edit Question" : "Add New Question"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					{/* Question Text */}
					<div className="space-y-2">
						<Label htmlFor="question_text">
							Question <span className="text-red-500">*</span>
						</Label>
						<Input
							id="question_text"
							value={questionText}
							onChange={(e) =>
								onQuestionTextChange(e.target.value)
							}
							placeholder="What is your question?"
							required
						/>
					</div>

					{/* Question Type */}
					<div className="space-y-2">
						<Label htmlFor="question_type">
							Question Type{" "}
							<span className="text-red-500">*</span>
						</Label>
						<select
							id="question_type"
							value={questionType}
							onChange={(e) =>
								onQuestionTypeChange(
									e.target.value as QuestionType
								)
							}
							className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
							checked={isRequired}
							onChange={(e) => onRequiredChange(e.target.checked)}
						/>
						<Label htmlFor="is_required" className="cursor-pointer">
							Required question
						</Label>
					</div>

					{/* Options Section */}
					<div className="space-y-2">
						<Label>
							Options <span className="text-red-500">*</span>
							<span className="text-xs text-muted-foreground ml-2">
								(Add at least 2)
							</span>
						</Label>

						{options.map((option, index) => (
							<div key={index} className="flex gap-2">
								<Input
									value={option}
									onChange={(e) =>
										onUpdateOption(index, e.target.value)
									}
									placeholder={`Option ${index + 1}`}
								/>
								{options.length > 2 && (
									<Button
										type="button"
										variant="outline"
										onClick={() => onRemoveOption(index)}
										className="text-red-500 hover:text-red-700"
									>
										Remove
									</Button>
								)}
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={onAddOption}
							className="w-full"
						>
							+ Add Option
						</Button>
					</div>

					{/* Form Buttons */}
					<div className="flex gap-2 pt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{isLoading
								? "Saving..."
								: isEditing
								? "Update Question"
								: "Add Question"}
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
