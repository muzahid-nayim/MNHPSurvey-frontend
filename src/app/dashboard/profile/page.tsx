"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProfileQuery } from "@/core/api/authApi";
import {
	FileText,
	LayoutDashboard,
	Settings,
	ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
	const { data: user, isLoading: loading } = useGetProfileQuery();

	if (loading) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="w-full min-w-0 max-w-5xl space-y-5 sm:space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Profile
				</h1>
				<p className="mt-1 text-sm text-muted-foreground sm:text-base">
					Your account overview and quick links
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
				<div className="min-w-0 lg:col-span-2">
					{user && <ProfileInfoCard user={user} />}
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-sm">
								<ShieldCheck className="h-4 w-4 text-primary" />
								Account status
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between gap-2">
								<span className="text-sm text-muted-foreground">
									Email
								</span>
								{user?.is_email_verified ? (
									<Badge className="bg-emerald-600 hover:bg-emerald-600">
										Verified
									</Badge>
								) : (
									<Badge variant="outline">Pending</Badge>
								)}
							</div>
							<div className="flex items-center justify-between gap-2">
								<span className="text-sm text-muted-foreground">
									Status
								</span>
								<Badge variant="secondary">Active</Badge>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Quick links</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<QuickLink
								href="/dashboard"
								icon={<LayoutDashboard className="h-4 w-4" />}
								label="Dashboard"
							/>
							<QuickLink
								href="/dashboard/surveys"
								icon={<FileText className="h-4 w-4" />}
								label="My surveys"
							/>
							<QuickLink
								href="/dashboard/profile/settings"
								icon={<Settings className="h-4 w-4" />}
								label="Settings"
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

function QuickLink({
	href,
	icon,
	label,
}: {
	href: string;
	icon: ReactNode;
	label: string;
}) {
	return (
		<Link href={href} className="block">
			<Button
				variant="ghost"
				className="h-auto w-full justify-start gap-2 px-3 py-2.5 text-sm"
			>
				<span className="text-muted-foreground">{icon}</span>
				{label}
			</Button>
		</Link>
	);
}
