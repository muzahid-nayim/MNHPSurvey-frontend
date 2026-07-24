"use client";

import { useGetProfileQuery } from "@/core/api/authApi";
import { AvatarUploadCard } from "@/components/profile/AvatarUploadCard";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { DeleteAccountForm } from "@/components/profile/DeleteAccountForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileSettingsPage() {
	const { data: user, isLoading } = useGetProfileQuery();

	if (isLoading) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="w-full min-w-0 max-w-5xl space-y-5 sm:space-y-6">
			<div>
				<Link href="/dashboard/profile">
					<Button variant="ghost" size="sm" className="mb-2 gap-1.5 px-0 sm:px-2">
						<ChevronLeft className="h-4 w-4" />
						Back to profile
					</Button>
				</Link>
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Settings
				</h1>
				<p className="mt-1 text-sm text-muted-foreground sm:text-base">
					Update your photo, personal details, and security
				</p>
			</div>

			{/* photo first — most visible change */}
			{user && <AvatarUploadCard user={user} />}

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<EditProfileForm user={user ?? null} />
				<ChangePasswordForm />
			</div>

			<DeleteAccountForm />

			<Card className="border-dashed">
				<CardContent className="flex gap-3 p-4 text-sm text-muted-foreground">
					<Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
					<p>
						<strong className="text-foreground">Security tip:</strong>{" "}
						Use a strong unique password and never share your login
						details with anyone.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
