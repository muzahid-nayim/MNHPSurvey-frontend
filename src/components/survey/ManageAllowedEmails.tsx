// src/components/survey/ManageAllowedEmails.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
	useGetAllowedEmailsQuery,
	useCreateAllowedEmailMutation,
	useDeleteAllowedEmailMutation,
} from "@/core/api/surveyApi";


export default function ManageAllowedEmails() {
	const [newEmail, setNewEmail] = useState("");
	const [isFormVisible, setIsFormVisible] = useState(false);

	const {
		data: allowedEmails = [],
		isLoading,
		refetch,
	} = useGetAllowedEmailsQuery();
	const [createEmail, { isLoading: isCreating }] =
		useCreateAllowedEmailMutation();
	const [deleteEmail, { isLoading: isDeleting }] =
		useDeleteAllowedEmailMutation();

	const handleAddEmail = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newEmail.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		try {
			await createEmail({ email: newEmail }).unwrap();
			toast.success("Email added successfully!");
			setNewEmail("");
			setIsFormVisible(false);
			refetch();
		} catch (error: any) {
			const errorMessage =
				error.data?.email?.[0] ||
				error.data?.error ||
				"Failed to add email";
			toast.error(errorMessage);
		}
	};

	const handleDeleteEmail = async (id: string) => {
		if (!confirm("Are you sure you want to delete this email?")) {
			return;
		}

		try {
			await deleteEmail(id).unwrap();
			toast.success("Email deleted successfully!");
			refetch();
		} catch (error: any) {
			toast.error(error.data?.error || "Failed to delete email");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Add New Email */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<Mail className="h-5 w-5" />
							Allowed Emails
						</span>
						<Button
							size="sm"
							onClick={() => setIsFormVisible(!isFormVisible)}
						>
							<Plus className="h-4 w-4 mr-1" />
							Add Email
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isFormVisible && (
						<form
							onSubmit={handleAddEmail}
							className="mb-6 p-4 bg-muted rounded-lg"
						>
							<div className="flex gap-2">
								<Input
									type="email"
									placeholder="Enter email address"
									value={newEmail}
									onChange={(e) =>
										setNewEmail(e.target.value)
									}
									disabled={isCreating}
									autoFocus
								/>
								<Button
									type="submit"
									disabled={isCreating || !newEmail.trim()}
								>
									{isCreating && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isCreating ? "Adding..." : "Add"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setIsFormVisible(false);
										setNewEmail("");
									}}
									disabled={isCreating}
								>
									Cancel
								</Button>
							</div>
						</form>
					)}

					{allowedEmails.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No emails added yet. Add emails that can access your
							private surveys.
						</p>
					) : (
						<div className="space-y-3">
							{allowedEmails.map((email) => (
								<div
									key={email.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
								>
									<div>
										<p className="font-medium">
											{email.email}
										</p>
										<p className="text-sm text-muted-foreground">
											Added:{" "}
											{new Date(
												email.created_at
											).toLocaleDateString()}
										</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											handleDeleteEmail(email.id)
										}
										disabled={isDeleting}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Info Card */}
			<Card className="bg-blue-50 border-blue-200">
				<CardContent className="pt-6">
					<p className="text-sm text-blue-900">
						<strong>💡 Tip:</strong> Add emails here and then select
						which ones can access your private surveys when creating
						or editing them.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
