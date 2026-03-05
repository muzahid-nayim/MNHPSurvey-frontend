"use client";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { DeleteAccountForm } from "@/components/profile/DeleteAccountForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfileSettingsPage() {
	const { user, loading } = useSelector((state: RootState) => state.auth);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-1">
			{/* Header */}
			<div className="mb-8">
				<Link href="/dashboard/profile">
					<Button variant="ghost" className="gap-2 mb-4">
						<ChevronLeft className="h-4 w-4" />
						Back to Profile
					</Button>
				</Link>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-muted-foreground mt-2">
					Manage your account settings and security preferences
				</p>
			</div>

			{/* Settings Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Edit Profile */}
				<div className="lg:col-span-1">
					<EditProfileForm user={user} />
				</div>

				{/* Change Password */}
				<div className="lg:col-span-1">
					<ChangePasswordForm />
				</div>

				{/* Delete Account - Full Width */}
				<div className="lg:col-span-2">
					<DeleteAccountForm />
				</div>
			</div>

			{/* Info Box */}
				<Card className="text-sm p-5 mt-5">
					<strong>Security Tip:</strong> Keep your password secure and
					change it regularly. Never share your login credentials with
					anyone.
				</Card>
		</div>
	);
}
