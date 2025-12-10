// src/components/survey/QuestionsList.tsx
"use client";

import { useState } from "react";
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
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		type: "question" | "option";
		id?: string;
		questionId?: string;
	}>({ open: false, type: "question" });

	const isEditable =
		survey?.status === "draft" || survey?.status === "active";

	const handleDeleteConfirm = () => {
		if (deleteDialog.type === "question" && deleteDialog.id) {
			onDeleteQuestion(deleteDialog.id);
		} else if (
			deleteDialog.type === "option" &&
			deleteDialog.id &&
			deleteDialog.questionId
		) {
			onDeleteOption(deleteDialog.questionId, deleteDialog.id);
		}
		setDeleteDialog({ open: false, type: "question" });
	};

	return (
		<>
			<div className="space-y-6">
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
														onEditQuestion(
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
																className={`flex items-center justify-between p-2 rounded transition-colors ${
																	editingOptionId?.optionId ===
																	option.id
																		? "bg-blue-100/20 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-600"
																		: "hover:bg-gray-100 dark:hover:bg-slate-700/50"
																}`}  
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

																	{editingOptionId?.optionId ===
																	option.id ? (
																		<Input
																			value={
																				editingOptionText
																			}
																			onChange={(
																				e
																			) =>
																				onEditingOptionTextChange(
																					e
																						.target
																						.value
																				)
																			}
																			className="flex-1"
																			autoFocus
																			onKeyDown={(
																				e
																			) => {
																				if (
																					e.key ===
																					"Enter"
																				)
																					onSaveOption();
																				if (
																					e.key ===
																					"Escape"
																				)
																					onCancelOptionEdit();
																			}}
																		/>
																	) : (
																		<span className="text-sm">
																			{
																				option.option_text
																			}
																		</span>
																	)}
																</div>

																{isEditable && (
																	<div className="flex items-center gap-1">
																		{editingOptionId?.optionId ===
																		option.id ? (
																			<>
																				<Button
																					size="sm"
																					variant="outline"
																					onClick={
																						onSaveOption
																					}
																					className="h-7 px-2 bg-green-50 hover:bg-green-100"
																				>
																					<Check className="h-3.5 w-3.5" />
																				</Button>
																				<Button
																					size="sm"
																					variant="outline"
																					onClick={
																						onCancelOptionEdit
																					}
																					className="h-7 px-2"
																				>
																					<X className="h-3.5 w-3.5" />
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
																					className="h-7 px-2"
																				>
																					<Edit2 className="h-3.5 w-3.5" />
																				</Button>
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
																			</>
																		)}
																	</div>
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
