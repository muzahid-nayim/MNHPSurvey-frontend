// app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRegisterMutation } from "@/core/api/authApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
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
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	ArrowRight,
	SquarePen,
	Check,
	X,
} from "lucide-react";
import { toast } from "react-toastify";
import Logo from "@/components/common/logo";

export default function RegisterPage() {
	const [formState, setFormState] = useState({
		username: "",
		email: "",
		password: "",
		password2: "",
		firstName: "",
		lastName: "",
	});

	// useEffect(() => {
	// 	console.log("formState", formState);
	// },[formState])

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [register, { isLoading, isError, error }] = useRegisterMutation();
	const router = useRouter();
	const { isAuthenticated, user, loading } = useSelector(
		(state: RootState) => state.auth,
	);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			const redirectTo = searchParams.get("redirect") || "/dashboard";
			router.push(redirectTo);
		}
	}, [isAuthenticated, router, pathname, searchParams]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear password error when user starts typing
		if ((name === "password" || name === "password2") && passwordError) {
			setPasswordError("");
		}
	};

	const validatePassword = () => {
		if (formState.password !== formState.password2) {
			setPasswordError("Passwords do not match");
			return false;
		}
		if (formState.password.length < 8) {
			setPasswordError("Password must be at least 8 characters");
			return false;
		}
		setPasswordError("");
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validatePassword()) {
			return;
		}
		if (passwordStrength < 3) {
			toast.warn("Must contain 8 characters, 1 number, 1 symbol");
			return;
		}

		try {
			await register({
				username: formState.username,
				email: formState.email,
				password: formState.password,
				password2: formState.password2,
				first_name: formState.firstName || undefined,
				last_name: formState.lastName || undefined,
			}).unwrap();
			// router.push("/verify-email");
			router.push(
				`/verify-email-sent?email=${encodeURIComponent(formState.email)}`,
			);
		} catch (err: any) {
			// console.error("Registration failed:", err);
			toast.error(getErrorMessage());
		}
	};

	// Password strength indicator
	const getPasswordStrength = () => {
		if (!formState.password) return 0;
		let strength = 0;
		if (formState.password.length >= 8) strength++;
		if (/[A-Z]/.test(formState.password)) strength++;
		if (/[0-9]/.test(formState.password)) strength++;
		if (/[^A-Za-z0-9]/.test(formState.password)) strength++;
		return strength;
	};

	const passwordStrength = getPasswordStrength();
	const strengthColors = [
		"bg-red-500",
		"bg-orange-500",
		"bg-yellow-500",
		"bg-green-500",
	];

	// Extract error message from RTK Query error
	const getErrorMessage = () => {
		if (error) {
			if ("data" in error) {
				const errorData = error.data as any;
				if (errorData.message) return errorData.message;
				if (errorData.detail) return errorData.detail;
				if (typeof errorData === "object") {
					// Handle field-specific errors
					const fieldErrors = Object.values(errorData).flat();
					return fieldErrors.join(", ");
				}
			}
			return "Registration failed. Please check your information and try again.";
		}
		return "Registration failed. Please check your information and try again.";
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<Logo/>
					<p className="text-muted-foreground">Create your account</p>
				</div>

				<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl text-center text-foreground">
							Join MNHPSurvey
						</CardTitle>
						<CardDescription className="text-center">
							Create your account to start building powerful
							surveys
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Error Alert */}
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
							{/* Name Fields */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="firstName"
										className="text-foreground"
									>
										First Name
									</Label>
									<Input
										id="firstName"
										name="firstName"
										type="text"
										placeholder="First name"
										value={formState.firstName}
										onChange={handleChange}
										className="bg-background/50 border-border/50 focus:border-primary"
										disabled={isLoading}
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="lastName"
										className="text-foreground"
									>
										Last Name
									</Label>
									<Input
										id="lastName"
										name="lastName"
										type="text"
										placeholder="Last name"
										value={formState.lastName}
										onChange={handleChange}
										className="bg-background/50 border-border/50 focus:border-primary"
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Username Field */}
							<div className="space-y-2">
								<Label
									htmlFor="username"
									className="text-foreground"
								>
									Username
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="username"
										name="username"
										type="text"
										placeholder="Choose a username"
										value={formState.username}
										onChange={handleChange}
										className="pl-10 bg-background/50 border-border/50 focus:border-primary"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

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
										name="email"
										type="email"
										placeholder="Enter your email"
										value={formState.email}
										onChange={handleChange}
										className="pl-10 bg-background/50 border-border/50 focus:border-primary"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-foreground"
								>
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Create a password"
										value={formState.password}
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

								{/* Password Strength Indicator */}
								{formState.password && (
									<div className="space-y-2">
										<div className="flex gap-1">
											{[0, 1, 2, 3].map((index) => (
												<div
													key={index}
													className={`h-1 flex-1 rounded-full transition-all ${
														index < passwordStrength
															? strengthColors[
																	passwordStrength -
																		1
																]
															: "bg-muted"
													}`}
												/>
											))}
										</div>
										<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
											<div className="flex items-center gap-1">
												{formState.password.length >=
												8 ? (
													<Check className="h-3 w-3 text-green-500" />
												) : (
													<X className="h-3 w-3 text-red-500" />
												)}
												<span>8+ characters</span>
											</div>
											<div className="flex items-center gap-1">
												{/[A-Z]/.test(
													formState.password,
												) ? (
													<Check className="h-3 w-3 text-green-500" />
												) : (
													<X className="h-3 w-3 text-red-500" />
												)}
												<span>Uppercase</span>
											</div>
											<div className="flex items-center gap-1">
												{/[0-9]/.test(
													formState.password,
												) ? (
													<Check className="h-3 w-3 text-green-500" />
												) : (
													<X className="h-3 w-3 text-red-500" />
												)}
												<span>Number</span>
											</div>
											<div className="flex items-center gap-1">
												{/[^A-Za-z0-9]/.test(
													formState.password,
												) ? (
													<Check className="h-3 w-3 text-green-500" />
												) : (
													<X className="h-3 w-3 text-red-500" />
												)}
												<span>Special Character</span>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Confirm Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password2"
									className="text-foreground"
								>
									Confirm Password
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
										placeholder="Confirm your password"
										value={formState.password2}
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
												!showConfirmPassword,
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
										Creating account...
									</>
								) : (
									<>
										Create Account
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
									Already have an account?
								</span>
							</div>
						</div>

						{/* Login Link */}
						<div className="text-center">
							<Link href="/login">
								<Button
									variant="outline"
									className="w-full border-border/50"
									disabled={isLoading}
								>
									Sign in to your account
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Additional Links */}
				<div className="text-center mt-6 space-y-2">
					<p className="text-sm text-muted-foreground">
						By creating an account, you agree to our{" "}
						<Link
							href="/terms"
							className="text-primary hover:text-primary/80 transition-colors"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
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
