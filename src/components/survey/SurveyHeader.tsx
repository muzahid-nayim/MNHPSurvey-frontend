// src/components/survey/SurveyHeader.tsx
"use client";

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
	const handleCopySurveyLink = () => {
		const url = `${window.location.origin}/survey/${survey.id}`;
		copyToClipboard(url, "Survey link copied to clipboard!");
		// console.log(url);// link is getting here and working well
		// navigator.clipboard.writeText(url);
		// alert("Survey link copied to clipboard!");
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
		<div className="mb-8">
			{/* Survey Title and Description */}
			<div className="flex justify-between items-start mb-4">
				<div>
					<h1 className="text-3xl font-bold">{survey?.title}</h1>
					<p className="text-muted-foreground">
						{survey?.description}
					</p>
				</div>
				<span
					className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
						survey?.status
					)}`}
				>
					{survey?.status?.toUpperCase()}
				</span>
			</div>

			{/* Action Buttons Based on Status */}
			<div className="flex gap-2 flex-wrap">
				{survey?.status === "draft" && (
					<>
						<Button
							onClick={handlePublish}
							className="bg-green-600 hover:bg-green-700"
						>
							Publish Survey
						</Button>
						<Button variant="outline" onClick={onEditClick}>
							Edit Survey Details
						</Button>
					</>
				)}

				{survey?.status === "active" && (
					<>
						<Button
							onClick={handleCopySurveyLink}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Copy Survey Link
						</Button>
						<Button
							variant="outline"
							onClick={() => handleChangeStatus("draft")}
						>
							Revert to Draft
						</Button>
						<Button
							variant="destructive"
							onClick={handleCloseStatus}
						>
							Close Survey
						</Button>
					</>
				)}

				{survey?.status === "closed" && (
					<>
						<Button
							variant="outline"
							onClick={() => handleChangeStatus("draft")}
						>
							Reopen as Draft
						</Button>
					</>
				)}

				<Button
					variant="outline"
					onClick={() => router.push("/dashboard/surveys")}
				>
					Back to Surveys
				</Button>
			</div>

			{survey?.status === "draft" ? (
				<p className="mt-4 text-base text-orange-500">
					Note: The survey is currently in draft mode and not visible
					to respondents.
				</p>
			) : survey?.status === "closed" ? (
				<p className="mt-4 text-base text-red-600">
					Note: The survey is closed and no longer accepting
					responses.
				</p>
			) : (
				<p className="mt-4 text-base text-green-600">
					Note: The survey is active and accepting responses.
				</p>
			)}
		</div>
	);
}
