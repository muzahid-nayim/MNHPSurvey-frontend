// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useLoginMutation } from "@/core/api/authApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import Link from "next/link";

// Shadcn UI Components
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
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { setCredentials } from "@/core/store/slices/authSlice";
import { useAppDispatch } from "@/core/store/hooks";
import { toast } from "react-toastify";
import Logo from "@/components/common/logo";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [login, { isLoading, isError, error }] = useLoginMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			const redirectTo = searchParams.get("redirect") || "/dashboard";
			router.push(redirectTo);
		}
	}, [isAuthenticated, router, pathname, searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await login({ email, password }).unwrap();
			dispatch(
				setCredentials({
					user: response.user,
					accessToken: response.access,
					refreshToken: response.refresh,
				}),
			);
			const redirectTo = searchParams.get("redirect") || searchParams.get("returnTo") || "/dashboard";
			router.push(redirectTo);
		} catch (err) {
			if ((err as FetchBaseQueryError)?.data) {
				const errorData = (err as FetchBaseQueryError).data as any;
				const message = errorData?.error?.[0] || "Login failed";
				toast.error(message);
			}
		}
	};

	// Extract error message from RTK Query error
	const getErrorData = () => {
		if (!error || !("data" in error)) return null;

		const data = error.data as any;

		const message =
			data?.error?.[0] ||
			data?.message ||
			data?.detail ||
			"Login failed. Please check your credentials.";

		return {
			message,
			isEmailNotVerified:
				message ===
				"Email not verified. Please verify your email before logging in.",
		};
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<Logo />
					<p className="text-muted-foreground mt-2">
						Sign in to your account
					</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl text-center text-foreground">
							Welcome back
						</CardTitle>
						<CardDescription className="text-center">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Error Alert */}
						{isError && (
							<Alert
								variant="destructive"
								className="border-red-200 dark:border-red-800"
							>
								<AlertDescription className="flex items-center gap-2">
									{(() => {
										const errorData = getErrorData();
										if (!errorData) return null;

										return (
											<>
												<span className="flex-1">
													{errorData.message}
												</span>

												{errorData.isEmailNotVerified && (
													<Link
														href="/verify-email"
														className="underline font-medium"
													>
														Verify Email
													</Link>
												)}
											</>
										);
									})()}
								</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email Field */}
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
										className="text-sm md:text-base pl-10 bg-background/50 border-border/50 focus:border-primary"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label
										htmlFor="password"
										className="text-foreground"
									>
										Password
									</Label>
									<Link
										href="/forgot-password"
										className="text-sm text-primary hover:text-primary/80 transition-colors"
									>
										Forgot password?
									</Link>
								</div>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Enter your password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="text-sm md:text-base pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
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

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full bg-linear-to-r from-gradient-l to-gradient-r  hover:from-gradient-l/50 hover:to-gradient-r/50 text-white transition-all shadow-sm hover:shadow-md"
								disabled={isLoading}
								size="lg"
							>
								{isLoading ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
										Signing in...
									</>
								) : (
									<>
										Sign In
										<ArrowRight className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border/50" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">
									New to MNHPSurvey?
								</span>
							</div>
						</div>

						{/* Sign Up Link */}
						<div className="text-center">
							<Link href="/signup">
								<Button
									variant="outline"
									className="w-full border-border/50"
									disabled={isLoading}
								>
									Create an account
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Additional Links */}
				<div className="text-center mt-6 space-y-2">
					<p className="text-sm text-muted-foreground">
						By continuing, you agree to our{" "}
						<Link
							href="/terms"
							className="text-primary hover:text-primary/80 transition-colors"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/terms"
							className="text-primary hover:text-primary/80 transition-colors"
						>
							Privacy Policy
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
