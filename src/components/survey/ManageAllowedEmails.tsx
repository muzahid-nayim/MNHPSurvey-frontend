"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Mail, Plus, Trash2, Info } from "lucide-react";
import { toast } from "react-toastify";
import {
	useGetAllowedEmailsQuery,
	useCreateAllowedEmailMutation,
	useDeleteAllowedEmailMutation,
} from "@/core/api/surveyApi";

export default function ManageAllowedEmails() {
	const [newEmail, setNewEmail] = useState("");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [emailToDelete, setEmailToDelete] = useState<{
		id: string;
		email: string;
	} | null>(null);

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
		} catch (error: unknown) {
			const errorData = (error as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			const emailErrors = (
				errorData?.email as unknown[] | undefined
			)?.[0];
			const errorMessage =
				String(emailErrors) ||
				String(errorData?.error) ||
				"Failed to add email";
			toast.error(errorMessage);
		}
	};

	const confirmDeleteEmail = (id: string, email: string) => {
		setEmailToDelete({ id, email });
		setDeleteDialogOpen(true);
	};

	const handleDeleteEmail = async () => {
		if (!emailToDelete) return;

		try {
			await deleteEmail(emailToDelete.id).unwrap();
			toast.success("Email deleted successfully!");
			refetch();
		} catch (error: unknown) {
			const errorData = (error as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			toast.error(String(errorData?.error) || "Failed to delete email");
		} finally {
			setDeleteDialogOpen(false);
			setEmailToDelete(null);
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
			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete Allowed Email
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove{" "}
							<span className="font-semibold text-foreground">
								{emailToDelete?.email}
							</span>{" "}
							from your allowed emails? This will revoke their
							access to your private surveys.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteEmail}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
						>
							{isDeleting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Main Card */}
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
									className="text-sm md:text-base "
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
												email.created_at,
											).toLocaleDateString()}
										</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											confirmDeleteEmail(
												email.id,
												email.email,
											)
										}
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
			<Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
				<CardContent className="pt-6">
					<p className="text-sm text-blue-900 dark:text-blue-300 flex items-start gap-2">
						<Info className="h-4 w-4 mt-0.5 shrink-0" />
						Add emails here and then select which ones can access
						your private surveys when creating or editing them.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
