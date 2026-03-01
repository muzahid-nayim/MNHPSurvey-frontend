// src/components/survey/SurveyHeader.tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUpdateSurveyStatusMutation } from "@/core/api/surveyApi";
import { useClipboard } from "@/hooks/useClipboard";
import type { Survey } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SurveyHeaderProps {
	survey: Survey;
	onEditClick: () => void;
	isLoading?: boolean;
}

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Share2,
	Copy,
	QrCode,
	Undo,
	XCircle,
	Rocket,
	Pencil,
	RefreshCw,
	ArrowLeft,
	Circle,
	Info,
	MessageSquareTextIcon,
	ArrowUpRightIcon,
} from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

import QrCodeGenerator from "./QRCodeGenerator";
import { useMemo } from "react";
import { ButtonGroup } from "../ui/button-group";

export function SurveyHeader({
	survey,
	onEditClick,
	isLoading = false,
}: SurveyHeaderProps) {
	const router = useRouter();
	const { copyToClipboard } = useClipboard();
	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
			case "closed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};
	const [updateStatus] = useUpdateSurveyStatusMutation();

	const surveyUrl = useMemo(() => {
		return `${window.location.origin}/survey/${survey.id}`;
	}, [survey.id]);

	const handleCopySurveyLink = () => {
		copyToClipboard(surveyUrl, "Survey link copied to clipboard!");
	};

	const handleStatusChange = async (newStatus: string) => {
		try {
			await updateStatus({ id: survey.id, status: newStatus }).unwrap();
			toast.update(`Survey status changed to ${newStatus}`);
		} catch (error) {
			toast.error("Failed to change survey status");
		}
	};

	const handleCloseStatus = async () => {
		try {
			handleStatusChange("closed");
		} catch (error) {
			toast.error("Failed to close survey");
		}
	};

	// Publish Handler
	const handlePublish = async () => {
		if (!survey?.questions || survey.questions.length === 0) {
			toast.info("Add at least one question before publishing");
			return;
		}

		try {
			await updateStatus({ id: survey.id, status: "active" }).unwrap();
			toast.success("Survey published!");
		} catch (error) {
			toast.error("Failed to publish survey");
		}
	};

	const handleChangeStatus = async (newStatus: "active" | "draft") => {
		try {
			handleStatusChange(newStatus);
		} catch (error) {
			toast.error(`Failed to change survey status to ${newStatus}`);
		}
	};

	return (
		<div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
			{/* Header with title, description and status */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						{survey?.title}
					</h1>
					{survey?.description && (
						<p className="text-muted-foreground">
							{survey?.description}
						</p>
					)}
				</div>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
							getStatusColor(survey?.status),
						)}
					>
						<Circle className="h-2 w-2 fill-current" />
						{survey?.status?.toUpperCase()}
					</span>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-6 flex flex-wrap items-center gap-2">
				{survey?.status === "draft" && (
					<ButtonGroup className="flex items-center">
						<Button
							onClick={handlePublish}
							className="gap-2 bg-primary hover:bg-primary/90"
						>
							<Rocket className="h-4 w-4" />
							Publish Survey
						</Button>
						<Button
							variant="outline"
							onClick={onEditClick}
							className="gap-2"
						>
							<Pencil className="h-4 w-4" />
							Edit Survey Details
						</Button>
						<Button
							variant="destructive"
							onClick={handleCloseStatus}
							className="gap-2"
						>
							<XCircle className="h-4 w-4" />
							Close Survey
						</Button>
					</ButtonGroup>
				)}

				{survey?.status === "active" && (
					<>
						<ButtonGroup className="flex items-center">
							<Dialog>
								<DialogTrigger asChild>
									<Button className="justify-start gap-2 bg-green-600 hover:bg-green-700">
										<QrCode className="h-4 w-4" />
										Share
									</Button>
								</DialogTrigger>
								<DialogContent
									className="sm:max-w-md"
									onClick={(e) => e.stopPropagation()}
								>
									<DialogHeader>
										<DialogTitle>Share Survey</DialogTitle>
										<DialogDescription>
											Share this survey with respondents
										</DialogDescription>
									</DialogHeader>
									<div className="flex flex-col items-center gap-4 py-2">
										{/* Copy Link Button */}
										<Button
											onClick={() => {
												copyToClipboard(
													surveyUrl,
													"Survey link copied!",
												);
											}}
											variant="outline"
											className="w-full justify-start gap-2"
										>
											<Copy className="h-4 w-4" />
											Copy Survey Link
										</Button>

										{/* QR Code */}
										<div className="rounded-lg border bg-muted/20 p-4">
											<QrCodeGenerator
												text={surveyUrl}
												showDownload
											/>
										</div>
									</div>
								</DialogContent>
							</Dialog>

							<Button
								variant="outline"
								onClick={() => handleChangeStatus("draft")}
							>
								<Undo className="h-4 w-4" />
								Revert to Draft
							</Button>
							<Button
								variant="destructive"
								onClick={handleCloseStatus}
							>
								<XCircle className="h-4 w-4" />
								Close Survey
							</Button>
						</ButtonGroup>
					</>
				)}

				{survey?.status === "closed" && (
					<>
						<Button
							variant="outline"
							onClick={() => handleChangeStatus("draft")}
							className="gap-2"
						>
							<RefreshCw className="h-4 w-4" />
							Reopen as Draft
						</Button>
					</>
				)}

				<ButtonGroup>
					<Button
						onClick={() =>
							router.push(
								`/dashboard/surveys/${survey?.id}/responses`,
							)
						}
					>
						<MessageSquareTextIcon className="h-3.5 w-3.5 shrink-0" />
						
						View Responses
					</Button>
					<Button
						variant="outline"
						onClick={() => router.push("/dashboard/surveys")}
						className="gap-2"
					>
						<ArrowUpRightIcon className="h-4 w-4" />
						Back to Surveys
					</Button>
				</ButtonGroup>
			</div>

			{/* Status Note with Icon */}
			<div className="mt-4">
				{survey?.status === "draft" ? (
					<p className="flex items-center gap-2 text-base text-orange-600">
						<Info className="h-4 w-4" />
						Note: The survey is currently in draft mode and not
						visible to respondents.
					</p>
				) : survey?.status === "closed" ? (
					<p className="flex items-center gap-2 text-base text-red-600">
						<Info className="h-4 w-4" />
						Note: The survey is closed and no longer accepting
						responses.
					</p>
				) : (
					<p className="flex items-center gap-2 text-base text-green-600">
						<Info className="h-4 w-4" />
						Note: The survey is active and accepting responses.
					</p>
				)}
			</div>
		</div>
	);
}
