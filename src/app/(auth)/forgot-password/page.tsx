// app/forgot-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { usePasswordResetRequestMutation } from "@/core/api/authApi";
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
import { Mail, ArrowLeft, SquarePen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/logo";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [passwordResetRequest, { isLoading, isError, error, isSuccess }] =
		usePasswordResetRequestMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await passwordResetRequest({ email }).unwrap();
		} catch (err) {
			console.error("Password reset request failed:", err);
		}
	};

	const getErrorMessage = () => {
		if (error) {
			if ("data" in error) {
				const errorData = error.data as Record<string, string>;
				return (
					errorData.message ||
					errorData.detail ||
					"Failed to send reset email. Please try again."
				);
			}
		}
		return "Failed to send reset email. Please try again.";
	};

	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					Loading...
				</div>
			}
		>
			<ForgotPasswordContent
				email={email}
				setEmail={setEmail}
				isLoading={isLoading}
				isError={isError}
				isSuccess={isSuccess}
				getErrorMessage={getErrorMessage}
				handleSubmit={handleSubmit}
			/>
		</Suspense>
	);
}

function ForgotPasswordContent({
	email,
	setEmail,
	isLoading,
	isError,
	isSuccess,
	getErrorMessage,
	handleSubmit,
}: {
	email: string;
	setEmail: (val: string) => void;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	getErrorMessage: () => string;
	handleSubmit: (e: React.FormEvent) => void;
}) {
	return (
		<div className="min-h-screen flex items-center justify-center ">
			<div className="w-full max-w-lg">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-flex items-center space-x-2 mb-4"
					>
						
						<Logo />
					</Link>
					<p className="text-muted-foreground">Reset your password</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl text-center text-foreground">
							Forgot Password?
						</CardTitle>
						<CardDescription className="text-center">
							{isSuccess
								? "Check your email for reset instructions"
								: "Enter your email to receive a password reset link"}
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
									If an account exists with {email}, you will
									receive password reset instructions shortly.
								</p>
								<div className="space-y-3">
									<Button
										onClick={() => setEmail("")}
										variant="outline"
										className="w-full border-border/50"
									>
										Send Another Reset Link
									</Button>
									<Link href="/login" className="block">
										<Button
											variant="ghost"
											className="w-full"
										>
											Back to Login
										</Button>
									</Link>
								</div>
							</div>
						) : (
							<>
								{isError && (
									<Alert
										variant="destructive"
										className="border-red-200 dark:border-red-800"
									>
										<AlertDescription>
											{getErrorMessage()}
										</AlertDescription>
									</Alert>
								)}

								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-foreground"
										>
											Email Address
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="email"
												type="email"
												placeholder="Enter your email"
												value={email}
												onChange={(e) =>
													setEmail(e.target.value)
												}
												className="pl-10 bg-background/50 border-border/50 focus:border-primary text-sm md:text-base"
												required
												disabled={isLoading}
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-linear-to-r from-gradient-l to-gradient-r  hover:from-gradient-l/50 hover:to-gradient-r/50 text-white transition-all shadow-sm hover:shadow-md"
										disabled={isLoading}
										size="lg"
									>
										{isLoading
											? "Sending Reset Link..."
											: "Send Reset Link"}
									</Button>
								</form>

								<div className="text-center">
									<Link href="/login">
										<Button
											variant="ghost"
											className="w-full"
											disabled={isLoading}
										>
											<ArrowLeft className="mr-2 h-4 w-4" />
											Back to Login
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
