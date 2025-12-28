// components/survey/SurveyStatusCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	TriangleAlert,
	Search,
	CheckCircle,
	LogIn,
	UserPlus,
	ArrowLeft,
	Home,
	RefreshCw,
	Share2,
	ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export type SurveyStatusType = "error" | "not_found" | "submitted";

export interface SurveyStatusCardProps {
	type: SurveyStatusType;
	title?: string;
	message?: string;
	error?: any;
	onLogin?: () => void;

	onCopyLink?: () => void;
}

export function SurveyStatusCard({
	type,
	title,
	message,
	error,
	onLogin,
	onCopyLink,
}: SurveyStatusCardProps) {
	// Get error message if error prop is provided

	const getErrorMessage = () => {
		if (!error) return message;

		if (typeof error === "string") return error;

		// Handle RTK Query error structure
		if (error.data?.error) return error.data.error;

		// Handle serialized error
		if (error.message) return error.message;

		return message || "An error occurred";
	};

	const router = useRouter();

	const displayMessage = type === "error" ? getErrorMessage() : message;
	// Safe defaults using Next.js router
	const handleGoBack = () => router.back();
	const handleGoHome = () => router.push("/");
	const handleTryAgain = () => router.refresh();

	const handleLogin =
		onLogin ||
		(() => {
			const redirectUrl = window.location.href;
			router.push(`/login?returnTo=${encodeURIComponent(redirectUrl)}`);
		});

	// Card styling based on type
	const cardStyles = {
		error: "border-destructive/20 bg-gradient-to-br from-background to-destructive/5",
		not_found: "border-border/50 bg-gradient-to-br from-card to-muted/5",
		submitted: "border-primary/20 bg-gradient-to-br from-card to-primary/5",
	};

	// Configuration for each type
	const config = {
		error: {
			icon: TriangleAlert as LucideIcon,
			iconStyle:
				"bg-destructive/10 border-destructive/5 text-destructive",
			defaultTitle: "Something Went Wrong",
			pulse: true,
			isLargeIcon: false,
		},
		not_found: {
			icon: Search as LucideIcon,
			iconStyle: "bg-muted border-muted/50 text-muted-foreground",
			defaultTitle: "Survey Not Found",
			pulse: false,
			isLargeIcon: false,
		},
		submitted: {
			icon: CheckCircle as LucideIcon,
			iconStyle: "bg-primary/10 border-primary/5 text-primary",
			defaultTitle: "Thank You! 🎉",
			pulse: false,
			isLargeIcon: true,
		},
	};

	const currentConfig = config[type];
	const Icon = currentConfig.icon;
	const isLargeIcon = currentConfig.isLargeIcon;

	return (
		<div className="container mx-auto py-8 max-w-3xl">
			<Card className={`${cardStyles[type]} shadow-lg`}>
				<CardContent className="py-16 px-6 text-center">
					{/* Success animation for submitted state */}
					{type === "submitted" && (
						<div className="absolute inset-0 overflow-hidden">
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-primary/10 rounded-full animate-ping" />
						</div>
					)}

					<div className="relative z-10">
						{/* Icon */}
						<div
							className={`inline-flex items-center justify-center rounded-full mb-6 border-8 ${
								currentConfig.iconStyle
							} ${currentConfig.pulse ? "animate-pulse" : ""} ${
								isLargeIcon ? "w-24 h-24" : "w-20 h-20"
							}`}
						>
							<Icon
								className={
									isLargeIcon ? "h-12 w-12" : "h-10 w-10"
								}
							/>
						</div>

						{/* Title */}
						<h1
							className={`text-2xl md:text-3xl font-bold mb-3 ${
								isLargeIcon ? "text-3xl md:text-4xl mb-4" : ""
							}`}
						>
							{title || currentConfig.defaultTitle}
						</h1>

						{/* Message */}
						<p
							className={`font-medium text-lg mb-6 ${
								type === "error"
									? "text-destructive"
									: type === "submitted"
									? "text-primary/80"
									: "text-muted-foreground"
							}`}
						>
							{displayMessage ||
								(type === "not_found"
									? "The survey you're looking for doesn't exist or has been removed"
									: type === "submitted"
									? "Your response has been recorded successfully"
									: "An unexpected error occurred")}
						</p>

						{/* Action Buttons */}
						<div className="space-y-4">
							{/* ERROR STATE - Check if it's an auth error */}
							{type === "error" &&
							displayMessage
								?.toLowerCase()
								.includes("logged in") ? (
								<>
									<div className="bg-muted/30 p-4 rounded-lg mb-4">
										<p className="text-sm text-muted-foreground mb-3">
											Log in to access this survey
										</p>
										<div className="flex flex-col sm:flex-row gap-2">
											<Button
												className="flex-1 gap-2"
												onClick={() => {
													if (onLogin) {
														onLogin();
													} else {
														window.location.href = `/login?returnTo=${encodeURIComponent(
															window.location.href
														)}`;
													}
												}}
											>
												<LogIn className="h-4 w-4" />
												Log In
											</Button>
											<Button
												variant="outline"
												className="flex-1 gap-2"
												onClick={() =>
													(window.location.href =
														"/register")
												}
											>
												<UserPlus className="h-4 w-4" />
												Sign Up
											</Button>
										</div>
									</div>
								</>
							) : type === "error" ? (
								// Generic error buttons
								<div className="flex flex-col sm:flex-row gap-2 justify-center">
									<Button
										onClick={handleTryAgain}
										variant="default"
										className="gap-2"
									>
										<RefreshCw className="h-4 w-4" />
										Try Again
									</Button>
									<Button
										variant="outline"
										onClick={handleGoBack}
										className="gap-2"
									>
										<ArrowLeft className="h-4 w-4" />
										Go Back
									</Button>
								</div>
							) : null}

							{/* NOT FOUND STATE */}
							{type === "not_found" && (
								<div className="flex flex-col sm:flex-row gap-2 justify-center">
									<Button
										variant="outline"
										onClick={handleGoBack}
										className="gap-2"
									>
										<ArrowLeft className="h-4 w-4" />
										Go Back
									</Button>
									<Button
										onClick={handleGoHome}
										className="gap-2"
									>
										<Home className="h-4 w-4" />
										Dashboard
									</Button>
								</div>
							)}

							{/* SUBMITTED STATE */}
							{type === "submitted" && (
								<>
									{/* Celebration emojis */}
									<div className="flex justify-center gap-1 mb-8">
										{["✨", "🎊", "🌟"].map((emoji, i) => (
											<span
												key={i}
												className="text-xl opacity-70 animate-bounce"
												style={{
													animationDelay: `${
														i * 0.1
													}s`,
												}}
											>
												{emoji}
											</span>
										))}
									</div>

									{/* Action buttons */}
									<div className="pt-6 border-t border-border/50">
										<p className="text-sm text-muted-foreground mb-4">
											What would you like to do next?
										</p>
										<div className="flex flex-col sm:flex-row gap-3 justify-center">
											<Button
												variant="outline"
												onClick={handleGoBack}
												className="gap-2"
											>
												<ArrowLeft className="h-4 w-4" />
												Go Back
											</Button>
											<Button
												onClick={handleGoHome}
												className="gap-2"
											>
												<Home className="h-4 w-4" />
												Return Home
											</Button>
										</div>

										{/* Share option */}
										<div className="mt-6 pt-4 border-t border-border/30">
											<p className="text-xs text-muted-foreground mb-2">
												Know others who might be
												interested?
											</p>
											<Button
												variant="ghost"
												size="sm"
												className="text-xs gap-1"
												onClick={
													onCopyLink ||
													(() => {
														const url =
															window.location.href.replace(
																"/submit",
																""
															);
														navigator.clipboard.writeText(
															url
														);
														// You can add a toast notification here
													})
												}
											>
												<Share2 className="h-3 w-3" />
												Copy Survey Link
											</Button>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Convenience components for each type
export const SurveyErrorCard = (props: Omit<SurveyStatusCardProps, "type">) => (
	<SurveyStatusCard type="error" {...props} />
);

export const SurveyNotFoundCard = (
	props: Omit<SurveyStatusCardProps, "type">
) => <SurveyStatusCard type="not_found" {...props} />;

export const SurveySubmittedCard = (
	props: Omit<SurveyStatusCardProps, "type">
) => <SurveyStatusCard type="submitted" {...props} />;
