// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useGetSurveysQuery } from "@/core/api/surveyApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ManageAllowedEmails from "@/components/survey/ManageAllowedEmails";
import SurveyAllowedEmailsManager from "@/components/survey/SurveyInvitationManager";
import QrCodeGenerator from "@/components/survey/QRCodeGenerator";

export default function DashboardPage() {
	const { data: surveys } = useGetSurveysQuery();

	const stats = {
		totalSurveys: surveys?.length || 0,
		activeSurveys:
			surveys?.filter((s) => s.status === "active").length || 0,
		totalResponses:
			surveys?.reduce((sum, s) => sum + s.response_count, 0) || 0,
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Dashboard</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader>
						<CardTitle>Total Surveys</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">
							{stats.totalSurveys}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Active Surveys</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">
							{stats.activeSurveys}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Total Responses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">
							{stats.totalResponses}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Get started with your surveys
					</CardDescription>
				</CardHeader>
				<CardContent className="flex gap-4">
					<Link href="/dashboard/surveys/create">
						<Button>Create New Survey</Button>
					</Link>
					<Link href="/dashboard/surveys">
						<Button variant="outline">View All Surveys</Button>
					</Link>
				</CardContent>
			</Card>

			<QrCodeGenerator text="Hello, World!" />
		</div>
	);
}
