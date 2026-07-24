// src/app/dashboard/layout.tsx
"use client";

import { useEffect, type ComponentType } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
	LayoutDashboard,
	FileText,
	LogOut,
	Settings,
	BarChart3,
	Menu,
	UserRound,
} from "lucide-react";
import { RootState } from "@/core/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/core/api/authApi";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/core/utils";
import { logout } from "@/core/store/slices/authSlice";
import { UserAvatar } from "@/components/common/UserAvater";
import { toast } from "react-toastify";
import Logo from "@/components/common/logo";

type NavItem = {
	name: string;
	href: string;
	icon: ComponentType<{ className?: string }>;
	current: boolean;
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [logoutMutation] = useLogoutMutation();
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();

	const { isAuthenticated, user, loading } = useSelector(
		(state: RootState) => state.auth,
	);

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			const redirect = pathname !== "/login" ? pathname : "/dashboard";
			router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
		}
	}, [isAuthenticated, router, pathname, loading]);

	const handleLogout = async () => {
		try {
			const storedAuth = localStorage.getItem("auth");
			if (storedAuth) {
				const { refreshToken } = JSON.parse(storedAuth);
				await logoutMutation({ refresh_token: refreshToken });
			}
			dispatch(logout());
			localStorage.removeItem("auth");
			router.push("/login");
			toast.success("Logged out successfully!");
		} catch (error) {
			console.error("Logout failed:", error);
			dispatch(logout());
			localStorage.removeItem("auth");
			setTimeout(() => {
				router.push("/login");
			}, 1000);
			toast.error("Session expired. Please login again.");
		}
	};

	const onSurveys = pathname.startsWith("/dashboard/surveys");
	const onResponses = pathname.includes("/responses");

	// Analytics opens surveys list — real charts live on each survey's responses page
	const mainNav: NavItem[] = [
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
			current: onSurveys && !onResponses,
		},
		{
			name: "Analytics",
			href: "/dashboard/surveys",
			icon: BarChart3,
			current: onResponses,
		},
	];

	const accountNav: NavItem[] = [
		{
			name: "Profile",
			href: "/dashboard/profile",
			icon: UserRound,
			current:
				pathname.startsWith("/dashboard/profile") &&
				!pathname.includes("/settings"),
		},
		{
			name: "Settings",
			href: "/dashboard/settings",
			icon: Settings,
			current:
				pathname === "/dashboard/settings" ||
				pathname.startsWith("/dashboard/profile/settings"),
		},
	];

	if (loading || (!user && !isAuthenticated)) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="w-64 space-y-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="p-8 text-center">
					<h2 className="mb-4 text-2xl font-bold text-foreground">
						Please Login
					</h2>
					<p className="mb-6 text-muted-foreground">
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
		<div className="flex min-h-screen min-w-0 overflow-x-hidden bg-background">
			{/* Desktop Sidebar */}
			<aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
				<SidebarPanel
					mainNav={mainNav}
					accountNav={accountNav}
					onLogout={handleLogout}
				/>
			</aside>

			{/* Mobile top bar */}
			<div className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-card/80 backdrop-blur-md lg:hidden">
				<div className="flex items-center justify-between px-3 py-3">
					<div className="flex items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="rounded-xl">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-[min(20rem,88vw)] border-r border-border/60 bg-card p-0"
							>
								<SheetHeader className="sr-only">
									<SheetTitle>Menu</SheetTitle>
								</SheetHeader>
								<SidebarPanel
									mainNav={mainNav}
									accountNav={accountNav}
									onLogout={handleLogout}
									mobile
								/>
							</SheetContent>
						</Sheet>
						<Logo />
					</div>
					<ThemeToggle />
				</div>
			</div>

			{/* Main */}
			<main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden lg:ml-72">
				<div className="h-14 shrink-0 lg:hidden" />
				<div className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">
					{pathname === "/dashboard" && (
						<header className="mb-6 sm:mb-8">
							<h1 className="text-2xl font-bold text-foreground sm:text-3xl">
								Dashboard
							</h1>
							<p className="mt-1 text-sm text-muted-foreground sm:text-base">
								Welcome back, {user?.username}! Here&apos;s
								what&apos;s happening today.
							</p>
						</header>
					)}
					{children}
				</div>
			</main>
		</div>
	);
}

function SidebarPanel({
	mainNav,
	accountNav,
	onLogout,
	mobile = false,
}: {
	mainNav: NavItem[];
	accountNav: NavItem[];
	onLogout: () => void;
	mobile?: boolean;
}) {
	return (
		<div
			className={cn(
				"relative flex h-full flex-col overflow-hidden",
				!mobile && "border-r border-border/70 bg-card/70 backdrop-blur-xl",
			)}
		>
			{/* soft brand glow — keeps it lively without looking noisy */}
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/2 h-48 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
			/>

			{/* brand */}
			<div className="relative z-10 flex items-center gap-3 border-b border-border/60 px-5 py-5">
				<Logo />
			</div>

			{/* user chip */}
			<div className="relative z-10 border-b border-border/60 px-3 py-3">
				<div className="rounded-2xl border border-border/60 bg-background/50 p-1.5 shadow-sm">
					<UserAvatar />
				</div>
			</div>

			{/* nav */}
			<nav className="relative z-10 flex-1 space-y-5 overflow-y-auto px-3 py-4">
				<NavSection label="Workspace" items={mainNav} />
				<NavSection label="Account" items={accountNav} />
			</nav>

			{/* footer */}
			<div className="relative z-10 space-y-2 border-t border-border/60 p-3">
				<div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3 py-2">
					<span className="text-xs font-medium text-muted-foreground">
						Theme
					</span>
					<ThemeToggle />
				</div>
				<Button
					variant="ghost"
					onClick={onLogout}
					className="h-10 w-full justify-start gap-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
				>
					<LogOut className="h-4 w-4" />
					Log out
				</Button>
			</div>
		</div>
	);
}

function NavSection({
	label,
	items,
}: {
	label: string;
	items: NavItem[];
}) {
	return (
		<div className="space-y-1.5">
			<p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
				{label}
			</p>
			<div className="space-y-1">
				{items.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
								item.current
									? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px] shadow-primary"
									: "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
							)}
						>
							{/* active indicator bar */}
							<span
								className={cn(
									"absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
									item.current
										? "bg-primary-foreground/90 opacity-100"
										: "opacity-0",
								)}
							/>
							<span
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
									item.current
										? "bg-primary-foreground/15"
										: "bg-muted/80 text-foreground/70 group-hover:bg-background group-hover:text-foreground",
								)}
							>
								<Icon className="h-4 w-4" />
							</span>
							{item.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
