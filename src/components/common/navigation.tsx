// frontend/src/components/common/navigation.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, QrCode, FileDown, Menu } from "lucide-react";

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
import Logo from "@/components/common/logo";
import { ScrollArea } from "../ui/scroll-area";

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
	],
};

export function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);

	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Logo />

				{/* Desktop Navigation - Hidden on mobile */}
				<div className="hidden lg:flex lg:items-center lg:gap-6">
					<NavigationMenu>
						<NavigationMenuList className="gap-2">
							{/* Create dropdown */}
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-sm font-medium text-foreground transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=open]:after:scale-x-100">
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

							{/* Main navigation items */}
							{navItems.main.map((item) => (
								<NavigationMenuItem key={item.href}>
									<Link
										href={item.href}
										className="relative py-2 text-sm font-medium text-foreground transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
									>
										{item.title}
									</Link>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>

					{/* Theme toggle and auth buttons - now part of same flex row */}
					<div className="flex items-center gap-3">
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
									className="bg-gradient-to-r from-gradient-l to-gradient-r text-white hover:from-gradient-l/90 hover:to-gradient-r/90 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md"
								>
									Get Started
								</Link>
							</>
						)}
					</div>
				</div>

				{/* Mobile Menu Button */}
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
							className="w-[85vw] sm:w-[380px] p-0"
						>
							<ScrollArea className="h-full">
								<div className="flex flex-col h-full">
									<SheetHeader className="p-6 pb-2">
										<SheetTitle className="flex items-center gap-2">
											<Logo />
										</SheetTitle>
									</SheetHeader>

									<div className="flex-1 overflow-y-auto px-6 py-4">
										<nav className="flex flex-col space-y-6">
											{/* Create Section */}
											<div className="space-y-3">
												<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
													Create
												</h4>
												<div className="space-y-1">
													{navItems.create.items.map(
														(item) => (
															<MobileNavItem
																key={item.title}
																href={item.href}
																title={
																	item.title
																}
																icon={item.icon}
																onOpenChange={
																	setIsOpen
																}
															>
																{
																	item.description
																}
															</MobileNavItem>
														),
													)}
												</div>
											</div>

											{/* Main Navigation */}
											<div className="space-y-3">
												<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
													Navigation
												</h4>
												<div className="space-y-1">
													{navItems.main.map(
														(item) => (
															<MobileNavItem
																key={item.href}
																href={item.href}
																title={
																	item.title
																}
																onOpenChange={
																	setIsOpen
																}
															/>
														),
													)}
												</div>
											</div>

											{/* Auth Section */}
											<div className="space-y-3 pt-4 border-t">
												<div className="flex justify-start">
													<ThemeToggle />
												</div>
												{isAuthenticated ? (
													<Link
														href="/dashboard"
														className="flex w-full items-center rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
														onClick={() =>
															setIsOpen(false)
														}
													>
														Dashboard
													</Link>
												) : (
													<>
														<Link
															href="/login"
															className="flex w-full items-center rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
															onClick={() =>
																setIsOpen(false)
															}
														>
															Sign In
														</Link>
														<Link
															href="/signup"
															className="flex w-full items-center justify-center bg-gradient-to-r from-gradient-l to-gradient-r text-white hover:from-gradient-l/90 hover:to-gradient-r/90 rounded-md px-4 py-3 text-sm font-medium shadow-sm"
															onClick={() =>
																setIsOpen(false)
															}
														>
															Get Started
														</Link>
													</>
												)}
											</div>
										</nav>
									</div>
								</div>
							</ScrollArea>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}

// Desktop list item (used in dropdown)
const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & {
		title: string;
		icon?: React.ReactNode;
	}
>(({ className, title, children, icon, href, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					href={href || "#"}
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="flex items-start gap-3">
						{icon && (
							<div className="mt-0.5 text-muted-foreground">
								{icon}
							</div>
						)}
						<div>
							<div className="text-sm font-medium leading-none">
								{title}
							</div>
							{children && (
								<p className="mt-1 text-sm leading-snug text-muted-foreground">
									{children}
								</p>
							)}
						</div>
					</div>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

// Mobile navigation item
const MobileNavItem = ({
	href,
	title,
	children,
	icon,
	onOpenChange,
}: {
	href: string;
	title: string;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	onOpenChange: (open: boolean) => void;
}) => {
	return (
		<Link
			href={href}
			className="flex items-start gap-3 rounded-md p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
			onClick={() => onOpenChange(false)}
		>
			{icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
			<div>
				<div className="font-medium">{title}</div>
				{children && (
					<p className="text-xs text-muted-foreground mt-1">
						{children}
					</p>
				)}
			</div>
		</Link>
	);
};
