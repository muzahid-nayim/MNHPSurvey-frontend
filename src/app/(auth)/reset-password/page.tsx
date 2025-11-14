// app/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePasswordResetConfirmMutation } from "@/core/api/authApi";
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

function ResetPasswordContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [formData, setFormData] = useState({
		password: "",
		password2: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState("");

	const [passwordResetConfirm, { isLoading, isError, error, isSuccess }] =
		usePasswordResetConfirmMutation();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (passwordError) setPasswordError("");
	};

	const validateForm = () => {
		if (!token) {
			setPasswordError(
				"Reset token is missing. Please use the link from your email."
			);
			return false;
		}
		if (formData.password !== formData.password2) {
			setPasswordError("Passwords do not match");
			return false;
		}
		if (formData.password.length < 8) {
			setPasswordError("Password must be at least 8 characters");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await passwordResetConfirm({
				token: token!,
				password: formData.password,
				password2: formData.password2,
			}).unwrap();
		} catch (err) {
			console.error("Password reset failed:", err);
		}
	};

	const getErrorMessage = () => {
		if (error) {
			if ("data" in error) {
				const errorData = error.data as any;
				return (
					errorData.message ||
					errorData.detail ||
					"Password reset failed. The link may be invalid or expired."
				);
			}
		}
		return "Password reset failed. The link may be invalid or expired.";
	};

	if (!token) {
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
					</div>

					<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
						<CardContent className="py-12 text-center">
							<Alert
								variant="destructive"
								className="border-red-200 dark:border-red-800"
							>
								<AlertDescription>
									Invalid reset link. Please check your email
									for the correct link or request a new one.
								</AlertDescription>
							</Alert>
							<Link
								href="/forgot-password"
								className="block mt-6"
							>
								<Button className="w-full">
									Request New Reset Link
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isSuccess) {
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
					</div>

					<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
						<CardContent className="py-12 text-center space-y-6">
							<div className="flex justify-center">
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
									<CheckCircle2 className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<div>
								<h3 className="text-xl font-semibold text-foreground mb-2">
									Password Reset Successful
								</h3>
								<p className="text-muted-foreground">
									Your password has been successfully reset.
									You can now log in with your new password.
								</p>
							</div>
							<Link href="/login">
								<Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
									Continue to Login
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

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
					<p className="text-muted-foreground">Create new password</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl text-center text-foreground">
							Reset Password
						</CardTitle>
						<CardDescription className="text-center">
							Enter your new password below
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
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

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-foreground"
								>
									New Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Enter new password"
										value={formData.password}
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
											setShowPassword(!showPassword)
										}
										disabled={isLoading}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="password2"
									className="text-foreground"
								>
									Confirm New Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password2"
										name="password2"
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										placeholder="Confirm new password"
										value={formData.password2}
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
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
										disabled={isLoading}
									>
										{showConfirmPassword ? (
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
									? "Resetting Password..."
									: "Reset Password"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center">
					<div className="text-center">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			}
		>
			<ResetPasswordContent />
		</Suspense>
	);
}
