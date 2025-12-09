// src/components/survey/SurveyEditForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Loader2,
	Settings2,
	Type,
	AlignLeft,
	RefreshCw,
	BarChart,
} from "lucide-react";
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
		<Card className="border-2 border-primary/20 shadow-lg">
			<CardHeader className="bg-linear-to-r  border-b">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<Settings2 className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-xl">Edit Survey</CardTitle>
						<CardDescription>
							Update your survey details and settings
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-6">
				<form onSubmit={onSave} className="space-y-6">
					{/* Title Input */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Type className="h-4 w-4 text-muted-foreground" />
							<Label
								htmlFor="survey_title"
								className="text-base font-medium"
							>
								Title
							</Label>
						</div>
						<Input
							id="survey_title"
							value={surveyForm.title || ""}
							onChange={(e) => onUpdate("title", e.target.value)}
							placeholder="What's your survey about?"
							className="h-11 text-base border-2 focus:border-primary"
							required
						/>
						<p className="text-xs text-muted-foreground">
							A clear title helps respondents understand your
							survey
						</p>
					</div>

					{/* Description Input */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<AlignLeft className="h-4 w-4 text-muted-foreground" />
							<Label
								htmlFor="survey_description"
								className="text-base font-medium"
							>
								Description
							</Label>
						</div>
						<Textarea
							id="survey_description"
							value={surveyForm.description || ""}
							onChange={(e) =>
								onUpdate("description", e.target.value)
							}
							placeholder="Add more details about your survey (optional)"
							className="min-h-[100px] border-2 focus:border-primary resize-y"
							rows={3}
						/>
						<p className="text-xs text-muted-foreground">
							Provide context or instructions for your respondents
						</p>
					</div>

					{/* Survey Settings Section */}
					<div className="space-y-4 pt-4 border-t">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Settings2 className="h-4 w-4" />
							Survey Settings
						</h3>

						{/* Allow Multiple Responses */}
						<div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
							<Checkbox
								id="allow_multiple"
								checked={
									surveyForm.allow_multiple_responses || false
								}
								onCheckedChange={(checked) =>
									onUpdate(
										"allow_multiple_responses",
										checked
									)
								}
								className="mt-1 h-5 w-5"
							/>
							<div className="space-y-1">
								<Label
									htmlFor="allow_multiple"
									className="text-sm font-medium cursor-pointer flex items-center gap-2"
								>
									<RefreshCw className="h-3.5 w-3.5" />
									Allow Multiple Responses
								</Label>
								<p className="text-xs text-muted-foreground">
									Respondents can submit this survey multiple
									times
								</p>
							</div>
						</div>

						{/* Show Progress Bar */}
						<div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
							<Checkbox
								id="show_progress"
								checked={surveyForm.show_progress_bar || false}
								onCheckedChange={(checked) =>
									onUpdate("show_progress_bar", checked)
								}
								className="mt-1 h-5 w-5"
							/>
							<div className="space-y-1">
								<Label
									htmlFor="show_progress"
									className="text-sm font-medium cursor-pointer flex items-center gap-2"
								>
									<BarChart className="h-3.5 w-3.5" />
									Show Progress Bar
								</Label>
								<p className="text-xs text-muted-foreground">
									Display a progress bar to respondents
								</p>
							</div>
						</div>
					</div>

					{/* Form Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
						<Button
							type="submit"
							disabled={isLoading}
							className="sm:flex-1 h-11 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving Changes...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="sm:flex-1 h-11 border-2"
							disabled={isLoading}
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
