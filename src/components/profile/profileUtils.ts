// small helpers for profile UI
import type { User } from "@/core/api/authApi";

export function getUserInitials(user: Pick<User, "username" | "first_name" | "last_name">) {
	const first = user.first_name?.[0] || user.username?.[0] || "?";
	const second =
		user.last_name?.[0] || user.username?.[1] || user.username?.[0] || "";
	return `${first}${second}`.toUpperCase();
}

export function getDisplayName(user: Pick<User, "username" | "first_name" | "last_name">) {
	const full = `${user.first_name || ""} ${user.last_name || ""}`.trim();
	return full || user.username;
}
