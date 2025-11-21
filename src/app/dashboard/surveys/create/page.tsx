// src/app/dashboard/surveys/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateSurveyMutation } from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccessType, DisplayMode } from "@/types";

export default function CreateSurveyPage() {
	const router = useRouter();
	const [createSurvey, { isLoading }] = useCreateSurveyMutation();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		access_type: "public_anonymous" as AccessType,
		display_mode: "show_all" as DisplayMode,
		questions_per_page: 5,
		allow_multiple_responses: false,
		show_progress_bar: true,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await createSurvey(formData).unwrap();
			router.push(`/dashboard/surveys/${result.id}`);
		} catch (error) {
			console.error("Failed to create survey:", error);
			alert("Failed to create survey");
		}
	};

	return (
		<div className="container mx-auto py-8 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Create New Survey</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Title */}
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

						{/* Description */}
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

						{/* Access Type */}
						<div className="space-y-2">
							<Label htmlFor="access_type">Access Type *</Label>
							<select
								id="access_type"
								value={formData.access_type}
								onChange={(e) =>
									setFormData({
										...formData,
										access_type: e.target
											.value as AccessType,
									})
								}
								className="w-full px-3 py-2 border rounded-md"
							>
								<option value="public_anonymous">
									Public - Anonymous
								</option>
								<option value="public_authenticated">
									Public - Login Required
								</option>
								<option value="private_invited">
									Private - Invited Only
								</option>
							</select>
							<p className="text-sm text-muted-foreground">
								{formData.access_type === "public_anonymous" &&
									"Anyone with link can respond anonymously"}
								{formData.access_type ===
									"public_authenticated" &&
									"User must login to respond"}
								{formData.access_type === "private_invited" &&
									"Only invited emails can respond"}
							</p>
						</div>

						{/* Display Mode */}
						<div className="space-y-2">
							<Label htmlFor="display_mode">Display Mode *</Label>
							<select
								id="display_mode"
								value={formData.display_mode}
								onChange={(e) =>
									setFormData({
										...formData,
										display_mode: e.target
											.value as DisplayMode,
									})
								}
								className="w-full px-3 py-2 border rounded-md"
							>
								<option value="show_all">
									Show All Questions
								</option>
								<option value="one_by_one">
									One Question at a Time
								</option>
								<option value="paginated">Custom Pages</option>
							</select>
						</div>

						{/* Questions Per Page (only for paginated) */}
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

						{/* Checkboxes */}
						<div className="space-y-4">
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

						{/* Buttons */}
						<div className="flex gap-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Creating..." : "Create Survey"}
							</Button>
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
