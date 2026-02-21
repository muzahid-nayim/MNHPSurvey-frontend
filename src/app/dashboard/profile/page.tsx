"use client";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, MessageSquare } from "lucide-react";
import { useGetProfileQuery } from "@/core/api/authApi";

export default function ProfilePage() {
	// const { isAuthenticated, user, loading } = useSelector(
	// 	(state: RootState) => state.auth
	// );

	const { data: user, isLoading: loading, isLoading, error } = useGetProfileQuery();

	console.log("user data in profile page:", user);


	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Profile</h1>
				<p className="text-muted-foreground mt-2">
					Manage your account and view your activity
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Profile Card */}
				<div className="lg:col-span-2">
					{ user && <ProfileInfoCard user={user} loading={loading} /> }
				</div>

				{/* Quick Stats */}
				<div className="space-y-4">
					{/* Account Status */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">
								Account Status
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Email Verification
								</span>
								{user?.is_email_verified ? (
									<Badge className="bg-green-600">
										Verified
									</Badge>
								) : (
									<Badge variant="outline">Pending</Badge>
								)}
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Account Status
								</span>
								<Badge className="bg-blue-600">Active</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Quick Links */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Resources</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<a
								href="/dashboard"
								className="block text-sm text-blue-600 hover:underline"
							>
								← Back to Dashboard
							</a>
							<a
								href="/dashboard/surveys"
								className="block text-sm text-blue-600 hover:underline"
							>
								View Surveys
							</a>
							<a
								href="/dashboard/profile/settings"
								className="block text-sm text-blue-600 hover:underline"
							>
								Settings →
							</a>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
