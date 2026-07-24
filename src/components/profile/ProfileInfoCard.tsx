"use client";

import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/core/api/authApi";
import { CalendarDays, Edit2, Mail, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { getDisplayName, getUserInitials } from "./profileUtils";

interface ProfileInfoCardProps {
	user: User | null;
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
	if (!user) return null;

	const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Card className="overflow-hidden">
			{/* soft top band */}
			<div className="h-20 bg-linear-to-r from-primary/20 via-primary/10 to-transparent sm:h-24" />

			<CardHeader className="-mt-12 space-y-0 pb-4 sm:-mt-14">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex items-end gap-3 sm:gap-4">
						<Avatar className="h-20 w-20 border-4 border-card shadow-sm sm:h-24 sm:w-24">
							<AvatarImage
								src={user.avatar || undefined}
								alt={getDisplayName(user)}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground sm:text-xl">
								{getUserInitials(user)}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 pb-1">
							<CardTitle className="truncate text-xl sm:text-2xl">
								{getDisplayName(user)}
							</CardTitle>
							<CardDescription className="mt-0.5 truncate">
								@{user.username}
							</CardDescription>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{user.is_email_verified ? (
							<Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
								<Shield className="h-3 w-3" />
								Verified
							</Badge>
						) : (
							<Badge variant="outline" className="gap-1">
								<Shield className="h-3 w-3" />
								Not verified
							</Badge>
						)}
						<Link href="/dashboard/profile/settings">
							<Button size="sm" className="gap-1.5">
								<Edit2 className="h-3.5 w-3.5" />
								Edit profile
							</Button>
						</Link>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-5 pt-0">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<InfoRow
						icon={<Mail className="h-4 w-4" />}
						label="Email"
						value={user.email}
					/>
					<InfoRow
						icon={<UserRound className="h-4 w-4" />}
						label="Username"
						value={user.username}
					/>
					<InfoRow
						icon={<UserRound className="h-4 w-4" />}
						label="First name"
						value={user.first_name || "—"}
					/>
					<InfoRow
						icon={<UserRound className="h-4 w-4" />}
						label="Last name"
						value={user.last_name || "—"}
					/>
					<div className="sm:col-span-2">
						<InfoRow
							icon={<CalendarDays className="h-4 w-4" />}
							label="Member since"
							value={joinDate}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function InfoRow({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
			<span className="mt-0.5 text-muted-foreground">{icon}</span>
			<div className="min-w-0">
				<p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<p className="truncate text-sm font-medium">{value}</p>
			</div>
		</div>
	);
}
