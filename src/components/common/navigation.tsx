"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, QrCode, FileDown, Menu, ChevronRight } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import Logo from "@/components/common/logo";
import { ScrollArea } from "../ui/scroll-area";

const tools = [
	{
		title: "Analytics",
		href: "/dashboard/surveys",
		description: "Interactive charts and response breakdowns.",
		icon: <BarChart3 className="h-4 w-4" />,
		color: "text-blue-400",
		glow: "group-hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]",
	},
	{
		title: "QR Codes",
		href: "/dashboard/surveys",
		description: "Generate QR codes for instant survey sharing.",
		icon: <QrCode className="h-4 w-4" />,
		color: "text-violet-400",
		glow: "group-hover:drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]",
	},
	{
		title: "Export",
		href: "/dashboard/surveys",
		description: "Download results as CSV or PDF.",
		icon: <FileDown className="h-4 w-4" />,
		color: "text-emerald-400",
		glow: "group-hover:drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]",
	},
];

const mainLinks = [
	{ title: "My Surveys", href: "/dashboard/surveys" },
	{ title: "About", href: "/about" },
];

export function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);
	const [toolsOpen, setToolsOpen] = React.useState(false);
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	return (
		<header className="sticky top-0 z-50 w-full">
			{/* Glass bar */}
			<div className="border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">

					{/* Left — Logo */}
					<Logo />

					{/* Center — Desktop Nav */}
					<nav className="hidden lg:flex items-center gap-1">

						{/* Tools dropdown */}
						<div
							className="relative"
							onMouseEnter={() => setToolsOpen(true)}
							onMouseLeave={() => setToolsOpen(false)}
						>
							<button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
								Tools
								<ChevronRight
									className={`w-3.5 h-3.5 transition-transform duration-100 ${toolsOpen ? "rotate-90" : ""}`}
								/>
							</button>

							{/* Dropdown panel */}
							<div
								className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-xl p-2 transition-all duration-200 origin-top ${
									toolsOpen
										? "opacity-100 scale-100 pointer-events-auto"
										: "opacity-0 scale-95 pointer-events-none"
								}`}
							>
								{tools.map((tool) => (
									<Link
										key={tool.title}
										href={tool.href}
										className="group flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition-colors duration-150"
									>
										<div className={`mt-0.5 ${tool.color} ${tool.glow} transition-all duration-200`}>
											{tool.icon}
										</div>
										<div>
											<p className="text-sm font-semibold text-foreground">{tool.title}</p>
											<p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* Main links */}
						{mainLinks.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
							>
								{item.title}
							</Link>
						))}
					</nav>

					{/* Right — Actions */}
					<div className="hidden lg:flex items-center gap-3">
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
									className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
								>
									Sign In
								</Link>
								<Link
									href="/signup"
									className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-primary/20"
								>
									Get Started
									<ChevronRight className="w-3.5 h-3.5" />
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu */}
					<div className="flex lg:hidden">
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="h-9 w-9">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[85vw] sm:w-[360px] p-0 border-border">
								<ScrollArea className="h-full">
									<div className="flex flex-col h-full">
										<SheetHeader className="p-6 pb-4 border-b border-border">
											<SheetTitle>
												<Logo />
											</SheetTitle>
										</SheetHeader>

										<div className="px-4 py-6 flex flex-col gap-6">

											{/* Tools */}
											<div>
												<p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">Tools</p>
												<div className="flex flex-col gap-1">
													{tools.map((tool) => (
														<Link
															key={tool.title}
															href={tool.href}
															onClick={() => setIsOpen(false)}
															className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition-colors"
														>
															<div className={`mt-0.5 ${tool.color}`}>{tool.icon}</div>
															<div>
																<p className="text-sm font-semibold">{tool.title}</p>
																<p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
															</div>
														</Link>
													))}
												</div>
											</div>

											{/* Main links */}
											<div>
												<p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">Navigation</p>
												<div className="flex flex-col gap-1">
													{mainLinks.map((item) => (
														<Link
															key={item.href}
															href={item.href}
															onClick={() => setIsOpen(false)}
															className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
														>
															{item.title}
															<ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
														</Link>
													))}
												</div>
											</div>

											{/* Bottom — theme + auth */}
											<div className="pt-4 border-t border-border flex flex-col gap-3">
												<div className="px-2">
													<ThemeToggle />
												</div>

												{isAuthenticated ? (
													<Link
														href="/dashboard"
														onClick={() => setIsOpen(false)}
														className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
													>
														Dashboard
														<ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
													</Link>
												) : (
													<>
														<Link
															href="/login"
															onClick={() => setIsOpen(false)}
															className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
														>
															Sign In
															<ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
														</Link>
														<Link
															href="/signup"
															onClick={() => setIsOpen(false)}
															className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all"
														>
															Get Started
															<ChevronRight className="w-3.5 h-3.5" />
														</Link>
													</>
												)}
											</div>
										</div>
									</div>
								</ScrollArea>
							</SheetContent>
						</Sheet>
					</div>

				</div>
			</div>
		</header>
	);
}