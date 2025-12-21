// src/app/(dashboard)/layout.tsx
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/core/api/authApi";
import { useDispatch } from "react-redux";
import Link from "next/link";
import {
	LayoutDashboard,
	FileText,
	User,
	LogOut,
	Settings,
	BarChart3,
	SquarePen,
	Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/core/utils";
import { logout } from "@/core/store/slices/authSlice";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();

	const { isAuthenticated, user, loading } = useSelector(
		(state: RootState) => state.auth
	);
	const [logoutMutation] = useLogoutMutation();

	// Redirect if not authenticated
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			const redirect = pathname !== "/login" ? pathname : "/dashboard";
			router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
		}
	}, [isAuthenticated, router, pathname, loading]);

	const handleLogout = async () => {
		try {
			if (typeof window !== "undefined") {
				const storedAuth = localStorage.getItem("auth");
				if (storedAuth) {
					const { refreshToken } = JSON.parse(storedAuth);
					await logoutMutation({ refresh_token: refreshToken });
				}
			}
			dispatch(logout());
			localStorage.removeItem("auth");
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			dispatch(logout());
			localStorage.removeItem("auth");
			router.push("/login");
		}
	};

	// Navigation items
	const navigation = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: LayoutDashboard,
			current: pathname === "/dashboard",
		},
		{
			name: "Surveys",
			href: "/dashboard/surveys",
			icon: FileText,
			current: pathname.startsWith("/dashboard/surveys"),
		},
		{
			name: "Analytics",
			href: "/dashboard/analytics",
			icon: BarChart3,
			current: pathname.startsWith("/dashboard/analytics"),
		},
		{
			name: "Profile",
			href: "/dashboard/profile",
			icon: User,
			current: pathname === "/dashboard/profile",
		},
		{
			name: "Settings",
			href: "/dashboard/settings",
			icon: Settings,
			current: pathname === "/dashboard/settings",
		},
	];

	// Show loading state while checking auth
	if (loading || (!user && !isAuthenticated)) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="space-y-4 w-64">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			</div>
		);
	}

	// Show error state if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-2xl font-bold mb-4 text-foreground">
						Please Login
					</h2>
					<p className="text-muted-foreground mb-6">
						You need to be authenticated to access the dashboard.
					</p>
					<Button onClick={() => router.push("/login")}>
						Go to Login
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex">
			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
				<div className="flex flex-col flex-1 border-r border-border bg-card/50 backdrop-blur-sm">
					{/* Sidebar Header */}
					<div className="flex items-center gap-3 p-6 border-b border-border">
						<div className="flex items-center justify-center w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg">
							<SquarePen className="h-4 w-4 text-white" />
						</div>
						<Link href={"/"} className="font-bold text-lg bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
							MNHPSurvey
						</Link>
					</div>

					{/* User Info */}
					<div className="flex items-center gap-3 p-6 border-b border-border">
						<div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
							{user?.username?.charAt(0).toUpperCase() || "U"}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-medium text-foreground truncate">
								{user?.username}
							</p>
							<p className="text-sm text-muted-foreground truncate">
								{user?.email}
							</p>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2">
						{navigation.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
										item.current
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground hover:bg-accent"
									)}
								>
									<Icon className="h-4 w-4" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* Sidebar Footer */}
					<div className="p-4 border-t border-border space-y-2">
						<div className="flex items-center justify-between px-3 py-2">
							<ThemeToggle />
							<span className="text-sm text-muted-foreground">
								Theme
							</span>
						</div>
						<Button
							variant="outline"
							onClick={handleLogout}
							className="w-full justify-start gap-3 border-border text-muted-foreground hover:text-foreground"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</aside>

			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-64 p-0 bg-card/95 backdrop-blur-md"
							>
								<SheetHeader>
									<SheetTitle>Navigation Menu</SheetTitle>{" "}
									{/* ← ADD THIS */}
								</SheetHeader>
								<div className="flex flex-col h-full">
									{/* Mobile Sidebar Header */}
									<div className="flex items-center gap-3 p-6 border-b border-border">
										<div className="flex items-center justify-center w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg">
											<SquarePen className="h-4 w-4 text-white" />
										</div>
										<span className="font-bold text-lg bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
											MNHPSurvey
										</span>
									</div>

									{/* Mobile User Info */}
									<div className="flex items-center gap-3 p-6 border-b border-border">
										<div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
											{user?.username
												?.charAt(0)
												.toUpperCase() || "U"}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-foreground truncate">
												{user?.username}
											</p>
											<p className="text-sm text-muted-foreground truncate">
												{user?.email}
											</p>
										</div>
									</div>

									{/* Mobile Navigation */}
									<nav className="flex-1 p-4 space-y-2">
										{navigation.map((item) => {
											const Icon = item.icon;
											return (
												<Link
													key={item.name}
													href={item.href}
													className={cn(
														"group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
														item.current
															? "bg-primary text-primary-foreground shadow-sm"
															: "text-muted-foreground hover:text-foreground hover:bg-accent"
													)}
												>
													<Icon className="h-4 w-4" />
													{item.name}
												</Link>
											);
										})}
									</nav>

									{/* Mobile Sidebar Footer */}
									<div className="p-4 border-t border-border space-y-2">
										<div className="flex items-center justify-between px-3 py-2">
											<ThemeToggle />
											<span className="text-sm text-muted-foreground">
												Theme
											</span>
										</div>
										<Button
											variant="outline"
											onClick={handleLogout}
											className="w-full justify-start gap-3 border-border text-muted-foreground hover:text-foreground"
										>
											<LogOut className="h-4 w-4" />
											Logout
										</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center w-6 h-6 bg-linear-to-br from-blue-600 to-purple-600 rounded">
								<SquarePen className="h-3 w-3 text-white" />
							</div>
							<span className="font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
								MNHPSurvey
							</span>
						</div>
					</div>
					<ThemeToggle />
				</div>
			</div>

			{/* Main Content */}
			<main
				className={cn(
					"flex-1 flex flex-col min-h-screen transition-all duration-300",
					"lg:ml-64" // Account for sidebar on desktop
				)}
			>
				{/* Mobile spacing */}
				<div className="lg:hidden h-16" />

				{/* Content Area */}
				<div className="flex-1 p-6">
					<header className="mb-8">
						<h1 className="text-3xl font-bold text-foreground">
							Dashboard
						</h1>
						<p className="text-muted-foreground mt-2">
							Welcome back, {user?.username}! Here's what's
							happening today.
						</p>
					</header>

					{children}
				</div>
			</main>
		</div>
	);
}
