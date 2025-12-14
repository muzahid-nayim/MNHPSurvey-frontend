// src/components/survey/SurveyInvitationManager.tsx - FIXED FOR DIALOG
/**
 * SurveyAllowedEmailsManager Component
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	AlertCircle,
	Loader2,
	Users,
	Check,
	X,
	Plus,
	Mail,
	Shield,
	UserPlus,
	Send,
	Trash2,
} from "lucide-react";
import {
	useGetAllowedEmailsQuery,
	useGetSurveyAllowedEmailsQuery,
	useAddSurveyAllowedEmailsMutation,
	useRemoveSurveyAllowedEmailMutation,
	useCreateAllowedEmailMutation,
} from "@/core/api/surveyApi";
import type { AllowedEmail } from "@/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

interface Props {
	surveyId: string;
	accessType: string;
	className?: string;
}

export default function SurveyAllowedEmailsManager({
	surveyId,
	accessType,
	className,
}: Props) {
	if (accessType !== "private_invited") return null;

	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [newEmail, setNewEmail] = useState("");
	const [isAddingEmail, setIsAddingEmail] = useState(false);
	const initializedRef = useRef(false);

	const { data: userAllowedEmails = [], isLoading: isLoadingUserEmails } =
		useGetAllowedEmailsQuery();
	const { data: surveyAllowedEmails = [], isLoading: isLoadingSurveyEmails } =
		useGetSurveyAllowedEmailsQuery(surveyId);
	const [addEmails] = useAddSurveyAllowedEmailsMutation();
	const [removeEmail] = useRemoveSurveyAllowedEmailMutation();
	const [createAllowedEmail] = useCreateAllowedEmailMutation();

	useEffect(() => {
		if (!isLoadingSurveyEmails && !initializedRef.current) {
			const emailIds = surveyAllowedEmails.map((email) => email.id);
			setSelectedEmails(emailIds);
			initializedRef.current = true;
		}
	}, [isLoadingSurveyEmails, surveyAllowedEmails]);

	const handleToggleEmail = (emailId: string) => {
		setSelectedEmails((prev) =>
			prev.includes(emailId)
				? prev.filter((id) => id !== emailId)
				: [...prev, emailId]
		);
	};

	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			await addEmails({
				surveyId,
				allowed_email_ids: selectedEmails,
			}).unwrap();
			toast.success("Survey access has been updated successfully.");
		} catch (error: any) {
			toast.error(error.data?.error || "Failed to update survey access");
			const emailIds = surveyAllowedEmails.map((email) => email.id);
			setSelectedEmails(emailIds);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRemoveEmail = async (emailId: string) => {
		try {
			await removeEmail({
				surveyId,
				allowed_email_id: emailId,
			}).unwrap();
			setSelectedEmails((prev) => prev.filter((id) => id !== emailId));
			toast.info("Email has been removed from survey access.");
		} catch (error: any) {
			toast.error(error.data?.error || "Failed to remove email");
		}
	};

	const handleAddNewEmail = async () => {
		if (!newEmail.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsAddingEmail(true);
		try {
			const response = await createAllowedEmail({
				email: newEmail.trim(),
			}).unwrap();
			setSelectedEmails((prev) => [...prev, response.id]);
			setNewEmail("");
			toast.info("Email has been added to your allowed list.");
		} catch (error: any) {
			toast.error(
				error.data?.error ||
					error.data?.email?.[0] ||
					"Failed to add email"
			);
		} finally {
			setIsAddingEmail(false);
		}
	};

	const isLoading = isLoadingUserEmails || isLoadingSurveyEmails;
	const hasChanges =
		JSON.stringify(selectedEmails.sort()) !==
		JSON.stringify(surveyAllowedEmails.map((e) => e.id).sort());

	const selectedEmailObjects = userAllowedEmails.filter((email) =>
		selectedEmails.includes(email.id)
	);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12 space-y-4">
				<div className="relative">
					<div className="h-12 w-12 rounded-full border-4 border-muted"></div>
					<div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
				</div>
				<p className="text-sm text-muted-foreground">
					Loading email settings...
				</p>
			</div>
		);
	}

	return (
		<div className={`space-y-4 ${className || ""}`}>
			<Card className="border-primary/20 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<UserPlus className="h-4 w-4" />
						Add New Allowed Email
					</CardTitle>
					<CardDescription>
						Add email addresses to your allowed list first, then
						select them below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-2">
						<div className="relative flex-1">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="email"
								placeholder="user@example.com"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleAddNewEmail()
								}
								disabled={isAddingEmail}
								className="pl-9"
							/>
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={handleAddNewEmail}
										disabled={
											isAddingEmail || !newEmail.trim()
										}
										size="default"
										className="gap-2 w-full sm:w-auto"
									>
										{isAddingEmail ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Send className="h-4 w-4" />
										)}
										Add
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Add email to allowed list</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-1">
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Allowed Emails
								<Badge variant="outline" className="ml-2">
									{userAllowedEmails.length} total
								</Badge>
							</CardTitle>
							<CardDescription>
								Select which emails should have access to this
								survey
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground">
								{selectedEmails.length} selected
							</span>
							<Separator orientation="vertical" className="h-4" />
							<Button
								onClick={handleSaveChanges}
								disabled={isSaving || !hasChanges}
								size="sm"
								className="gap-2"
							>
								{isSaving && (
									<Loader2 className="h-3 w-3 animate-spin" />
								)}
								{isSaving
									? "Saving..."
									: hasChanges
									? "Save Changes"
									: "Saved"}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{userAllowedEmails.length === 0 ? (
						<Alert className="bg-muted/50">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								No allowed emails configured yet. Add emails
								above to get started.
							</AlertDescription>
						</Alert>
					) : (
						<div className="space-y-2">
							<div className="grid grid-cols-1  gap-3">
								{userAllowedEmails.map(
									(email: AllowedEmail) => {
										const isSelected =
											selectedEmails.includes(email.id);
										return (
											<div
												key={email.id}
												className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
													isSelected
														? "bg-primary/5 border-primary/20"
														: "border-border hover:bg-muted/50"
												}`}
											>
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<Checkbox
														id={`email-${email.id}`}
														checked={isSelected}
														onCheckedChange={() =>
															handleToggleEmail(
																email.id
															)
														}
														className="data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
													/>
													<Label
														htmlFor={`email-${email.id}`}
														className={`font-normal cursor-pointer flex-1 flex items-center gap-2 min-w-0 ${
															isSelected
																? "text-primary"
																: ""
														}`}
													>
														<div className="p-1.5 rounded-md bg-muted shrink-0">
															<Mail className="h-3.5 w-3.5" />
														</div>
														<span className="truncate">
															{email.email}
														</span>
													</Label>
												</div>
												{isSelected && (
													<Badge
														variant="secondary"
														className="gap-1 ml-2 shrink-0"
													>
														<Check className="h-3 w-3" />
														Selected
													</Badge>
												)}
											</div>
										);
									}
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{selectedEmailObjects.length > 0 && (
				<Card className="border-green-200 bg-linear-to-b">
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<div className="p-1.5 rounded-md bg-green-100">
								<Check className="h-4 w-4 text-green-600" />
							</div>
							<span>
								Active Access
							</span>
							<Badge
								variant="outline"
								className="ml-2 bg-green-100 text-green-800 border-green-200"
							>
								{selectedEmailObjects.length}
							</Badge>
						</CardTitle>
						<CardDescription className="">
							These emails will receive invitations to this survey
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{selectedEmailObjects.map((email) => (
								<div
									key={email.id}
									className="flex items-center justify-between p-3 bg-card border border-green-200 rounded-lg hover:bg-green-50/50 transition-all group"
								>
									<div className="flex items-center gap-2 min-w-0">
										<div className="p-1 rounded bg-green-50">
											<Mail className="h-3.5 w-3.5 text-green-600" />
										</div>
										<span className="text-sm font-medium truncate">
											{email.email}
										</span>
									</div>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														handleRemoveEmail(
															email.id
														)
													}
													className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 shrink-0"
												>
													<Trash2 className="h-3.5 w-3.5" />
													<span className="sr-only">
														Remove
													</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Remove from survey</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
