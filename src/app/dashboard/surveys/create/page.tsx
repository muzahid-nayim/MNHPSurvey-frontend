/**
 * ============================================================
 * Survey Creation Page Component
 * ============================================================
 *
 * Path: src/app/dashboard/surveys/create/page.tsx
 *
 * Description:
 * This component provides a comprehensive form for users to create
 * new surveys with customizable settings including access control,
 * display modes, and email-based access restrictions.
 *
 * Key Features:
 * - Survey metadata (title, description)
 * - Access type selection (public/private)
 * - Private survey email configuration
 * - Display mode options (all, paginated, one-by-one)
 * - Response settings (multiple responses, progress bar)
 *
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	useCreateSurveyMutation,
	useGetAllowedEmailsQuery,
	useAddSurveyAllowedEmailsMutation,
} from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";
import type {
	AccessType,
	CreateSurveyRequest,
	DisplayMode,
	AllowedEmail,
} from "@/types";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function CreateSurveyPage() {
	// ==========================
	// ##### ROUTER & HOOKS #####
	// ==========================
	const router = useRouter();

	// API Mutations & Queries
	const [createSurvey, { isLoading: isCreating }] = useCreateSurveyMutation();
	const [addEmails, { isLoading: isAddingEmails }] =
		useAddSurveyAllowedEmailsMutation();
	const { data: userAllowedEmails = [], isLoading: isLoadingEmails } =
		useGetAllowedEmailsQuery();

	// ==========================
	// ###### LOCAL STATES ######
	// ==========================
	// Track selected emails for private surveys
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

	// Main form data state with initial configuration
	const [formData, setFormData] = useState<CreateSurveyRequest>({
		title: "",
		description: "",
		access_type: "public_anonymous" as AccessType,
		display_mode: "show_all" as DisplayMode,
		questions_per_page: 5,
		allow_multiple_responses: false,
		show_progress_bar: true,
	});

	// ==========================
	// ##### EVENT HANDLERS #####
	// ==========================
	/**
	 * Handles survey submission with email configuration for private surveys
	 * - Creates survey record
	 * - Configures email access if survey is private
	 * - Redirects to surveys list on success
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await createSurvey(formData).unwrap();

			// Configure email access for private surveys
			if (formData.access_type === "private_invited") {
				if (selectedEmails.length === 0) {
					toast.error(
						"Please select at least one email for private survey"
					);
					return;
				}

				await addEmails({
					surveyId: result.id,
					allowed_email_ids: selectedEmails,
				}).unwrap();

				toast.success("Survey created and emails configured!");
			} else {
				toast.success("Survey created successfully!");
			}

			router.push(`/dashboard/surveys/`);
		} catch (error: any) {
			console.error("Failed to create survey:", error);
			toast.error(error?.data?.error || "Failed to create survey");
		}
	};

	/**
	 * Toggles email selection for private survey access
	 * @param emailId - The email ID to toggle
	 */
	const toggleEmailSelection = (emailId: string) => {
		setSelectedEmails((prev) =>
			prev.includes(emailId)
				? prev.filter((id) => id !== emailId)
				: [...prev, emailId]
		);
	};

	// ==========================
	// ###### DERIVED STATE ######
	// ==========================
	// Determine if submit button should be disabled
	const isSubmitDisabled =
		isCreating ||
		isAddingEmails ||
		!formData.title.trim() ||
		(formData.access_type === "private_invited" &&
			selectedEmails.length === 0);

	return (
		<div className="container mx-auto py-8 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Create New Survey</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* ======================== */}
						{/* SURVEY METADATA SECTION */}
						{/* ======================== */}

						{/* Survey Title Input - Required field */}
						<div className="space-y-2">
							<Label htmlFor="title">Survey Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
								placeholder="Customer Satisfaction Survey"
								required
							/>
						</div>

						{/* Survey Description - Optional textarea */}
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								placeholder="Tell us about your experience..."
								className="w-full min-h-[100px] px-3 py-2 border rounded-md"
							/>
						</div>

						{/* ======================== */}
						{/* ACCESS CONTROL SECTION */}
						{/* ======================== */}

						{/* Access Type Selection */}
						<div className="space-y-2">
							<Label htmlFor="access_type">Access Type *</Label>
							<Select
								value={formData.access_type}
								onValueChange={(value) =>
									setFormData({
										...formData,
										access_type: value as AccessType,
									})
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select access type" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="public_anonymous">
											Public - Anonymous
										</SelectItem>
										<SelectItem value="public_authenticated">
											Public - Login Required
										</SelectItem>
										<SelectItem value="private_invited">
											Private - Selected Emails Only
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							{/* Contextual help text based on selected access type */}
							<p className="text-sm text-muted-foreground">
								{formData.access_type === "public_anonymous" &&
									"Anyone with link can respond anonymously"}
								{formData.access_type ===
									"public_authenticated" &&
									"User must login to respond"}
								{formData.access_type === "private_invited" &&
									"Only users with selected emails can access"}
							</p>
						</div>

						{/* ============================ */}
						{/* EMAIL SELECTION SECTION */}
						{/* (Only visible for private surveys) */}
						{/* ============================ */}
						{formData.access_type === "private_invited" && (
							<div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<Label className="font-semibold text-blue-900">
									Select Allowed Emails *
								</Label>

								{/* Loading state */}
								{isLoadingEmails ? (
									<div className="flex items-center justify-center py-4">
										<Loader2 className="h-5 w-5 animate-spin text-blue-900" />
									</div>
								) : userAllowedEmails.length === 0 ? (
									/* No emails configured state */
									<div className="p-3 bg-blue-100 rounded text-sm text-blue-900">
										<p className="font-medium">
											No allowed emails configured yet.
										</p>
										<p className="text-xs mt-1">
											Go to your profile dashboard to add
											emails first.
										</p>
									</div>
								) : (
									/* Email list with checkboxes */
									<div className="space-y-2">
										{userAllowedEmails.map(
											(email: AllowedEmail) => (
												<div
													key={email.id}
													className="flex items-center gap-3 p-3 border rounded hover:bg-blue-100 transition cursor-pointer"
													onClick={() =>
														toggleEmailSelection(
															email.id
														)
													}
												>
													<input
														type="checkbox"
														id={`email-${email.id}`}
														checked={selectedEmails.includes(
															email.id
														)}
														onChange={() =>
															toggleEmailSelection(
																email.id
															)
														}
														className="w-4 h-4 rounded cursor-pointer"
													/>
													<label
														htmlFor={`email-${email.id}`}
														className="flex-1 font-medium cursor-pointer text-blue-900"
													>
														{email.email}
													</label>
													{/* Visual indicator for selected emails */}
													{selectedEmails.includes(
														email.id
													) && (
														<Badge className="bg-green-100 text-green-800">
															<Check className="h-3 w-3" />
														</Badge>
													)}
												</div>
											)
										)}
									</div>
								)}

								{/* Selection summary */}
								{selectedEmails.length > 0 && (
									<div className="mt-3 p-3 bg-green-100 rounded-lg">
										<p className="text-sm font-medium text-green-900">
											✓ {selectedEmails.length} email(s)
											selected
										</p>
									</div>
								)}
							</div>
						)}

						{/* ======================== */}
						{/* DISPLAY SETTINGS SECTION */}
						{/* ======================== */}

						{/* Display Mode Selection */}
						<div className="space-y-2">
							<Label htmlFor="display_mode">Display Mode *</Label>
							<Select
								value={formData.display_mode}
								onValueChange={(value) =>
									setFormData({
										...formData,
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

						{/* Questions Per Page - Only visible for paginated mode */}
						{formData.display_mode === "paginated" && (
							<div className="space-y-2">
								<Label htmlFor="questions_per_page">
									Questions Per Page
								</Label>
								<Input
									id="questions_per_page"
									type="number"
									min="1"
									max="20"
									value={formData.questions_per_page}
									onChange={(e) =>
										setFormData({
											...formData,
											questions_per_page: parseInt(
												e.target.value
											),
										})
									}
								/>
							</div>
						)}

						{/* ======================== */}
						{/* RESPONSE OPTIONS SECTION */}
						{/* ======================== */}
						<div className="space-y-4">
							{/* Allow multiple responses per user */}
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="allow_multiple_responses"
									checked={formData.allow_multiple_responses}
									onChange={(e) =>
										setFormData({
											...formData,
											allow_multiple_responses:
												e.target.checked,
										})
									}
								/>
								<Label htmlFor="allow_multiple_responses">
									Allow multiple responses from same user
								</Label>
							</div>

							{/* Show progress bar option */}
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="show_progress_bar"
									checked={formData.show_progress_bar}
									onChange={(e) =>
										setFormData({
											...formData,
											show_progress_bar: e.target.checked,
										})
									}
								/>
								<Label htmlFor="show_progress_bar">
									Show progress bar
								</Label>
							</div>
						</div>

						{/* ======================== */}
						{/* ACTION BUTTONS SECTION */}
						{/* ======================== */}
						<div className="flex gap-4">
							{/* Submit button with loading state */}
							<Button type="submit" disabled={isSubmitDisabled}>
								{isCreating || isAddingEmails ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Survey"
								)}
							</Button>

							{/* Cancel button */}
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
