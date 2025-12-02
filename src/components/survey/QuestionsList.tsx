// src/components/survey/QuestionsList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Question, Survey } from "@/types";

interface QuestionsListProps {
	survey: Survey;
	editingOptionId: { questionId: string; optionId: string } | null;
	editingOptionText: string;
	onEditQuestion: (questionId: string) => void;
	onDeleteQuestion: (questionId: string) => void;
	onEditOption: (
		questionId: string,
		optionId: string,
		optionText: string
	) => void;
	onSaveOption: () => void;
	onDeleteOption: (questionId: string, optionId: string) => void;
	onCancelOptionEdit: () => void;
	onEditingOptionTextChange: (text: string) => void;
}

export function QuestionsList({
	survey,
	editingOptionId,
	editingOptionText,
	onEditQuestion,
	onDeleteQuestion,
	onEditOption,
	onSaveOption,
	onDeleteOption,
	onCancelOptionEdit,
	onEditingOptionTextChange,
}: QuestionsListProps) {
	return (
		<div className="space-y-4 mb-6">
			<h2 className="text-xl font-semibold">
				Questions ({survey?.questions?.length || 0})
			</h2>

			{/* Empty State */}
			{survey?.questions && survey.questions.length === 0 && (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						No questions yet. Add your first question below.
					</CardContent>
				</Card>
			)}

			{/* Questions List */}
			{survey?.questions?.map((question: Question, index: number) => (
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
									{question.question_type === "single_choice"
										? "Single Choice"
										: "Multiple Choice"}
								</p>
							</div>
							<div className="flex gap-2">
								{(survey?.status === "draft" ||
									survey?.status === "active") && (
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											onEditQuestion(question.id)
										}
									>
										Edit
									</Button>
								)}
								<Button
									variant="destructive"
									size="sm"
									onClick={() =>
										onDeleteQuestion(question.id)
									}
								>
									Delete
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{question.options.map((option) => (
								<div
									key={option.id}
									className="flex items-center justify-between gap-2 p-2 rounded dark:hover:bg-gray-600 hover:bg-gray-300 transition-colors"
								>
									<div className="flex items-center gap-2 flex-1">
										{editingOptionId?.optionId ===
										option.id ? (
											<Input
												value={editingOptionText}
												onChange={(e) =>
													onEditingOptionTextChange(
														e.target.value
													)
												}
												className="flex-1"
												autoFocus
											/>
										) : (
											<>
												{question.question_type ===
												"single_choice" ? (
													<span className="w-4 h-4 rounded-full border-2 border-gray-400 shrink-0"></span>
												) : (
													<span className="w-4 h-4 rounded border-2 border-gray-400 shrink-0"></span>
												)}
												<span className="text-sm">
													{option.option_text}
												</span>
											</>
										)}
									</div>
									{(survey?.status === "draft" ||
										survey?.status === "active") && (
										<div className="flex gap-1">
											{editingOptionId?.optionId ===
											option.id ? (
												<>
													<Button
														size="sm"
														variant="outline"
														onClick={onSaveOption}
														className="bg-green-50 hover:bg-green-100"
													>
														Save
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={
															onCancelOptionEdit
														}
													>
														Cancel
													</Button>
												</>
											) : (
												<>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															onEditOption(
																question.id,
																option.id,
																option.option_text
															)
														}
													>
														Edit
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-red-500 hover:text-red-700"
														onClick={() =>
															onDeleteOption(
																question.id,
																option.id
															)
														}
													>
														Delete
													</Button>
												</>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
