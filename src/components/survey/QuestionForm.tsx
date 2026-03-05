// src/components/survey/QuestionForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import type { QuestionType } from "@/types";
import { useEffect, useRef } from "react";
interface QuestionFormProps {
	isEditing: boolean;
	questionText: string;
	questionType: QuestionType;
	isRequired: boolean;
	options: string[];
	isLoading: boolean;
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
	isLoading,
	onQuestionTextChange,
	onQuestionTypeChange,
	onRequiredChange,
	onAddOption,
	onRemoveOption,
	onUpdateOption,
	onSubmit,
	onCancel,
}: QuestionFormProps) {
	const prevOptionsLength = useRef(options.length);
	useEffect(() => {
		if (options.length > prevOptionsLength.current) {
			const inputs = document.querySelectorAll<HTMLInputElement>(
				'input[placeholder^="Option"]',
			);
			inputs[inputs.length - 1]?.focus();
		}
		prevOptionsLength.current = options.length;
	}, [options.length]);

	return (
		<Card className="border-2 border-blue-500/20">
			<form onSubmit={onSubmit}>
				<CardHeader className="border-b pb-4">
					<CardTitle className="text-xl">
						{isEditing ? "Edit Question" : "Add New Question"}
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					<div className="space-y-2">
						<Label htmlFor="question_text">Question</Label>
						<Input
							id="question_text"
							value={questionText}
							onChange={(e) =>
								onQuestionTextChange(e.target.value)
							}
							placeholder="e.g. What is your preferred work schedule?"
							required
							className="text-sm md:text-base "
						/>
					</div>

					<div className="space-y-2">
						<Label>Question Type</Label>
						<div className="flex gap-4">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="single_choice"
									checked={questionType === "single_choice"}
									onCheckedChange={() =>
										onQuestionTypeChange("single_choice")
									}
								/>
								<label
									htmlFor="single_choice"
									className="text-sm font-medium"
								>
									Single Choice (Radio)
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="multiple_choice"
									checked={questionType === "multiple_choice"}
									onCheckedChange={() =>
										onQuestionTypeChange("multiple_choice")
									}
								/>
								<label
									htmlFor="multiple_choice"
									className="text-sm font-medium"
								>
									Multiple Choice (Checkbox)
								</label>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="required"
							checked={isRequired}
							onCheckedChange={(checked) =>
								onRequiredChange(checked as boolean)
							}
						/>
						<label
							htmlFor="required"
							className="text-sm font-medium"
						>
							Required Question
						</label>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Options</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onAddOption}
								className="gap-1"
							>
								<Plus className="h-4 w-4" />
								Add Option
							</Button>
						</div>

						<div className="space-y-3">
							{options.map((option, index) => (
								<div
									key={index}
									className="flex items-center gap-2"
								>
									<Input
										value={option}
										onChange={(e) =>
											onUpdateOption(
												index,
												e.target.value,
											)
										}
										placeholder={`Option ${index + 1}`}
										required
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (
													index ===
														options.length - 1 &&
													option.trim()
												) {
													onAddOption();
												}
											}
										}}
									/>
									{options.length > 2 && (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() =>
												onRemoveOption(index)
											}
											className="text-red-500 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
						</div>
					</div>

					<div className="flex gap-3 pt-4 border-t">
						<Button
							type="submit"
							disabled={isLoading}
							className="flex-1"
							
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
							className="flex-1"
						>
							Cancel
						</Button>
					</div>
				</CardContent>
			</form>
		</Card>
	);
}
