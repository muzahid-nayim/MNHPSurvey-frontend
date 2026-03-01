"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteAccountMutation } from "@/core/api/authApi";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/core/store/slices/authSlice";

interface DeleteAccountFormData {
	password: string;
}

export function DeleteAccountForm() {
	const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
	const [showPassword, setShowPassword] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<DeleteAccountFormData>({
		mode: "onBlur",
	});

	const onSubmit = async (data: DeleteAccountFormData) => {
		try {
			await deleteAccount({ password: data.password }).unwrap();

			toast.success("Account deleted successfully");

			// Clear auth
			dispatch(logout());
			localStorage.removeItem("auth");

			// Redirect to home
			setTimeout(() => {
				router.push("/");
			}, 500);
		} catch (error: unknown) {
			const errorData = (error as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			const errorMessage =
				String(errorData?.error) ||
				String(errorData?.message) ||
				"Failed to delete account";
			toast.error(errorMessage);
			reset();
		}
	};

	return (
		<Card className="border-red-200 dark:border-red-600">
			<CardHeader>
				<CardTitle className="text-red-700">Danger Zone</CardTitle>
				<CardDescription>
					Delete your account and all associated data
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-red-600 mb-4">
					⚠️ Deleting your account is permanent and cannot be undone.
					All your surveys, responses, and personal data will be
					deleted.
				</p>

				<AlertDialog open={open} onOpenChange={setOpen}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" className="gap-2">
							<Trash2 className="h-4 w-4" />
							Delete Account
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Account?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. Please enter your
								password to confirm deletion of your account and
								all associated data.
							</AlertDialogDescription>
						</AlertDialogHeader>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="password">
									Confirm Password
								</Label>
								<div className="relative">
									<Input
										{...register("password", {
											required: "Password is required",
											minLength: {
												value: 6,
												message:
													"Password must be at least 6 characters",
											},
										})}
										type={
											showPassword ? "text" : "password"
										}
										id="password"
										placeholder="Enter your password"
										disabled={isLoading}
										className="pr-10"
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<AlertCircle className="h-3 w-3" />
										{errors.password.message}
									</p>
								)}
							</div>

							<AlertDialogFooter>
								<AlertDialogCancel disabled={isLoading}>
									Cancel
								</AlertDialogCancel>
								<Button
									type="submit"
									variant="destructive"
									disabled={isLoading}
								>
									{isLoading
										? "Deleting..."
										: "Delete My Account"}
								</Button>
							</AlertDialogFooter>
						</form>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
