// src/app/(auth)/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	useVerifyEmailMutation,
	useResendVerificationMutation,
} from "@/core/api/authApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	CheckCircle2,
	XCircle,
	Loader2,
	Mail,
	ArrowRight,
	ShieldCheck,
} from "lucide-react";
import Logo from "@/components/common/logo";

function VerifyEmailContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [verifyEmail] = useVerifyEmailMutation();
	const [resendVerification, { isLoading: isResending }] =
		useResendVerificationMutation();

	const [status, setStatus] = useState<
		"verifying" | "success" | "error" | "resend"
	>("verifying");
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const verify = async () => {
			if (!token) {
				setStatus("resend");
				return;
			}

			try {
				const result = await verifyEmail({
					token,
				}).unwrap();
				setStatus("success");
				setMessage(
					result.message ||
						"Your email has been successfully verified. You can now access all features of MNHPSurvey.",
				);
			} catch (err: unknown) {
				setStatus("error");
				const errorMsg = (err as Record<string, unknown>)?.data as
					| Record<string, unknown>
					| undefined;
				setMessage(
					String(errorMsg?.error) ||
						"Verification failed. The token may be invalid or expired.",
				);
			}
		};

		verify();
	}, [token, verifyEmail]);

	const handleResend = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await resendVerification({ email }).unwrap();
			setMessage(
				result.message ||
					"Verification email sent successfully. Please check your inbox.",
			);
			setStatus("success");
		} catch (err: unknown) {
			const errorMsg = (err as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			setMessage(
				String(errorMsg?.error) ||
					"Failed to resend verification email. Please try again.",
			);
		}
	};

	// Loading State
	if (status === "verifying") {
		return (
			<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{/* Logo/Brand */}
					<div className="text-center mb-8">
						<Logo />
						<p className="text-muted-foreground">
							Verifying your email
						</p>
					</div>

					<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
							<h3 className="text-lg font-semibold text-foreground mb-2">
								Verifying Your Email
							</h3>
							<p className="text-muted-foreground text-center">
								Please wait while we verify your email
								address...
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Success State
	if (status === "success") {
		return (
			<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{/* Logo/Brand */}
					<div className="text-center mb-8">
						<Logo />
					</div>

					<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
									<CheckCircle2 className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<CardTitle className="text-2xl text-foreground">
								{message}
							</CardTitle>
							<CardDescription className="text-lg">
								{ message == "Verification email sent successfully" ? "Please check your email for the verification link." : "Your email has been successfully verified. You can now access all features of MNHPSurvey." }
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							
							<div className="space-y-3">
								<Button
									onClick={() => router.push("/login")}
									className="w-full bg-linear-to-r from-gradient-l to-gradient-r  hover:from-gradient-l/50 hover:to-gradient-r/50 text-white transition-all shadow-sm hover:shadow-md"
									size="lg"
								>
									Continue to Login
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button
									onClick={() => router.push("/")}
									variant="outline"
									className="w-full border-border/50"
								>
									Back to Home
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Error State
	if (status === "error") {
		return (
			<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{/* Logo/Brand */}
					<div className="text-center mb-8">
						<Logo />
					</div>

					<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
									<XCircle className="h-8 w-8 text-red-600" />
								</div>
							</div>
							<CardTitle className="text-2xl text-foreground">
								Verification Failed
							</CardTitle>
							<CardDescription className="text-lg">
								We couldn&apos;t verify your email
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<Alert
								variant="destructive"
								className="border-red-200 dark:border-red-800"
							>
								<AlertDescription className="text-center">
									{message}
								</AlertDescription>
							</Alert>

							<div className="space-y-3">
								<Button
									onClick={() => setStatus("resend")}
									className="w-full bg-linear-to-r from-gradient-l to-gradient-r  hover:from-gradient-l/50 hover:to-gradient-r/50 text-white transition-all shadow-sm hover:shadow-md"
									size="lg"
								>
									Request New Verification Link
									<Mail className="ml-2 h-4 w-4" />
								</Button>
								<Button
									onClick={() => router.push("/")}
									variant="outline"
									className="w-full border-border/50"
								>
									Back to Home
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Resend Verification Form
	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<Logo />
					<p className="text-muted-foreground">
						Verify your email address
					</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
								<ShieldCheck className="h-8 w-8 text-blue-600" />
							</div>
						</div>
						<CardTitle className="text-2xl text-foreground">
							Verify Your Email
						</CardTitle>
						<CardDescription className="text-lg">
							Enter your email to receive a new verification link
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{message && (
							<Alert
								className={
									message.includes("successfully")
										? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
										: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
								}
							>
								<AlertDescription className="text-center">
									{message}
								</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleResend} className="space-y-4">
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
										name="email"
										type="email"
										placeholder="Enter your email address"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className="text-sm md:text-base pl-10 bg-background/50 border-border/50 focus:border-primary"
										required
										disabled={isResending}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-linear-to-r from-gradient-l to-gradient-r  hover:from-gradient-l/50 hover:to-gradient-r/50 text-white transition-all shadow-sm hover:shadow-md"
								disabled={isResending}
								size="lg"
							>
								{isResending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending Verification Email...
									</>
								) : (
									<>
										Send Verification Email
										<Mail className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
						</form>

						{/* Additional Options */}
						<div className="space-y-3 pt-4 border-t border-border/50">
							<Button
								onClick={() => router.push("/login")}
								variant="outline"
								className="w-full border-border/50"
								disabled={isResending}
							>
								Already verified? Sign In
							</Button>
							<Button
								onClick={() => router.push("/")}
								variant="ghost"
								className="w-full"
								disabled={isResending}
							>
								Back to Home
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Help Text */}
				<div className="text-center mt-6">
					<p className="text-sm text-muted-foreground">
						Didn&apos;t receive the email? Check your spam folder or
						contact support.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center">
					<div className="text-center">
						<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			}
		>
			<VerifyEmailContent />
		</Suspense>
	);
}
