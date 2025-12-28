// src/components/survey/SurveyEditForm.tsx
"use client";

import { useEffect, useState } from "react";
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
	Shield,
	Mail,
	Users,
	Lock,
} from "lucide-react";
import type { Survey, AccessType, DisplayMode } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SurveyAllowedEmailsManager from "./SurveyInvitationManager";
import { useUpdateSurveyMutation } from "@/core/api/surveyApi";
import { toast } from "react-toastify";

interface SurveyEditFormProps {
	survey: Survey;
	surveyId: string;
	accessType: AccessType;
	onSaveComplete: () => void;
	onCancel: () => void;
}

export function SurveyEditForm({
	survey,
	surveyId,
	accessType,
	onSaveComplete,
	onCancel,
}: SurveyEditFormProps) {
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
	const isPrivateInvited = accessType === "private_invited";

	const [updateSurvey, { isLoading: isUpdatingSurvey }] =
		useUpdateSurveyMutation();

	// ✅ ONLY ONE STATE SOURCE - initialized from props
	const [formState, setFormState] = useState<Partial<Survey>>({
		title: survey.title,
		description: survey.description,
		display_mode: survey.display_mode,
		questions_per_page: survey.questions_per_page,
		allow_multiple_responses: survey.allow_multiple_responses,
		show_progress_bar: survey.show_progress_bar,
	});

	// ✅ Sync state when survey prop changes (like if parent refetches)
	useEffect(() => {
		setFormState({
			title: survey.title,
			description: survey.description,
			display_mode: survey.display_mode,
			questions_per_page: survey.questions_per_page,
			allow_multiple_responses: survey.allow_multiple_responses,
			show_progress_bar: survey.show_progress_bar,
		});
	}, [survey]);

	// ✅ INTERNAL STATE UPDATER - no more prop dependencies
	const updateField = (field: keyof Survey, value: any) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	// ✅ PROPER SAVE HANDLER - handles API call internally
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// const payload = {
			// 	title: formState.title,
			// 	description: formState.description,
			// 	question_per_page: formState.questions_per_page,
			// 	allow_multiple_responses: formState.allow_multiple_responses,
			// 	show_progress_bar: formState.show_progress_bar,
			// };

			await updateSurvey({
				id: surveyId,
				data: formState,
			}).unwrap();

			toast.success("Survey updated successfully!");
			onSaveComplete(); // Notify parent to exit edit mode
		} catch (error) {
			console.error("Failed to update survey:", error);
			toast.error("Failed to update survey. Please try again.");
		}
	};

	return (
		<Card className="border-2 border-primary/20 shadow-lg">
			<CardHeader className="border-b">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Settings2 className="h-5 w-5 text-primary" />
						</div>
						<div>
							<CardTitle className="text-xl">
								Edit Survey
							</CardTitle>
							<CardDescription>
								Update your survey details and settings
							</CardDescription>
						</div>
					</div>
					<Badge variant="outline" className="gap-1">
						{accessType}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-6">
				{isPrivateInvited && surveyId && (
					<div className="mb-6 p-4 border rounded-lg bg-linear-to-r">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-white border border-blue-200">
									<Users className="h-4 w-4 text-blue-600" />
								</div>
								<div>
									<h4 className="font-medium text-blue-900">
										Private Survey Access
									</h4>
									<p className="text-sm text-muted-foreground">
										Only invited emails can access this
										survey
									</p>
								</div>
							</div>
							<Dialog
								open={isEmailDialogOpen}
								onOpenChange={setIsEmailDialogOpen}
							>
								<DialogTrigger asChild>
									<Button size="sm" className="gap-2">
										<Mail className="h-3.5 w-3.5" />
										Manage Invitations
									</Button>
								</DialogTrigger>
								<EmailAccessDialog
									surveyId={surveyId}
									onClose={() => setIsEmailDialogOpen(false)}
								/>
							</Dialog>
						</div>
					</div>
				)}

				{/* ✅ FIXED FORM - uses internal handler */}
				<form onSubmit={handleSubmit} className="space-y-6">
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
							value={formState.title || ""}
							onChange={(e) =>
								updateField("title", e.target.value)
							}
							placeholder="What's your survey about?"
							className="h-11 text-base border-2 focus:border-primary"
							required
						/>
						<p className="text-xs text-muted-foreground">
							A clear title helps respondents understand your
							survey
						</p>
					</div>

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
							value={formState.description || ""}
							onChange={(e) =>
								updateField("description", e.target.value)
							}
							placeholder="Add more details about your survey (optional)"
							className="min-h-[100px] border-2 focus:border-primary resize-y"
							rows={3}
						/>
						<p className="text-xs text-muted-foreground">
							Provide context or instructions for your respondents
						</p>
					</div>

					<div className="space-y-4 pt-4 border-t">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Settings2 className="h-4 w-4" />
							Survey Settings
						</h3>

						<div className="space-y-2">
							<Label htmlFor="display_mode">Display Mode *</Label>
							<Select
								value={formState.display_mode}
								onValueChange={(value) =>
									setFormState({
										...formState,
										display_mode: value as DisplayMode,
									})
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select display mode" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="show_all">
											Show All Questions
										</SelectItem>
										<SelectItem value="one_by_one">
											One Question at a Time
										</SelectItem>
										<SelectItem value="paginated">
											Custom Pages
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						{formState.display_mode === "paginated" && (
							<div className="space-y-2">
								<Label htmlFor="questions_per_page">
									Questions Per Page
								</Label>
								<Select
								value={formState.questions_per_page?.toString() || "5"}
								onValueChange={(value) =>
									setFormState({
										...formState,
										questions_per_page: parseInt(value),
									})
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Question per page" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="3">
											3
										</SelectItem>
										<SelectItem value="5">
											5
										</SelectItem>
										<SelectItem value="7">
											7
										</SelectItem>
										<SelectItem value="10">
											10
										</SelectItem>

										<SelectItem value="15">
											15
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							</div>
						)}

						<div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
							<Checkbox
								id="allow_multiple"
								checked={
									formState.allow_multiple_responses || false
								}
								onCheckedChange={(checked) =>
									updateField(
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

						<div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
							<Checkbox
								id="show_progress"
								checked={formState.show_progress_bar || false}
								onCheckedChange={(checked) =>
									updateField("show_progress_bar", checked)
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

					<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
						<Button
							type="submit"
							disabled={isUpdatingSurvey}
							className="sm:flex-1 h-11 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
						>
							{isUpdatingSurvey ? (
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
							disabled={isUpdatingSurvey}
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

// EmailAccessDialog remains the same - no changes needed
function EmailAccessDialog({
	surveyId,
	onClose,
}: {
	surveyId: string;
	onClose: () => void;
}) {
	return (
		<DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
			<DialogHeader className="px-6 pt-6">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<Shield className="h-5 w-5 text-primary" />
					</div>
					<div>
						<DialogTitle className="text-xl">
							Manage Email Invitations
						</DialogTitle>
						<DialogDescription>
							Control who can access this private survey
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-6 pb-6 h-[calc(90vh-100px)] overflow-y-auto">
				<SurveyAllowedEmailsManager
					accessType="private_invited"
					surveyId={surveyId}
					className="space-y-4!"
				/>
			</div>
		</DialogContent>
	);
}
