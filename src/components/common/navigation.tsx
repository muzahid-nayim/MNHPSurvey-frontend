// frontend/src/components/common/navigation.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, QrCode, FileDown, SquarePen, Menu, X } from "lucide-react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/utils";
import { ThemeToggle } from "./theme-toggle";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";

// Navigation items for the survey platform
const navItems = {
	create: {
		title: "Create",
		items: [
			{
				title: "Analytics",
				href: "/analytics",
				description:
					"View and analyze survey results with interactive charts.",
				icon: <BarChart3 className="h-4 w-4" />,
			},
			{
				title: "QR Codes",
				href: "/qr-codes",
				description: "Generate QR codes for easy survey distribution.",
				icon: <QrCode className="h-4 w-4" />,
			},
			{
				title: "Export",
				href: "/export",
				description: "Download your data in CSV or PDF formats.",
				icon: <FileDown className="h-4 w-4" />,
			},
		],
	},
	main: [
		{ title: "My Surveys", href: "/surveys" },
		{ title: "Templates", href: "/templates" },
		{ title: "Pricing", href: "/pricing" },
	],
};

export function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);
	
	const { isAuthenticated, user, loading } = useSelector(
		(state: RootState) => state.auth
	);
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
			<div className="container mx-auto flex h-16 items-center justify-between">
				{/* Logo/Brand */}
				<Link href="/" className="flex items-center space-x-2 z-10">
					<div className="flex items-center justify-center w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg">
						<SquarePen className="h-4 w-4 text-white" />
					</div>
					<span className="font-bold text-lg bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						MNHPSurvey
					</span>
				</Link>

				{/* Desktop Navigation - Hidden on mobile */}
				<div className="hidden lg:flex items-center space-x-8">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="font-medium">
									Create
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										{navItems.create.items.map((item) => (
											<ListItem
												key={item.title}
												href={item.href}
												title={item.title}
												icon={item.icon}
											>
												{item.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>

							{navItems.main.map((item) => (
								<NavigationMenuItem key={item.href}>
									<Link href={item.href} passHref>
										{item.title}
									</Link>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{/* Desktop User Actions - Hidden on mobile */}

				<div className="hidden lg:flex items-center space-x-4">
					<ThemeToggle />
					{isAuthenticated ? (
						<Link
							href="/dashboard"
							className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
						>
							Dashboard
						</Link>
					) : (
						<>
							<Link
								href="/login"
								className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
							>
								Sign In
							</Link>
							<Link
								href="/signup"
								className="bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md"
							>
								Get Started
							</Link>
						</>
					)}
				</div>

				{/* Mobile Menu Button - Hidden on desktop */}
				<div className="flex lg:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-[85vw] sm:w-[400px] bg-background/95 backdrop-blur-md"
						>
							<SheetHeader className="text-left">
								<SheetTitle className="flex items-center space-x-2">
									<div className="flex items-center justify-center w-6 h-6 bg-linear-to-br from-blue-600 to-purple-600 rounded-md">
										<SquarePen className="h-3 w-3 text-white" />
									</div>
									<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
										MNHPSurvey
									</span>
								</SheetTitle>
							</SheetHeader>

							{/* Mobile Navigation Content */}
							<div className="mt-8 flex flex-col space-y-6">
								{/* Create Section */}
								<div className="space-y-4">
									<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
										Create
									</h3>
									<div className="space-y-2">
										{navItems.create.items.map((item) => (
											<MobileNavItem
												key={item.title}
												href={item.href}
												title={item.title}
												icon={item.icon}
												onOpenChange={setIsOpen}
											>
												{item.description}
											</MobileNavItem>
										))}
									</div>
								</div>

								{/* Main Navigation Items */}
								<div className="space-y-4">
									<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
										Navigation
									</h3>
									<div className="space-y-2">
										{navItems.main.map((item) => (
											<MobileNavItem
												key={item.href}
												href={item.href}
												title={item.title}
												onOpenChange={setIsOpen}
											/>
										))}
									</div>
								</div>

								{/* User Actions */}
								<div className="space-y-3 pt-4 border-t">
									<div className="flex justify-center">
										<ThemeToggle />
									</div>
									{isAuthenticated ? (
										<Link
											href="/dashboard"
											className="block w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
											onClick={() => setIsOpen(false)}
										>
											Dash
										</Link>
									) : (
										<>
											<Link
												href="/login"
												className="block w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
												onClick={() => setIsOpen(false)}
											>
												Sign In
											</Link>
											<Link
												href="/signup"
												className="block w-full text-center bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
												onClick={() => setIsOpen(false)}
											>
												Get Started
											</Link>
										</>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}

interface ListItemProps {
	title: string;
	href: string;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	className?: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
	({ className, title, children, icon, href, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						href={href}
						ref={ref}
						className={cn(
							"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className
						)}
						{...props}
					>
						<div className="flex items-start gap-3">
							{icon && (
								<div className="mt-0.5 text-muted-foreground">
									{icon}
								</div>
							)}
							<div className="space-y-1">
								<div className="text-sm font-medium leading-none">
									{title}
								</div>
								{children && (
									<p className="text-sm leading-snug text-muted-foreground">
										{children}
									</p>
								)}
							</div>
						</div>
					</Link>
				</NavigationMenuLink>
			</li>
		);
	}
);
ListItem.displayName = "ListItem";

interface MobileNavItemProps {
	title: string;
	href: string;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	onOpenChange: (open: boolean) => void;
}

const MobileNavItem = ({
	title,
	href,
	children,
	icon,
	onOpenChange,
}: MobileNavItemProps) => {
	return (
		<Link
			href={href}
			className="flex items-start gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
			onClick={() => onOpenChange(false)}
		>
			{icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
			<div className="space-y-1">
				<div className="font-medium leading-none">{title}</div>
				{children && (
					<p className="text-xs leading-snug text-muted-foreground">
						{children}
					</p>
				)}
			</div>
		</Link>
	);
};
