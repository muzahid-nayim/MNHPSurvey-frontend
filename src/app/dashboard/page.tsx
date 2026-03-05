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

import { ListIcon, Plus } from "lucide-react";

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
			<h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
				Dashboard
			</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Link href="/dashboard/surveys">
					<Card className="hover:ring ring-ring">
						<CardHeader>
							<CardTitle>Total Surveys</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl sm:text-4xl font-bold">
								{stats.totalSurveys}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/dashboard/surveys">
					<Card className="hover:ring ring-ring">
						<CardHeader>
							<CardTitle>Active Surveys</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl sm:text-4xl font-bold">
								{stats.activeSurveys}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Card className="hover:ring ring-ring">
					<CardHeader>
						<CardTitle>Total Responses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl sm:text-4xl font-bold">
							{stats.totalResponses}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="hover:ring ring-ring">
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Get started with your surveys
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col sm:flex-row gap-3">
					<Link
						href="/dashboard/surveys/create"
						className="w-full sm:w-auto"
					>
						<Button className="w-full sm:w-auto gap-2">
							<Plus className="h-4 w-4" />
							Create New Survey
						</Button>
					</Link>
					<Link
						href="/dashboard/surveys"
						className="w-full sm:w-auto"
					>
						<Button
							variant="outline"
							className="w-full sm:w-auto gap-2"
						>
							<ListIcon className="h-4 w-4" />
							View All Surveys
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
