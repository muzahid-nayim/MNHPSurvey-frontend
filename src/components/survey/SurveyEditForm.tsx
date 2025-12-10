// src/components/survey/SurveyEditForm.tsx
"use client";

import { useState } from "react";
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
	X,
	Plus,
	Check,
	Trash2,
	Send,
} from "lucide-react";
import type { Survey } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

interface SurveyEditFormProps {
	surveyForm: Partial<Survey> | null;
	isLoading?: boolean;
	surveyId?: string | null;
	accessType?: string | null;
	onUpdate: (field: string, value: any) => void;
	onSave: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function SurveyEditForm({
	surveyForm,
	isLoading = false,
	surveyId,
	accessType,
	onUpdate,
	onSave,
	onCancel,
}: SurveyEditFormProps) {
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

	if (!surveyForm) return null;

	const isPrivateInvited = accessType === "private_invited";

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
				{/* Quick Access Card for Private Surveys */}
				{isPrivateInvited && surveyId && (
					<div className="mb-6 p-4 border  rounded-lg bg-linear-to-r ">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg ">
									<Users className="h-4 w-4 text-blue-600" />
								</div>
								<div>
									<h4 className="font-medium ">
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

// Simplified Email Access Dialog Component
function EmailAccessDialog({
	surveyId,
	onClose,
}: {
	surveyId: string;
	onClose: () => void;
}) {
	// Mock data - replace with your actual API calls
	const [selectedEmails, setSelectedEmails] = useState<string[]>(["1", "2"]);
	const [newEmail, setNewEmail] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Mock data - replace with your API data
	const userEmails = [
		{ id: "1", email: "john@example.com" },
		{ id: "2", email: "jane@example.com" },
		{ id: "3", email: "alex@company.com" },
	];

	const handleToggleEmail = (emailId: string) => {
		setSelectedEmails((prev) =>
			prev.includes(emailId)
				? prev.filter((id) => id !== emailId)
				: [...prev, emailId]
		);
	};

	const handleAddEmail = () => {
		if (!newEmail.trim()) {
			toast.info("Please enter an email address");
			return;
		}

		toast.info(`Email ${newEmail} has been added`);
		setSelectedEmails((prev) => [...prev, newEmail]);
		
		setNewEmail("");
	};

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			toast.info("Survey invitations have been updated");
			setIsSaving(false);
			onClose();
		}, 1000);
	};

	return (
		<DialogContent className="sm:max-w-[500px]">
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<Shield className="h-5 w-5 text-primary" />
					</div>
					<div>
						<DialogTitle>Manage Email Invitations</DialogTitle>
						<DialogDescription>
							Control who can access this private survey
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4">
				{/* Add Email Form */}
				<div className="space-y-2">
					<Label>Add New Email</Label>
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="email"
								placeholder="user@example.com"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleAddEmail()
								}
								className="pl-9"
							/>
						</div>
						<Button
							onClick={handleAddEmail}
							disabled={!newEmail.trim()}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<Separator />

				{/* Email List */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label>
							Select Emails ({selectedEmails.length} selected)
						</Label>
						<Badge variant="outline">
							{userEmails.length} total
						</Badge>
					</div>

					<ScrollArea className="h-[300px] border rounded-lg p-2">
						{userEmails.map((email) => (
							<div
								key={email.id}
								className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
									selectedEmails.includes(email.id)
										? "bg-primary/5 border border-primary/20"
										: "hover:bg-muted/50"
								}`}
							>
								<div className="flex items-center gap-3">
									<Checkbox
										checked={selectedEmails.includes(
											email.id
										)}
										onCheckedChange={() =>
											handleToggleEmail(email.id)
										}
									/>
									<div className="flex items-center gap-2">
										<div className="p-1.5 rounded-md bg-muted">
											<Mail className="h-3.5 w-3.5" />
										</div>
										<span className="text-sm">
											{email.email}
										</span>
									</div>
								</div>
								{selectedEmails.includes(email.id) && (
									<Badge
										variant="secondary"
										className="gap-1"
									>
										<Check className="h-3 w-3" />
										Selected
									</Badge>
								)}
							</div>
						))}
					</ScrollArea>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 pt-4">
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving}
						className="flex-1"
					>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
				</div>
			</div>
		</DialogContent>
	);
}
