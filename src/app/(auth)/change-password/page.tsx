// app/change-password/page.tsx
"use client";

import { useState } from "react";
import { useChangePasswordMutation } from "@/core/api/authApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, SquarePen, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordPage() {
	const [formState, setFormState] = useState({
		old_password: "",
		new_password: "",
		new_password2: "",
	});
	const [showPasswords, setShowPasswords] = useState({
		old: false,
		new: false,
		confirm: false,
	});
	const [passwordError, setPasswordError] = useState("");

	const [changePassword, { isLoading, isError, error, isSuccess }] =
		useChangePasswordMutation();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));
		if (passwordError) setPasswordError("");
	};

	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const validateForm = () => {
		if (formState.new_password !== formState.new_password2) {
			setPasswordError("New passwords do not match");
			return false;
		}
		if (formState.new_password.length < 8) {
			setPasswordError("New password must be at least 8 characters");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await changePassword({
				old_password: formState.old_password,
				new_password: formState.new_password,
				new_password2: formState.new_password2,
			}).unwrap();
			setFormState({
				old_password: "",
				new_password: "",
				new_password2: "",
			});
		} catch (err) {
			console.error("Password change failed:", err);
		}
	};

	const getErrorMessage = () => {
		if (error) {
			if ("data" in error) {
				const errorData = error.data as any;
				return (
					errorData.message ||
					errorData.detail ||
					"Password change failed. Please check your current password."
				);
			}
		}
		return "Password change failed. Please check your current password.";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-flex items-center space-x-2 mb-4"
					>
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
							<SquarePen className="h-5 w-5 text-white" />
						</div>
						<span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							MNHPSurvey
						</span>
					</Link>
					<p className="text-muted-foreground">
						Update your password
					</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl text-center text-foreground">
							Change Password
						</CardTitle>
						<CardDescription className="text-center">
							{isSuccess
								? "Your password has been updated successfully"
								: "Enter your current and new password"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{isSuccess ? (
							<div className="text-center space-y-4">
								<div className="flex justify-center">
									<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
										<CheckCircle2 className="h-6 w-6 text-green-600" />
									</div>
								</div>
								<p className="text-muted-foreground">
									Your password has been successfully changed.
								</p>
								<div className="space-y-3">
									<Link href="/dashboard">
										<Button className="w-full">
											Back to Dashboard
										</Button>
									</Link>
									<Button
										onClick={() => window.location.reload()}
										variant="outline"
										className="w-full border-border/50"
									>
										Change Another Password
									</Button>
								</div>
							</div>
						) : (
							<>
								{(isError || passwordError) && (
									<Alert
										variant="destructive"
										className="border-red-200 dark:border-red-800"
									>
										<AlertDescription>
											{passwordError || getErrorMessage()}
										</AlertDescription>
									</Alert>
								)}

								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<div className="space-y-2">
										<Label
											htmlFor="old_password"
											className="text-foreground"
										>
											Current Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="old_password"
												name="old_password"
												type={
													showPasswords.old
														? "text"
														: "password"
												}
												placeholder="Enter current password"
												value={formState.old_password}
												onChange={handleChange}
												className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
												required
												disabled={isLoading}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
												onClick={() =>
													togglePasswordVisibility(
														"old"
													)
												}
												disabled={isLoading}
											>
												{showPasswords.old ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="new_password"
											className="text-foreground"
										>
											New Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="new_password"
												name="new_password"
												type={
													showPasswords.new
														? "text"
														: "password"
												}
												placeholder="Enter new password"
												value={formState.new_password}
												onChange={handleChange}
												className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
												required
												disabled={isLoading}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
												onClick={() =>
													togglePasswordVisibility(
														"new"
													)
												}
												disabled={isLoading}
											>
												{showPasswords.new ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="new_password2"
											className="text-foreground"
										>
											Confirm New Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="new_password2"
												name="new_password2"
												type={
													showPasswords.confirm
														? "text"
														: "password"
												}
												placeholder="Confirm new password"
												value={formState.new_password2}
												onChange={handleChange}
												className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
												required
												disabled={isLoading}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
												onClick={() =>
													togglePasswordVisibility(
														"confirm"
													)
												}
												disabled={isLoading}
											>
												{showPasswords.confirm ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-sm hover:shadow-md"
										disabled={isLoading}
										size="lg"
									>
										{isLoading
											? "Updating Password..."
											: "Change Password"}
									</Button>
								</form>

								<div className="text-center">
									<Link href="/dashboard">
										<Button
											variant="ghost"
											className="w-full"
											disabled={isLoading}
										>
											Back to Dashboard
										</Button>
									</Link>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
