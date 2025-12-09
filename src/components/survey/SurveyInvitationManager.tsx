// components/survey/SurveyAllowedEmailsManager.tsx
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import {
	useGetAllowedEmailsQuery,
	useGetSurveyAllowedEmailsQuery,
	useAddSurveyAllowedEmailsMutation,
	useRemoveSurveyAllowedEmailMutation,
} from "@/core/api/surveyApi";
import type { AllowedEmail } from "@/types";

interface Props {
	surveyId: string;
	accessType: string;
}

export default function SurveyAllowedEmailsManager({
	surveyId,
	accessType,
}: Props) {
	// Only render for private invited surveys
	if (accessType !== "private_invited") return null;

	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const initializedRef = useRef(false);

	const { data: userAllowedEmails = [], isLoading: isLoadingUserEmails } =
		useGetAllowedEmailsQuery();
	const { data: surveyAllowedEmails = [], isLoading: isLoadingSurveyEmails } =
		useGetSurveyAllowedEmailsQuery(surveyId);
	const [addEmails] = useAddSurveyAllowedEmailsMutation();
	const [removeEmail] = useRemoveSurveyAllowedEmailMutation();

	// Initialize selected emails from survey (only once)
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

			toast.success("Survey access updated successfully!");
		} catch (error: any) {
			toast.error(error.data?.error || "Failed to update survey access");
			// Revert to previous state on error
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
			toast.success("Email removed from survey");
		} catch (error: any) {
			toast.error(error.data?.error || "Failed to remove email");
		}
	};

	const isLoading = isLoadingUserEmails || isLoadingSurveyEmails;
	const hasChanges =
		JSON.stringify(selectedEmails.sort()) !==
		JSON.stringify(surveyAllowedEmails.map((e) => e.id).sort());

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Select Allowed Emails */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Select Allowed Emails
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{userAllowedEmails.length === 0 ? (
						<div className="p-6 bg-muted rounded-lg text-center space-y-3">
							<p className="text-muted-foreground">
								No allowed emails configured yet.
							</p>
							<p className="text-sm text-muted-foreground">
								Go to your profile to add emails that can access
								private surveys.
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{userAllowedEmails.map((email: AllowedEmail) => (
								<div
									key={email.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
								>
									<div className="flex items-center gap-3 flex-1">
										<input
											type="checkbox"
											id={`email-${email.id}`}
											checked={selectedEmails.includes(
												email.id
											)}
											onChange={() =>
												handleToggleEmail(email.id)
											}
											className="w-4 h-4 rounded"
										/>
										<label
											htmlFor={`email-${email.id}`}
											className="font-medium cursor-pointer flex-1"
										>
											{email.email}
										</label>
									</div>
									{selectedEmails.includes(email.id) && (
										<Badge className="bg-green-100 text-green-800">
											<Check className="h-3 w-3 mr-1" />
											Selected
										</Badge>
									)}
								</div>
							))}
						</div>
					)}

					{userAllowedEmails.length > 0 && (
						<Button
							onClick={handleSaveChanges}
							disabled={isSaving || !hasChanges}
							className="w-full"
						>
							{isSaving && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSaving
								? "Updating..."
								: hasChanges
								? "Save Changes"
								: "No Changes"}
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Currently Selected Emails */}
			{selectedEmails.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Emails with Access ({selectedEmails.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{userAllowedEmails
								.filter((email) =>
									selectedEmails.includes(email.id)
								)
								.map((email) => (
									<div
										key={email.id}
										className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
									>
										<span className="text-sm font-medium">
											{email.email}
										</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleRemoveEmail(email.id)
											}
											className="text-destructive hover:text-destructive h-6 w-6 p-0"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
