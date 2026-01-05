"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/core/api/authApi";
import { Edit2, Shield } from "lucide-react";
import Link from "next/link";

interface ProfileInfoCardProps {
	user: User | null;
	loading?: boolean;
}

export function ProfileInfoCard({ user, loading }: ProfileInfoCardProps) {
	if (!user) return null;

	const initials = `${user.first_name?.[0] || user.username[0]}${
		user.last_name?.[0] || user.username[1]
	}`.toUpperCase();

	const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle>Profile Information</CardTitle>
				<CardDescription>
					View and manage your account details
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Profile Header */}
				<div className="flex items-start gap-4 pb-6 border-b">
					<Avatar className="h-20 w-20">
						<AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="space-y-1">
							<p className="text-lg font-semibold">
								{user.first_name && user.last_name
									? `${user.first_name} ${user.last_name}`
									: user.username}
							</p>
							<p className="text-sm text-muted-foreground">
								{user.email}
							</p>
						</div>
						<div className="flex items-center gap-2 mt-3">
							{user.is_email_verified ? (
								<Badge
									variant="default"
									className="bg-green-600 hover:bg-green-700 gap-1"
								>
									<Shield className="h-3 w-3" />
									Verified
								</Badge>
							) : (
								<Badge variant="outline" className="gap-1">
									<Shield className="h-3 w-3" />
									Not Verified
								</Badge>
							)}
						</div>
					</div>
				</div>

				{/* Account Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Username
						</p>
						<p className="text-sm font-medium mt-1">
							{user.username}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Email
						</p>
						<p className="text-sm font-medium mt-1">{user.email}</p>
					</div>
					<div>
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							First Name
						</p>
						<p className="text-sm font-medium mt-1">
							{user.first_name || "-"}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Last Name
						</p>
						<p className="text-sm font-medium mt-1">
							{user.last_name || "-"}
						</p>
					</div>
					<div className="col-span-full">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Member Since
						</p>
						<p className="text-sm font-medium mt-1">{joinDate}</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
					<Link href="/dashboard/profile/settings" className="flex-1">
						<Button variant="default" className="w-full gap-2">
							<Edit2 className="h-4 w-4" />
							Edit Profile
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
