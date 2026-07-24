// src/components/common/UserAvatar.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { logout } from "@/core/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/core/api/authApi";
import { toast } from "react-toastify";
import Link from "next/link";
import { RootState } from "@/core/store";
import { getUserInitials } from "@/components/profile/profileUtils";

export function UserAvatar() {
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch();
	const router = useRouter();
	const [logoutMutation] = useLogoutMutation();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const storedAuth = localStorage.getItem("auth");
			if (storedAuth) {
				const { refreshToken } = JSON.parse(storedAuth);
				await logoutMutation({ refresh_token: refreshToken });
			}
			dispatch(logout());
			localStorage.removeItem("auth");
			toast.success("Logged out successfully!");
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			dispatch(logout());
			localStorage.removeItem("auth");
			toast.error("Session expired. Please login again.");
			router.push("/login");
		} finally {
			setIsLoggingOut(false);
		}
	};

	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-auto py-2 px-3 rounded-full md:rounded-lg hover:bg-accent/50 
               transition-all duration-200 hover:scale-[1.02] group
               flex items-center gap-3 cursor-pointer border-0
               focus:outline-none focus:ring-0 focus:ring-offset-0 
               focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<div className="hidden md:flex flex-col items-end">
						<p className="text-sm font-medium leading-none text-foreground truncate max-w-[130px]">
							Hello, {user.username}!
						</p>
						<p className="text-xs leading-none text-muted-foreground truncate max-w-[130px]">
							{user.email}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={user.avatar || undefined}
								alt={user.username}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary font-semibold text-primary-foreground">
								{getUserInitials(user)}
							</AvatarFallback>
						</Avatar>
						<ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 mr-4 mt-2"
				align="end"
				forceMount
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.username}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/profile"
							className="flex items-center gap-2 cursor-pointer"
						>
							<User className="h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/profile/settings"
							className="flex items-center gap-2 cursor-pointer"
						>
							<Settings className="h-4 w-4" />
							<span>Profile Settings</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}
					disabled={isLoggingOut}
					className="text-red-600 focus:text-red-700 focus:bg-red-50"
				>
					<LogOut className="h-4 w-4 mr-2" />
					<span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
